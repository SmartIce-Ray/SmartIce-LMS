<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamStore } from '@/stores/exam'
import {
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  FileQuestion,
  Timer,
  RotateCcw
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

// 状态
const phase = ref<'intro' | 'exam' | 'submitting'>('intro')
const currentQuestionIndex = ref(0)
const showNavPanel = ref(false)
const showSubmitConfirm = ref(false)

// 计时器
const remainingSeconds = ref(0)
const timerInterval = ref<number | null>(null)

// 当前题目
const currentQuestion = computed(() => {
  if (!examStore.currentQuestions.length) return null
  return examStore.currentQuestions[currentQuestionIndex.value]
})

// 当前答案
const currentAnswer = computed(() => {
  if (!currentQuestion.value) return null
  return examStore.answers[currentQuestion.value.id]
})

// 问题状态列表（用于导航）
const questionStatuses = computed(() => {
  return examStore.currentQuestions.map(q => ({
    id: q.id,
    answered: !!examStore.answers[q.id]
  }))
})

// 已答题数
const answeredCount = computed(() => {
  return Object.keys(examStore.answers).length
})

// 格式化时间
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// 时间状态类
const timeStatusClass = computed(() => {
  if (!examStore.currentExam) return ''
  const total = examStore.currentExam.timeLimitMinutes * 60
  const ratio = remainingSeconds.value / total
  if (ratio <= 0.1) return 'text-destructive animate-pulse'
  if (ratio <= 0.25) return 'text-warning'
  return 'text-foreground'
})

// 开始考试
const startExam = async () => {
  await examStore.startExam(examId.value)
  if (examStore.currentExam) {
    remainingSeconds.value = examStore.currentExam.timeLimitMinutes * 60
    phase.value = 'exam'
    startTimer()
  }
}

// 开始计时器
const startTimer = () => {
  timerInterval.value = window.setInterval(() => {
    remainingSeconds.value--
    if (remainingSeconds.value <= 0) {
      handleTimeUp()
    }
  }, 1000)
}

// 时间到
const handleTimeUp = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  handleSubmit()
}

// 保存答案
const handleAnswer = (questionId: number, answer: string | string[]) => {
  examStore.saveAnswer(questionId, answer)
}

// 上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < examStore.currentQuestions.length - 1) {
    currentQuestionIndex.value++
  }
}

// 跳转题目
const navigateTo = (index: number) => {
  if (index >= 0 && index < examStore.currentQuestions.length) {
    currentQuestionIndex.value = index
    showNavPanel.value = false
  }
}

// 提交考试
const handleSubmit = async () => {
  showSubmitConfirm.value = false
  phase.value = 'submitting'

  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }

  const timeSpent = examStore.currentExam
    ? examStore.currentExam.timeLimitMinutes * 60 - remainingSeconds.value
    : 0

  const result = await examStore.submitExam(timeSpent)

  if (result && examStore.currentAttemptId) {
    router.replace({
      name: 'ExamResult',
      params: {
        examId: examId.value,
        attemptId: examStore.currentAttemptId
      }
    })
  }
}

// 加载考试
onMounted(async () => {
  await examStore.fetchExamDetail(examId.value)
})

// 清理
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// 防止意外离开
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (phase.value === 'exam') {
    e.preventDefault()
    e.returnValue = ''
  }
}

watch(phase, (val) => {
  if (val === 'exam') {
    window.addEventListener('beforeunload', handleBeforeUnload)
  } else {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 加载状态 -->
    <div v-if="examStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>

    <!-- 考试介绍页 -->
    <div v-else-if="phase === 'intro' && examStore.currentExam" class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-card rounded-2xl border border-border overflow-hidden">
        <!-- 头部 -->
        <div class="bg-primary/10 p-6 text-center">
          <FileQuestion class="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 class="text-2xl font-bold text-foreground">
            {{ examStore.currentExam.title }}
          </h1>
          <p v-if="examStore.currentExam.description" class="text-muted-foreground mt-2">
            {{ examStore.currentExam.description }}
          </p>
        </div>

        <!-- 考试信息 -->
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <Timer class="w-6 h-6 text-primary" />
              <div>
                <div class="text-sm text-muted-foreground">考试时长</div>
                <div class="font-bold text-foreground">{{ examStore.currentExam.timeLimitMinutes }} 分钟</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <FileQuestion class="w-6 h-6 text-primary" />
              <div>
                <div class="text-sm text-muted-foreground">题目数量</div>
                <div class="font-bold text-foreground">{{ examStore.currentExam.questionCount }} 道</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <AlertCircle class="w-6 h-6 text-warning" />
              <div>
                <div class="text-sm text-muted-foreground">及格分数</div>
                <div class="font-bold text-foreground">{{ examStore.currentExam.passingScore }} 分</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <RotateCcw class="w-6 h-6 text-secondary" />
              <div>
                <div class="text-sm text-muted-foreground">最大尝试</div>
                <div class="font-bold text-foreground">{{ examStore.currentExam.maxAttempts }} 次</div>
              </div>
            </div>
          </div>

          <!-- 注意事项 -->
          <div class="p-4 bg-warning/10 rounded-xl border border-warning/20">
            <h3 class="font-semibold text-warning mb-2">注意事项</h3>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li>• 考试开始后计时器将自动启动，请合理安排时间</li>
              <li>• 答题过程中请勿刷新页面或离开，否则可能导致数据丢失</li>
              <li>• 所有题目均可标记，支持来回切换答题</li>
              <li>• 时间结束将自动提交试卷</li>
            </ul>
          </div>

          <!-- 开始按钮 -->
          <button
            class="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98]"
            @click="startExam"
          >
            开始考试
          </button>

          <button
            class="w-full py-3 text-muted-foreground hover:text-foreground transition-colors"
            @click="router.back()"
          >
            返回
          </button>
        </div>
      </div>
    </div>

    <!-- 答题页面 -->
    <div v-else-if="phase === 'exam'" class="flex flex-col min-h-screen">
      <!-- 顶部状态栏 -->
      <div class="sticky top-0 z-20 bg-card border-b border-border px-4 py-3">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <!-- 进度 -->
          <div class="flex items-center gap-2 text-sm">
            <span class="font-medium text-foreground">
              {{ currentQuestionIndex + 1 }} / {{ examStore.currentQuestions.length }}
            </span>
            <span class="text-muted-foreground">
              (已答 {{ answeredCount }})
            </span>
          </div>

          <!-- 计时器 -->
          <div :class="['flex items-center gap-2 font-mono text-lg font-bold', timeStatusClass]">
            <Clock class="w-5 h-5" />
            <span>{{ formatTime(remainingSeconds) }}</span>
          </div>

          <!-- 答题卡按钮 -->
          <button
            class="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            @click="showNavPanel = !showNavPanel"
          >
            答题卡
          </button>
        </div>

        <!-- 进度条 -->
        <div class="max-w-4xl mx-auto mt-2">
          <div class="h-1 bg-muted rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-300"
              :style="{ width: `${(answeredCount / examStore.currentQuestions.length) * 100}%` }"
            />
          </div>
        </div>
      </div>

      <!-- 答题卡面板 -->
      <Transition name="slide-down">
        <div
          v-if="showNavPanel"
          class="fixed inset-x-0 top-[72px] z-10 bg-background/80 backdrop-blur-sm p-4"
        >
          <div class="max-w-md mx-auto">
            <QuestionNav
              :questions="questionStatuses"
              :current-index="currentQuestionIndex"
              @navigate="navigateTo"
            />
          </div>
        </div>
      </Transition>

      <!-- 题目内容区 -->
      <div class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div v-if="currentQuestion" class="bg-card rounded-2xl border border-border p-6">
          <!-- 题目序号 -->
          <div class="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <span>第 {{ currentQuestionIndex + 1 }} 题</span>
            <span class="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
              {{ currentQuestion.score }} 分
            </span>
          </div>

          <!-- 题目组件 -->
          <SingleChoice
            v-if="currentQuestion.type === 'single'"
            :question-id="currentQuestion.id"
            :text="currentQuestion.text"
            :options="currentQuestion.options || []"
            :selected-answer="currentAnswer as string"
            @answer="handleAnswer"
          />

          <MultiChoice
            v-else-if="currentQuestion.type === 'multi'"
            :question-id="currentQuestion.id"
            :text="currentQuestion.text"
            :options="currentQuestion.options || []"
            :selected-answers="(currentAnswer as string[]) || []"
            @answer="handleAnswer"
          />

          <TrueFalse
            v-else-if="currentQuestion.type === 'true_false'"
            :question-id="currentQuestion.id"
            :text="currentQuestion.text"
            :selected-answer="currentAnswer as string"
            @answer="handleAnswer"
          />

          <FillBlank
            v-else-if="currentQuestion.type === 'fill'"
            :question-id="currentQuestion.id"
            :text="currentQuestion.text"
            :selected-answer="currentAnswer as string"
            @answer="handleAnswer"
          />
        </div>
      </div>

      <!-- 底部导航 -->
      <div class="sticky bottom-0 bg-card border-t border-border px-4 py-3">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <button
            class="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            :disabled="currentQuestionIndex === 0"
            @click="prevQuestion"
          >
            <ChevronLeft class="w-5 h-5" />
            <span>上一题</span>
          </button>

          <!-- 提交按钮 -->
          <button
            class="flex items-center gap-2 px-6 py-2 bg-success text-white font-medium rounded-lg hover:bg-success/90 transition-all"
            @click="showSubmitConfirm = true"
          >
            <Send class="w-4 h-4" />
            <span>交卷</span>
          </button>

          <button
            class="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            :disabled="currentQuestionIndex === examStore.currentQuestions.length - 1"
            @click="nextQuestion"
          >
            <span>下一题</span>
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- 提交中 -->
    <div v-else-if="phase === 'submitting'" class="flex flex-col items-center justify-center min-h-screen gap-4">
      <div class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      <p class="text-muted-foreground">正在提交试卷...</p>
    </div>

    <!-- 提交确认弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showSubmitConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="showSubmitConfirm = false"
        >
          <div class="bg-card rounded-2xl border border-border p-6 max-w-sm w-full animate-scale-in">
            <h3 class="text-lg font-bold text-foreground mb-2">确认交卷？</h3>
            <p class="text-muted-foreground mb-4">
              您已完成 {{ answeredCount }}/{{ examStore.currentQuestions.length }} 道题，
              <span v-if="answeredCount < examStore.currentQuestions.length" class="text-warning">
                还有 {{ examStore.currentQuestions.length - answeredCount }} 题未作答。
              </span>
              <span v-else class="text-success">
                所有题目已作答完成。
              </span>
            </p>
            <div class="flex gap-3">
              <button
                class="flex-1 py-2 text-muted-foreground hover:text-foreground transition-colors"
                @click="showSubmitConfirm = false"
              >
                继续答题
              </button>
              <button
                class="flex-1 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90"
                @click="handleSubmit"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
