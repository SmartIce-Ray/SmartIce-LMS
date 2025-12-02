<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import CourseCard from './CourseCard.vue'

interface Course {
  id: number
  title: string
  coverUrl?: string
  progress?: number
  totalLessons?: number
  completedLessons?: number
  category?: string
}

interface Props {
  title?: string
  courses?: Course[]
}

withDefaults(defineProps<Props>(), {
  title: '待学课程',
  courses: () => []
})

const emit = defineEmits<{
  more: []
  courseClick: [id: number]
}>()
</script>

<template>
  <div class="space-y-3">
    <!-- 标题栏 -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-foreground">{{ title }}</h2>
      <button
        class="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        @click="emit('more')"
      >
        更多
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>

    <!-- 横向滚动课程列表 -->
    <div class="relative -mx-4 px-4">
      <div class="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        <div
          v-for="course in courses"
          :key="course.id"
          class="flex-shrink-0 w-40 snap-start"
        >
          <CourseCard
            v-bind="course"
            @click="emit('courseClick', course.id)"
          />
        </div>

        <!-- 空状态 -->
        <div
          v-if="courses.length === 0"
          class="flex-1 py-8 text-center text-muted-foreground"
        >
          暂无待学课程
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
