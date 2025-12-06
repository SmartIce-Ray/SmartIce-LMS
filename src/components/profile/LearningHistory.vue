<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { CompletedCourse } from '@/types/profile'

interface Props {
  courses: CompletedCourse[]
  maxDisplay?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxDisplay: 5
})

const router = useRouter()
const showAll = ref(false)

// 显示的课程列表
const displayedCourses = computed(() => {
  if (showAll.value) {
    return props.courses
  }
  return props.courses.slice(0, props.maxDisplay)
})

// 是否有更多
const hasMore = computed(() => props.courses.length > props.maxDisplay)

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function goToCourse(courseId: number) {
  router.push(`/courses/${courseId}`)
}

function toggleShowAll() {
  showAll.value = !showAll.value
}
</script>

<template>
  <div class="bg-card rounded-xl border border-border overflow-hidden">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <h3 class="font-bold text-foreground">学习记录</h3>
      <button
        v-if="hasMore"
        class="text-sm text-primary hover:text-primary/80 transition-colors"
        @click="toggleShowAll"
      >
        {{ showAll ? '收起' : '查看全部' }}
      </button>
    </div>

    <!-- 课程列表 -->
    <div v-if="courses.length > 0">
      <div
        v-for="course in displayedCourses"
        :key="course.id"
        class="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer border-b border-border last:border-b-0"
        @click="goToCourse(course.id)"
      >
        <!-- 完成标记 -->
        <div class="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
          <Check class="w-4 h-4 text-success" />
        </div>

        <!-- 课程信息 -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-medium text-foreground truncate">
            {{ course.title }}
          </h4>
          <p class="text-xs text-muted-foreground mt-0.5">
            {{ course.category }} · 完成于 {{ formatDate(course.completedAt) }}
          </p>
        </div>

        <!-- 箭头 -->
        <ChevronRight class="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="px-4 py-8 text-center">
      <p class="text-sm text-muted-foreground">暂无学习记录</p>
    </div>
  </div>
</template>
