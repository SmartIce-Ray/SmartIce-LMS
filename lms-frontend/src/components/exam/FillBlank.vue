<script setup lang="ts">
import { ref, watch } from 'vue'
import { CheckCircle2, XCircle } from 'lucide-vue-next'

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

const inputValue = ref(props.selectedAnswer)

watch(() => props.selectedAnswer, (val) => {
  inputValue.value = val
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  inputValue.value = target.value
  emit('answer', props.questionId, target.value)
}

const isCorrect = () => {
  if (!props.showAnswer) return null
  // 忽略前后空格，不区分大小写比较
  return inputValue.value.trim().toLowerCase() === props.correctAnswer.trim().toLowerCase()
}
</script>

<template>
  <div class="space-y-4">
    <!-- 题目文本 -->
    <div class="flex gap-2">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-info/20 text-info text-xs font-bold flex-shrink-0">
        填
      </span>
      <p class="text-foreground font-medium leading-relaxed">{{ text }}</p>
    </div>

    <!-- 输入框 -->
    <div class="pl-8 space-y-2">
      <div class="relative">
        <input
          type="text"
          :value="inputValue"
          :disabled="disabled"
          placeholder="请输入答案..."
          class="w-full px-4 py-3 rounded-xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-all"
          :class="{
            'border-success bg-success/5': showAnswer && isCorrect(),
            'border-destructive bg-destructive/5': showAnswer && isCorrect() === false,
            'border-border focus:border-primary': !showAnswer
          }"
          @input="handleInput"
        />

        <!-- 状态图标 -->
        <div
          v-if="showAnswer"
          class="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <CheckCircle2
            v-if="isCorrect()"
            class="w-5 h-5 text-success"
          />
          <XCircle
            v-else
            class="w-5 h-5 text-destructive"
          />
        </div>
      </div>

      <!-- 正确答案 -->
      <div
        v-if="showAnswer && !isCorrect()"
        class="flex items-center gap-2 text-sm"
      >
        <span class="text-muted-foreground">正确答案：</span>
        <span class="text-success font-medium">{{ correctAnswer }}</span>
      </div>
    </div>
  </div>
</template>
