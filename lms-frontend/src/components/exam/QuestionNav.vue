<script setup lang="ts">
interface QuestionStatus {
  id: number
  answered: boolean
  flagged?: boolean
}

interface Props {
  questions: QuestionStatus[]
  currentIndex: number
  showResults?: boolean
  correctIds?: number[]
  wrongIds?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  showResults: false,
  correctIds: () => [],
  wrongIds: () => []
})

const emit = defineEmits<{
  navigate: [index: number]
}>()

const getButtonClass = (q: QuestionStatus, index: number) => {
  const base = 'w-10 h-10 rounded-lg font-medium text-sm transition-all flex items-center justify-center'

  // 结果模式
  if (props.showResults) {
    if (props.correctIds.includes(q.id)) {
      return `${base} bg-success/20 text-success border-2 border-success`
    }
    if (props.wrongIds.includes(q.id)) {
      return `${base} bg-destructive/20 text-destructive border-2 border-destructive`
    }
    return `${base} bg-muted text-muted-foreground border-2 border-muted`
  }

  // 当前题目
  if (index === props.currentIndex) {
    return `${base} bg-primary text-primary-foreground shadow-lg scale-110`
  }

  // 已标记
  if (q.flagged) {
    return `${base} bg-warning/20 text-warning border-2 border-warning`
  }

  // 已作答
  if (q.answered) {
    return `${base} bg-secondary/20 text-secondary border-2 border-secondary`
  }

  // 未作答
  return `${base} bg-muted hover:bg-muted/80 text-muted-foreground border-2 border-transparent cursor-pointer`
}
</script>

<template>
  <div class="bg-card rounded-2xl border border-border p-4">
    <div class="flex items-center justify-between mb-3">
      <h4 class="font-semibold text-foreground">答题卡</h4>
      <div class="flex items-center gap-4 text-xs text-muted-foreground">
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded bg-secondary/20 border border-secondary" />
          <span>已答</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded bg-muted" />
          <span>未答</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="(q, index) in questions"
        :key="q.id"
        type="button"
        :class="getButtonClass(q, index)"
        @click="emit('navigate', index)"
      >
        {{ index + 1 }}
      </button>
    </div>

    <!-- 统计信息 -->
    <div class="mt-4 pt-3 border-t border-border flex justify-between text-sm">
      <span class="text-muted-foreground">
        已答：<span class="text-foreground font-medium">{{ questions.filter(q => q.answered).length }}</span> / {{ questions.length }}
      </span>
      <span
        v-if="!showResults"
        class="text-primary cursor-pointer hover:underline"
        @click="emit('navigate', questions.findIndex(q => !q.answered))"
      >
        跳转未答
      </span>
    </div>
  </div>
</template>
