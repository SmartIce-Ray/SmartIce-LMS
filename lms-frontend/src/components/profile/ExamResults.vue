<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import type { ExamResult } from '@/types/profile'

interface Props {
  results: ExamResult[]
  maxDisplay?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 5
})

const showAll = ref(false)

// 显示的成绩列表
const displayedResults = computed(() => {
  if (showAll.value) {
    return props.results
  }
  return props.results.slice(0, props.maxDisplay)
})

// 是否有更多
const hasMore = computed(() => props.results.length > props.maxDisplay)

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function toggleShowAll() {
  showAll.value = !showAll.value
}
</script>

<template>
  <div class="bg-card rounded-xl border border-border overflow-hidden">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <h3 class="font-bold text-foreground">考试成绩</h3>
      <button
        v-if="hasMore"
        class="text-sm text-primary hover:text-primary/80 transition-colors"
        @click="toggleShowAll"
      >
        {{ showAll ? '收起' : '查看全部' }}
      </button>
    </div>

    <!-- 成绩列表 -->
    <div v-if="results.length > 0">
      <div
        v-for="result in displayedResults"
        :key="result.id"
        class="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border last:border-b-0"
      >
        <!-- 分数 -->
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="result.passed ? 'bg-success/10' : 'bg-destructive/10'"
        >
          <span
            class="text-lg font-bold"
            :class="result.passed ? 'text-success' : 'text-destructive'"
          >
            {{ result.score }}
          </span>
        </div>

        <!-- 考试信息 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-medium text-foreground truncate">
              {{ result.examName }}
            </h4>
            <Badge
              :variant="result.passed ? 'default' : 'destructive'"
              class="flex-shrink-0 text-[10px] px-1.5 py-0"
            >
              {{ result.passed ? '通过' : '未通过' }}
            </Badge>
          </div>
          <p class="text-xs text-muted-foreground mt-0.5 truncate">
            {{ result.courseName }} · {{ formatDate(result.attemptAt) }}
          </p>
        </div>

        <!-- 及格分提示 -->
        <div class="text-xs text-muted-foreground flex-shrink-0">
          {{ result.passScore }}分及格
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="px-4 py-8 text-center">
      <p class="text-sm text-muted-foreground">暂无考试记录</p>
    </div>
  </div>
</template>
