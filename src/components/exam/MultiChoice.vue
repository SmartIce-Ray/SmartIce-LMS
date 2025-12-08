<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Check } from 'lucide-vue-next'
import type { QuestionOption } from '@/types/exam'

interface Props {
  questionId: number
  text: string
  options: QuestionOption[]
  selectedAnswers?: string[]
  correctAnswers?: string[]
  showAnswer?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectedAnswers: () => [],
  correctAnswers: () => [],
  showAnswer: false,
  disabled: false
})

const emit = defineEmits<{
  answer: [questionId: number, answers: string[]]
}>()

const handleToggle = (key: string) => {
  if (props.disabled) return

  const current = [...props.selectedAnswers]
  const index = current.indexOf(key)

  if (index > -1) {
    current.splice(index, 1)
  } else {
    current.push(key)
  }

  emit('answer', props.questionId, current.sort())
}

const isSelected = (key: string) => props.selectedAnswers.includes(key)
const isCorrect = (key: string) => props.correctAnswers.includes(key)

const getOptionClass = (key: string) => {
  const base = 'relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer'

  if (props.showAnswer) {
    if (isCorrect(key)) {
      return `${base} border-success bg-success/10`
    }
    if (isSelected(key) && !isCorrect(key)) {
      return `${base} border-destructive bg-destructive/10`
    }
    return `${base} border-border bg-muted/30 opacity-60`
  }

  if (isSelected(key)) {
    return `${base} border-primary bg-primary/5`
  }

  return `${base} border-border hover:border-primary/50 hover:bg-muted/50`
}

const getCheckboxClass = (key: string) => {
  const base = 'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all'

  if (props.showAnswer) {
    if (isCorrect(key)) {
      return `${base} border-success bg-success`
    }
    if (isSelected(key) && !isCorrect(key)) {
      return `${base} border-destructive bg-destructive`
    }
    return `${base} border-muted-foreground/30`
  }

  if (isSelected(key)) {
    return `${base} border-primary bg-primary`
  }

  return `${base} border-muted-foreground/50`
}
</script>

<template>
  <div class="space-y-4">
    <!-- 题目文本 -->
    <div class="flex gap-2">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex-shrink-0">
        多
      </span>
      <p class="text-foreground font-medium leading-relaxed">{{ text }}</p>
    </div>

    <!-- 选项列表 -->
    <div class="space-y-3 pl-8">
      <div
        v-for="option in options"
        :key="option.key"
        :class="getOptionClass(option.key)"
        @click="handleToggle(option.key)"
      >
        <!-- 多选框 -->
        <div :class="getCheckboxClass(option.key)">
          <Check
            v-if="isSelected(option.key) || (showAnswer && isCorrect(option.key))"
            class="w-3 h-3 text-white"
            :stroke-width="3"
          />
        </div>

        <!-- 选项内容 -->
        <div class="flex-1">
          <span class="font-medium text-muted-foreground mr-2">{{ option.key }}.</span>
          <span class="text-foreground">{{ option.text }}</span>
        </div>

        <!-- 正确标记 -->
        <CheckCircle2
          v-if="showAnswer && isCorrect(option.key)"
          class="w-5 h-5 text-success flex-shrink-0"
        />
      </div>
    </div>

    <!-- 多选提示 -->
    <p class="text-xs text-muted-foreground pl-8">
      * 本题为多选题，请选择所有正确答案
    </p>
  </div>
</template>
