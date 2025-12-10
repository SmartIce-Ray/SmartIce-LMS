<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '@/stores/exam'
import {
  Trophy,
  XCircle,
  CheckCircle,
  Clock,
  RotateCcw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-vue-next'
import SingleChoice from '@/components/exam/SingleChoice.vue'
import MultiChoice from '@/components/exam/MultiChoice.vue'
import TrueFalse from '@/components/exam/TrueFalse.vue'
import FillBlank from '@/components/exam/FillBlank.vue'
import QuestionNav from '@/components/exam/QuestionNav.vue'

const route = useRoute()
const router = useRouter()
const examStore = useExamStore()

const examId = computed(() => Number(route.params.examId))
const attemptId = computed(() => Number(route.params.attemptId))

// 展开的题目
const expandedQuestions = ref<Set<number>>(new Set())

// 切换展开
const toggleQuestion = (questionId: number) => {
  if (expandedQuestions.value.has(questionId)) {
    expandedQuestions.value.delete(questionId)
  } else {
    expandedQuestions.value.add(questionId)
  }
}

// 全部展开/收起
const expandAll = () => {
  if (expandedQuestions.value.size === examStore.currentQuestions.length) {
    expandedQuestions.value.clear()
  } else {
    examStore.currentQuestions.forEach(q => expandedQuestions.value.add(q.id))
  }
}

// 格式化时间
const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}秒`
  return s > 0 ? `${m}分${s}秒` : `${m}分钟`
}

// 获取答案
const getAnswer = (questionId: number) => {
  return examStore.examResult?.answers.find(a => a.questionId === questionId)
}

// 正确/错误题目ID列表
const correctIds = computed(() => {
  return examStore.examResult?.answers
    .filter(a => a.isCorrect)
    .map(a => a.questionId) || []
})

const wrongIds = computed(() => {
  return examStore.examResult?.answers
    .filter(a => !a.isCorrect)
    .map(a => a.questionId) || []
})

// 问题状态
const questionStatuses = computed(() => {
  return examStore.currentQuestions.map(q => ({
    id: q.id,
    answered: true
  }))
})

// 重新考试
const retakeExam = () => {
  examStore.resetExam()
  router.replace({ name: 'TakeExam', params: { examId: examId.value } })
}

// 返回课程
const goBack = () => {
  if (examStore.currentExam?.courseId) {
    router.push({ name: 'CourseDetail', params: { id: examStore.currentExam.courseId } })
  } else {
    router.push({ name: 'Courses' })
  }
}

// 加载数据
onMounted(async () => {
  await examStore.fetchExamResult(attemptId.value)
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 加载状态 -->
    <div v-if="examStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>

    <template v-else-if="examStore.examResult">
      <!-- 成绩卡片 -->
      <div
        class="relative overflow-hidden"
        :class="examStore.examResult.attempt.isPassed ? 'bg-success/10' : 'bg-destructive/10'"
      >
        <div class="max-w-2xl mx-auto px-4 py-8 text-center relative z-10">
          <!-- 图标 -->
          <div
            class="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
            :class="examStore.examResult.attempt.isPassed ? 'bg-success/20' : 'bg-destructive/20'"
          >
            <Trophy
              v-if="examStore.examResult.attempt.isPassed"
              class="w-10 h-10 text-success"
            />
            <XCircle
              v-else
              class="w-10 h-10 text-destructive"
            />
          </div>

          <!-- 状态文字 -->
          <h1
            class="text-2xl font-bold mb-2"
            :class="examStore.examResult.attempt.isPassed ? 'text-success' : 'text-destructive'"
          >
            {{ examStore.examResult.attempt.isPassed ? '恭喜通过！' : '未能通过' }}
          </h1>

          <!-- 分数 -->
          <div class="flex items-baseline justify-center gap-1 mb-4">
            <span
              class="text-5xl font-bold"
              :class="examStore.examResult.attempt.isPassed ? 'text-success' : 'text-destructive'"
            >
              {{ examStore.examResult.attempt.score }}
            </span>
            <span class="text-xl text-muted-foreground">
              / {{ examStore.examResult.attempt.totalScore }} 分
            </span>
          </div>

          <!-- 及格线 -->
          <p class="text-sm text-muted-foreground">
            及格分数：{{ examStore.examResult.exam.passingScore }} 分
          </p>
        </div>

        <!-- 装饰 -->
        <div
          v-if="examStore.examResult.attempt.isPassed"
          class="absolute inset-0 opacity-10"
          style="background: radial-gradient(circle at 50% 0%, currentColor 0%, transparent 70%);"
        />
      </div>

      <!-- 统计信息 -->
      <div class="max-w-2xl mx-auto px-4 py-6">
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="bg-card rounded-xl border border-border p-4 text-center">
            <div class="flex items-center justify-center gap-1 text-success mb-1">
              <CheckCircle class="w-5 h-5" />
              <span class="font-bold text-xl">{{ examStore.examResult.correctCount }}</span>
            </div>
            <div class="text-xs text-muted-foreground">正确</div>
          </div>
          <div class="bg-card rounded-xl border border-border p-4 text-center">
            <div class="flex items-center justify-center gap-1 text-destructive mb-1">
              <XCircle class="w-5 h-5" />
              <span class="font-bold text-xl">{{ examStore.examResult.wrongCount }}</span>
            </div>
            <div class="text-xs text-muted-foreground">错误</div>
          </div>
          <div class="bg-card rounded-xl border border-border p-4 text-center">
            <div class="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock class="w-5 h-5" />
              <span class="font-bold text-xl">{{ formatDuration(examStore.examResult.attempt.timeSpentSeconds) }}</span>
            </div>
            <div class="text-xs text-muted-foreground">用时</div>
          </div>
        </div>

        <!-- 答题卡 -->
        <QuestionNav
          :questions="questionStatuses"
          :current-index="-1"
          :show-results="true"
          :correct-ids="correctIds"
          :wrong-ids="wrongIds"
          @navigate="(i: number) => toggleQuestion(examStore.currentQuestions[i].id)"
        />

        <!-- 操作按钮 -->
        <div class="flex gap-3 mt-6">
          <button
            class="flex-1 flex items-center justify-center gap-2 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-all"
            @click="goBack"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>返回课程</span>
          </button>
          <button
            v-if="!examStore.examResult.attempt.isPassed"
            class="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all"
            @click="retakeExam"
          >
            <RotateCcw class="w-5 h-5" />
            <span>重新考试</span>
          </button>
        </div>
      </div>

      <!-- 答案解析 -->
      <div
        v-if="examStore.examResult.exam.showAnswerAfter"
        class="max-w-2xl mx-auto px-4 pb-8"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-foreground">答案解析</h2>
          <button
            class="text-sm text-primary hover:underline"
            @click="expandAll"
          >
            {{ expandedQuestions.size === examStore.currentQuestions.length ? '收起全部' : '展开全部' }}
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="(question, index) in examStore.currentQuestions"
            :key="question.id"
            class="bg-card rounded-xl border border-border overflow-hidden"
          >
            <!-- 题目头部 -->
            <button
              class="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
              @click="toggleQuestion(question.id)"
            >
              <!-- 状态图标 -->
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                :class="correctIds.includes(question.id) ? 'bg-success/20' : 'bg-destructive/20'"
              >
                <CheckCircle
                  v-if="correctIds.includes(question.id)"
                  class="w-4 h-4 text-success"
                />
                <XCircle
                  v-else
                  class="w-4 h-4 text-destructive"
                />
              </div>

              <!-- 题目信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span>第 {{ index + 1 }} 题</span>
                  <span class="px-1.5 py-0.5 bg-muted rounded text-xs">
                    {{ question.score }} 分
                  </span>
                </div>
                <p class="text-foreground line-clamp-1">{{ question.text }}</p>
              </div>

              <!-- 展开图标 -->
              <ChevronDown
                v-if="!expandedQuestions.has(question.id)"
                class="w-5 h-5 text-muted-foreground flex-shrink-0"
              />
              <ChevronUp
                v-else
                class="w-5 h-5 text-muted-foreground flex-shrink-0"
              />
            </button>

            <!-- 展开内容 -->
            <Transition name="expand">
              <div v-if="expandedQuestions.has(question.id)" class="px-4 pb-4">
                <div class="pt-3 border-t border-border">
                  <!-- 题目组件（显示答案模式） -->
                  <SingleChoice
                    v-if="question.type === 'single'"
                    :question-id="question.id"
                    :text="question.text"
                    :options="question.options || []"
                    :selected-answer="getAnswer(question.id)?.answer as string"
                    :correct-answer="question.correctAnswer as string"
                    :show-answer="true"
                    :disabled="true"
                  />

                  <MultiChoice
                    v-else-if="question.type === 'multi'"
                    :question-id="question.id"
                    :text="question.text"
                    :options="question.options || []"
                    :selected-answers="(getAnswer(question.id)?.answer as string[]) || []"
                    :correct-answers="question.correctAnswer as string[]"
                    :show-answer="true"
                    :disabled="true"
                  />

                  <TrueFalse
                    v-else-if="question.type === 'true_false'"
                    :question-id="question.id"
                    :text="question.text"
                    :selected-answer="getAnswer(question.id)?.answer as string"
                    :correct-answer="question.correctAnswer as string"
                    :show-answer="true"
                    :disabled="true"
                  />

                  <FillBlank
                    v-else-if="question.type === 'fill'"
                    :question-id="question.id"
                    :text="question.text"
                    :selected-answer="getAnswer(question.id)?.answer as string"
                    :correct-answer="question.correctAnswer as string"
                    :show-answer="true"
                    :disabled="true"
                  />

                  <!-- 解析 -->
                  <div
                    v-if="question.explanation"
                    class="mt-4 p-3 bg-info/10 rounded-lg border border-info/20"
                  >
                    <div class="flex items-start gap-2">
                      <HelpCircle class="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
                      <div>
                        <div class="text-xs font-medium text-info mb-1">解析</div>
                        <p class="text-sm text-muted-foreground">{{ question.explanation }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- 不显示答案时的提示 -->
      <div
        v-else
        class="max-w-2xl mx-auto px-4 pb-8"
      >
        <div class="p-4 bg-muted/50 rounded-xl text-center text-muted-foreground">
          <HelpCircle class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p class="text-sm">本次考试不显示答案解析</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>
