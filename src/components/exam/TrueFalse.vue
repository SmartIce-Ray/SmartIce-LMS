<script setup lang="ts">
import { CheckCircle2, XCircle, Circle } from 'lucide-vue-next'

interface Props {
  questionId: number
  text: string
  selectedAnswer?: string
  correctAnswer?: string
  showAnswer?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedAnswer: '',
  correctAnswer: '',
  showAnswer: false,
  disabled: false
})

const emit = defineEmits<{
  answer: [questionId: number, answer: string]
}>()

const handleSelect = (value: string) => {
  if (props.disabled) return
  emit('answer', props.questionId, value)
}

const getButtonClass = (value: string) => {
  const base = 'flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl border-2 transition-all duration-200 font-medium'

  if (props.showAnswer) {
    if (value === props.correctAnswer) {
      return `${base} border-success bg-success/10 text-success`
    }
    if (value === props.selectedAnswer && value !== props.correctAnswer) {
      return `${base} border-destructive bg-destructive/10 text-destructive`
    }
    return `${base} border-border bg-muted/30 text-muted-foreground opacity-60`
  }

  if (value === props.selectedAnswer) {
    return `${base} border-primary bg-primary/5 text-primary`
  }

  return `${base} border-border hover:border-primary/50 hover:bg-muted/50 text-foreground cursor-pointer`
}
</script>

<template>
  <div class="space-y-4">
    <!-- 题目文本 -->
    <div class="flex gap-2">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-warning/20 text-warning text-xs font-bold flex-shrink-0">
        判
      </span>
      <p class="text-foreground font-medium leading-relaxed">{{ text }}</p>
    </div>

    <!-- 判断选项 -->
    <div class="flex gap-4 pl-8">
      <button
        type="button"
        :class="getButtonClass('true')"
        :disabled="disabled"
        @click="handleSelect('true')"
      >
        <CheckCircle2 class="w-6 h-6" />
        <span class="text-lg">正确</span>
      </button>

      <button
        type="button"
        :class="getButtonClass('false')"
        :disabled="disabled"
        @click="handleSelect('false')"
      >
        <XCircle class="w-6 h-6" />
        <span class="text-lg">错误</span>
      </button>
    </div>

    <!-- 答案提示 -->
    <div
      v-if="showAnswer && selectedAnswer !== correctAnswer"
      class="pl-8 text-sm text-destructive"
    >
      正确答案：{{ correctAnswer === 'true' ? '正确' : '错误' }}
    </div>
  </div>
</template>
