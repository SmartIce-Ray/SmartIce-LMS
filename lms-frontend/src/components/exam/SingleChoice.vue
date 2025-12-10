<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import type { QuestionOption } from '@/types/exam'

interface Props {
  questionId: number
  text: string
  options: QuestionOption[]
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

const handleSelect = (key: string) => {
  if (props.disabled) return
  emit('answer', props.questionId, key)
}

const getOptionClass = (key: string) => {
  const base = 'relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer'

  if (props.showAnswer) {
    if (key === props.correctAnswer) {
      return `${base} border-success bg-success/10`
    }
    if (key === props.selectedAnswer && key !== props.correctAnswer) {
      return `${base} border-destructive bg-destructive/10`
    }
    return `${base} border-border bg-muted/30 opacity-60`
  }

  if (key === props.selectedAnswer) {
    return `${base} border-primary bg-primary/5`
  }

  return `${base} border-border hover:border-primary/50 hover:bg-muted/50`
}

const getRadioClass = (key: string) => {
  const base = 'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all'

  if (props.showAnswer) {
    if (key === props.correctAnswer) {
      return `${base} border-success bg-success`
    }
    if (key === props.selectedAnswer && key !== props.correctAnswer) {
      return `${base} border-destructive bg-destructive`
    }
    return `${base} border-muted-foreground/30`
  }

  if (key === props.selectedAnswer) {
    return `${base} border-primary bg-primary`
  }

  return `${base} border-muted-foreground/50`
}
</script>

<template>
  <div class="space-y-4">
    <!-- 题目文本 -->
    <div class="flex gap-2">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
        单
      </span>
      <p class="text-foreground font-medium leading-relaxed">{{ text }}</p>
    </div>

    <!-- 选项列表 -->
    <div class="space-y-3 pl-8">
      <div
        v-for="option in options"
        :key="option.key"
        :class="getOptionClass(option.key)"
        @click="handleSelect(option.key)"
      >
        <!-- 单选圆点 -->
        <div :class="getRadioClass(option.key)">
          <div
            v-if="selectedAnswer === option.key || (showAnswer && option.key === correctAnswer)"
            class="w-2 h-2 rounded-full bg-white"
          />
        </div>

        <!-- 选项内容 -->
        <div class="flex-1">
          <span class="font-medium text-muted-foreground mr-2">{{ option.key }}.</span>
          <span class="text-foreground">{{ option.text }}</span>
        </div>

        <!-- 正确标记 -->
        <CheckCircle2
          v-if="showAnswer && option.key === correctAnswer"
          class="w-5 h-5 text-success flex-shrink-0"
        />
      </div>
    </div>
  </div>
</template>
