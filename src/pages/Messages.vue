<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  ClipboardList,
  Megaphone,
  Settings,
  Check,
  ChevronRight,
  Inbox
} from 'lucide-vue-next'
import type { Notification, NotificationType } from '@/types/notification'

const router = useRouter()
const notificationStore = useNotificationStore()

// 当前选中的分类
type FilterType = 'all' | 'unread' | 'system'
const activeFilter = ref<FilterType>('all')

// 筛选后的通知列表
const filteredNotifications = computed(() => {
  switch (activeFilter.value) {
    case 'unread':
      return notificationStore.unreadNotifications
    case 'system':
      return notificationStore.announcements
    default:
      return notificationStore.notifications
  }
})

// 获取图标组件
const getIconComponent = (type: NotificationType) => {
  switch (type) {
    case 'learning_reminder': return Bell
    case 'exam_due': return Clock
    case 'exam_passed': return CheckCircle
    case 'exam_failed': return XCircle
    case 'task_assigned': return ClipboardList
    case 'course_assigned': return BookOpen
    case 'announcement': return Megaphone
    case 'system': return Settings
    default: return Bell
  }
}

// 获取图标颜色类
const getIconColorClass = (type: NotificationType) => {
  switch (type) {
    case 'exam_passed': return 'text-success bg-success/10'
    case 'exam_failed': return 'text-destructive bg-destructive/10'
    case 'exam_due': return 'text-warning bg-warning/10'
    case 'announcement': return 'text-primary bg-primary/10'
    case 'course_assigned': return 'text-secondary bg-secondary/10'
    case 'learning_reminder': return 'text-info bg-info/10'
    default: return 'text-muted-foreground bg-muted'
  }
}

// 点击通知
const handleNotificationClick = (notification: Notification) => {
  notificationStore.selectNotification(notification)

  // 如果有关联对象，跳转
  if (notification.relatedType && notification.relatedId) {
    switch (notification.relatedType) {
      case 'course':
        router.push({ name: 'CourseDetail', params: { id: notification.relatedId } })
        break
      case 'exam':
        router.push({ name: 'TakeExam', params: { examId: notification.relatedId } })
        break
    }
  }
}

// 全部标记已读
const handleMarkAllRead = async () => {
  await notificationStore.markAllAsRead()
}

// 加载数据
onMounted(() => {
  notificationStore.fetchNotifications()
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 头部 -->
    <div class="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-bold text-foreground">消息中心</h1>
          <button
            v-if="notificationStore.unreadCount > 0"
            class="flex items-center gap-1 text-sm text-primary hover:underline"
            @click="handleMarkAllRead"
          >
            <Check class="w-4 h-4" />
            <span>全部已读</span>
          </button>
        </div>

        <!-- 分类标签 -->
        <div class="flex gap-2">
          <button
            v-for="filter in [
              { key: 'all', label: '全部' },
              { key: 'unread', label: '未读', count: notificationStore.unreadCount },
              { key: 'system', label: '系统公告' }
            ]"
            :key="filter.key"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all"
            :class="activeFilter === filter.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'"
            @click="activeFilter = filter.key as FilterType"
          >
            {{ filter.label }}
            <span
              v-if="filter.count && filter.count > 0"
              class="ml-1 px-1.5 py-0.5 text-xs rounded-full"
              :class="activeFilter === filter.key
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-primary/10 text-primary'"
            >
              {{ filter.count }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="notificationStore.loading" class="flex items-center justify-center py-12">
      <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>

    <!-- 消息列表 -->
    <div v-else-if="filteredNotifications.length > 0" class="divide-y divide-border">
      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        class="flex gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/30"
        :class="{ 'bg-primary/5': !notification.isRead }"
        @click="handleNotificationClick(notification)"
      >
        <!-- 图标 -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :class="getIconColorClass(notification.type)"
        >
          <component :is="getIconComponent(notification.type)" class="w-5 h-5" />
        </div>

        <!-- 内容 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h3
              class="font-medium text-foreground line-clamp-1"
              :class="{ 'font-bold': !notification.isRead }"
            >
              {{ notification.title }}
            </h3>
            <span class="text-xs text-muted-foreground flex-shrink-0">
              {{ notificationStore.formatTime(notification.createdAt) }}
            </span>
          </div>

          <p
            v-if="notification.content"
            class="text-sm text-muted-foreground mt-1 line-clamp-2"
          >
            {{ notification.content }}
          </p>

          <!-- 关联跳转提示 -->
          <div
            v-if="notification.relatedType"
            class="flex items-center gap-1 mt-2 text-xs text-primary"
          >
            <span>
              {{ notification.relatedType === 'course' ? '查看课程' : '查看考试' }}
            </span>
            <ChevronRight class="w-3 h-3" />
          </div>
        </div>

        <!-- 未读标记 -->
        <div
          v-if="!notification.isRead"
          class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4">
      <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Inbox class="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-medium text-foreground mb-1">
        {{ activeFilter === 'unread' ? '没有未读消息' : '暂无消息' }}
      </h3>
      <p class="text-sm text-muted-foreground text-center">
        {{ activeFilter === 'unread'
          ? '所有消息都已读取'
          : '新的通知和公告将会在这里显示'
        }}
      </p>
    </div>
  </div>
</template>
