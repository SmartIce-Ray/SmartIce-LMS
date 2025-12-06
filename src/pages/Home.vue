<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Bell } from 'lucide-vue-next'
import StatsCard from '@/components/StatsCard.vue'
import StreakBadge from '@/components/StreakBadge.vue'
import NoticeBanner from '@/components/NoticeBanner.vue'
import RecentCourse from '@/components/RecentCourse.vue'
import PendingCourses from '@/components/PendingCourses.vue'

const router = useRouter()
const authStore = useAuthStore()

// Mock 数据 - 后续从 API 获取
const userStats = ref({
  completedCourses: 12,
  passedExams: 8,
  learningHours: 24
})

const streakDays = ref(7)

const notices = ref([
  { id: 1, title: '新员工入职培训已上线，请尽快完成学习！' }
])

const recentCourse = ref({
  id: 1,
  title: '食品安全与卫生操作规范',
  coverUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
  progress: 60,
  currentLesson: '第三章：厨房卫生标准'
})

const pendingCourses = ref([
  { id: 2, title: '客户服务技巧', coverUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', totalLessons: 8, category: '服务' },
  { id: 3, title: '收银系统操作', coverUrl: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop', totalLessons: 5, category: '技能' },
  { id: 4, title: '门店清洁标准', coverUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop', totalLessons: 6, category: '卫生' },
  { id: 5, title: '团队协作基础', coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop', totalLessons: 4, category: '管理' }
])

function handleContinueLearning(courseId: number) {
  router.push(`/courses/${courseId}/learn`)
}

function handleCourseClick(courseId: number) {
  router.push(`/courses/${courseId}`)
}

function handleMoreCourses() {
  router.push('/courses')
}

function handleNoticeClick(notice: { id: number; title: string }) {
  router.push('/messages')
}

function goToMessages() {
  router.push('/messages')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 页面内容 -->
    <div class="p-4 pb-8 space-y-6">
      <!-- 顶部欢迎栏 -->
      <div class="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 class="text-2xl font-bold text-foreground tracking-tight">
            早安，{{ authStore.user?.full_name || authStore.user?.username || '学员' }}
          </h1>
          <p class="text-sm text-muted-foreground mt-1">保持学习的节奏，今天也很棒！</p>
        </div>
        <button
          class="relative p-2.5 rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-105 active:scale-95"
          @click="goToMessages"
        >
          <Bell class="w-6 h-6 text-muted-foreground" />
          <span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-notification-pulse" />
        </button>
      </div>

      <!-- 连胜徽章 -->
      <div class="animate-bounce-in animation-delay-300 animation-fill-both">
        <StreakBadge :days="streakDays" />
      </div>

      <!-- 数据统计 -->
      <StatsCard
        :completed-courses="userStats.completedCourses"
        :passed-exams="userStats.passedExams"
        :learning-hours="userStats.learningHours"
      />

      <!-- 公告通知 -->
      <div class="animate-slide-in-left animation-delay-400 animation-fill-both">
        <NoticeBanner
          :notices="notices"
          @click="handleNoticeClick"
        />
      </div>

      <!-- 继续学习 -->
      <div class="space-y-3 animate-fade-in-up animation-delay-500 animation-fill-both">
        <h2 class="text-lg font-bold text-foreground">继续学习</h2>
        <RecentCourse
          v-bind="recentCourse"
          @continue="handleContinueLearning"
        />
      </div>

      <!-- 待学课程 -->
      <div class="animate-fade-in-up animation-delay-600 animation-fill-both">
        <PendingCourses
          :courses="pendingCourses"
          @more="handleMoreCourses"
          @course-click="handleCourseClick"
        />
      </div>
    </div>
  </div>
</template>
