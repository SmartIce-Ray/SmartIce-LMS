<script setup lang="ts">
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
        class="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
        @click="emit('more')"
      >
        查看全部
      </button>
    </div>

    <!-- 横向滚动课程列表 -->
    <div class="relative -mx-4 px-4">
      <div
        class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
        role="list"
        tabindex="0"
        aria-label="可左右滑动查看更多课程"
      >
        <div
          v-for="(course, index) in courses"
          :key="course.id"
          class="flex-shrink-0 w-[200px] snap-start animate-fade-in-right animation-fill-both"
          :class="`animation-delay-${(index + 6) * 100}`"
          role="listitem"
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
/* 隐藏滚动条 */
div[role="list"] {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
div[role="list"]::-webkit-scrollbar {
  display: none;
}

/* 滚动吸附优化 */
div[role="list"] {
  scroll-padding: 0 1rem;
}
</style>
