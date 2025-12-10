<script setup lang="ts">
import { computed } from 'vue'
import { Clock, FileQuestion, Trophy, RotateCcw, ChevronRight, CheckCircle } from 'lucide-vue-next'
import type { Exam, ExamAttempt } from '@/types/exam'

interface Props {
  exam: Exam
  attempts?: ExamAttempt[]
  bestScore?: number
}

const props = withDefaults(defineProps<Props>(), {
  attempts: () => [],
  bestScore: 0
})

const emit = defineEmits<{
  start: [examId: number]
  viewResult: [attemptId: number]
}>()

// 计算剩余次数
const remainingAttempts = computed(() => {
  return props.exam.maxAttempts - props.attempts.length
})

// 是否已通过
const hasPassed = computed(() => {
  return props.attempts.some(a => a.isPassed)
})

// 最近一次尝试
const lastAttempt = computed(() => {
  if (props.attempts.length === 0) return null
  return props.attempts[props.attempts.length - 1]
})

// 状态文本
const statusText = computed(() => {
  if (hasPassed.value) return '已通过'
  if (props.attempts.length === 0) return '未开始'
  if (remainingAttempts.value === 0) return '次数已用完'
  return `还剩 ${remainingAttempts.value} 次机会`
})

// 状态颜色
const statusColor = computed(() => {
  if (hasPassed.value) return 'text-success'
  if (remainingAttempts.value === 0) return 'text-destructive'
  if (props.attempts.length > 0) return 'text-warning'
  return 'text-muted-foreground'
})

// 格式化时间
const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}分钟`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}小时${m}分钟` : `${h}小时`
}
</script>

<template>
  <div class="bg-card rounded-2xl border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
    <!-- 头部状态条 -->
    <div
      class="h-1.5"
      :class="{
        'bg-success': hasPassed,
        'bg-warning': !hasPassed && attempts.length > 0,
        'bg-muted': attempts.length === 0
      }"
    />

    <div class="p-4 space-y-4">
      <!-- 标题区 -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-foreground text-lg line-clamp-2">
            {{ exam.title }}
          </h3>
          <p v-if="exam.description" class="text-sm text-muted-foreground mt-1 line-clamp-2">
            {{ exam.description }}
          </p>
        </div>

        <!-- 通过标记 -->
        <div
          v-if="hasPassed"
          class="flex-shrink-0 w-12 h-12 rounded-full bg-success/20 flex items-center justify-center"
        >
          <CheckCircle class="w-6 h-6 text-success" />
        </div>
      </div>

      <!-- 考试信息 -->
      <div class="grid grid-cols-3 gap-3 text-sm">
        <div class="flex items-center gap-2 text-muted-foreground">
          <Clock class="w-4 h-4" />
          <span>{{ formatTime(exam.timeLimitMinutes) }}</span>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <FileQuestion class="w-4 h-4" />
          <span>{{ exam.questionCount }} 题</span>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <RotateCcw class="w-4 h-4" />
          <span>{{ exam.maxAttempts }} 次</span>
        </div>
      </div>

      <!-- 成绩区 -->
      <div
        v-if="attempts.length > 0"
        class="flex items-center justify-between py-3 px-4 bg-muted/50 rounded-xl"
      >
        <div class="flex items-center gap-3">
          <Trophy :class="hasPassed ? 'w-5 h-5 text-warning' : 'w-5 h-5 text-muted-foreground'" />
          <div>
            <div class="text-xs text-muted-foreground">最高分</div>
            <div class="font-bold text-lg" :class="hasPassed ? 'text-success' : 'text-foreground'">
              {{ bestScore }} <span class="text-sm font-normal text-muted-foreground">分</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs text-muted-foreground">及格分</div>
          <div class="font-medium text-foreground">{{ exam.passingScore }} 分</div>
        </div>
      </div>

      <!-- 底部操作区 -->
      <div class="flex items-center justify-between pt-2">
        <span :class="['text-sm font-medium', statusColor]">
          {{ statusText }}
        </span>

        <div class="flex gap-2">
          <!-- 查看记录按钮 -->
          <button
            v-if="lastAttempt"
            class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            @click="emit('viewResult', lastAttempt.id)"
          >
            查看记录
          </button>

          <!-- 开始/继续考试按钮 -->
          <button
            v-if="remainingAttempts > 0 || attempts.length === 0"
            class="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all"
            :class="hasPassed
              ? 'bg-muted text-foreground hover:bg-muted/80'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'"
            @click="emit('start', exam.id)"
          >
            <span>{{ attempts.length === 0 ? '开始考试' : '再次考试' }}</span>
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
