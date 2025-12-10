<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserProfileCard from '@/components/profile/UserProfileCard.vue'
import ProfileStats from '@/components/profile/ProfileStats.vue'
import LearningHistory from '@/components/profile/LearningHistory.vue'
import ExamResults from '@/components/profile/ExamResults.vue'
import SettingsSection from '@/components/profile/SettingsSection.vue'
import type { LearningStats, CompletedCourse, ExamResult } from '@/types/profile'

const router = useRouter()
const authStore = useAuthStore()

// Mock 数据 - 学习统计
const mockStats = ref<LearningStats>({
  completedCourses: 12,
  passedExams: 8,
  learningMinutes: 1440,
  streakDays: 7
})

// Mock 数据 - 已完成课程
const mockCompletedCourses = ref<CompletedCourse[]>([
  { id: 1, title: '食品安全与卫生操作规范', category: '食品安全', completedAt: '2024-01-15' },
  { id: 2, title: '客户服务技巧', category: '服务技能', completedAt: '2024-01-10' },
  { id: 3, title: '收银系统操作', category: '门店运营', completedAt: '2024-01-05' },
  { id: 4, title: '门店卫生清洁标准', category: '食品安全', completedAt: '2024-01-03' },
  { id: 5, title: '新员工入职培训', category: '管理培训', completedAt: '2024-01-01' },
  { id: 6, title: '饮品制作基础', category: '服务技能', completedAt: '2023-12-28' },
])

// Mock 数据 - 考试成绩
const mockExamResults = ref<ExamResult[]>([
  {
    id: 1,
    examName: '食品安全基础考核',
    courseName: '食品安全与卫生操作规范',
    score: 92,
    passScore: 60,
    passed: true,
    attemptAt: '2024-01-15T10:30:00'
  },
  {
    id: 2,
    examName: '服务技巧评估',
    courseName: '客户服务技巧',
    score: 78,
    passScore: 70,
    passed: true,
    attemptAt: '2024-01-10T16:00:00'
  },
  {
    id: 3,
    examName: '收银操作考核',
    courseName: '收银系统操作',
    score: 55,
    passScore: 60,
    passed: false,
    attemptAt: '2024-01-04T09:15:00'
  },
  {
    id: 4,
    examName: '卫生清洁规范测试',
    courseName: '门店卫生清洁标准',
    score: 88,
    passScore: 60,
    passed: true,
    attemptAt: '2024-01-03T14:20:00'
  },
])

// Mock 门店名称
const storeName = '春熙路店'

// 处理头像上传
function handleAvatarChange(file: File) {
  // TODO: 调用 API 上传头像
  console.log('上传头像:', file.name)

  // 临时预览
  const reader = new FileReader()
  reader.onload = (e) => {
    if (authStore.user) {
      authStore.user.avatar_url = e.target?.result as string
    }
  }
  reader.readAsDataURL(file)
}

// 处理退出登录
function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="p-4 md:p-6 space-y-4">
    <!-- 页面标题 -->
    <h1 class="text-2xl font-bold text-foreground">个人中心</h1>

    <!-- 用户信息卡片 -->
    <UserProfileCard
      v-if="authStore.user"
      :user="authStore.user"
      :store-name="storeName"
      @avatar-change="handleAvatarChange"
    />

    <!-- 学习统计 -->
    <ProfileStats :stats="mockStats" />

    <!-- 学习记录 -->
    <LearningHistory :courses="mockCompletedCourses" />

    <!-- 考试成绩 -->
    <ExamResults :results="mockExamResults" />

    <!-- 设置 -->
    <SettingsSection @logout="handleLogout" />
  </div>
</template>
