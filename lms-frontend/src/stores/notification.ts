import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification, NotificationType } from '@/types/notification'

// Mock 通知数据
const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    type: 'course_assigned',
    title: '新课程分配',
    content: '您已被分配学习《食品安全与卫生操作规范》课程，请在7天内完成学习。',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    relatedType: 'course',
    relatedId: 1
  },
  {
    id: 2,
    userId: 1,
    type: 'exam_due',
    title: '考试即将截止',
    content: '《食品安全基础考试》将在24小时后截止，请尽快完成考试。',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2小时前
    relatedType: 'exam',
    relatedId: 1
  },
  {
    id: 3,
    userId: 1,
    type: 'learning_reminder',
    title: '学习提醒',
    content: '您今天还没有进行学习，坚持每日学习可以获得连胜奖励哦！',
    isRead: true,
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5小时前
  },
  {
    id: 4,
    userId: 1,
    type: 'exam_passed',
    title: '考试通过',
    content: '恭喜您通过《客户服务基础》考试，得分85分！',
    isRead: true,
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1天前
    relatedType: 'exam',
    relatedId: 2
  },
  {
    id: 5,
    userId: 1,
    type: 'announcement',
    title: '系统公告：新课程上线',
    content: '《新员工入职培训》系列课程已上线，包含企业文化、规章制度、岗位技能等内容，欢迎学习！',
    isRead: true,
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2天前
  },
  {
    id: 6,
    userId: 1,
    type: 'task_assigned',
    title: '新任务分配',
    content: '门店经理给您分配了新任务：完成本月服务技能提升培训。',
    isRead: true,
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3天前
  },
  {
    id: 7,
    userId: 1,
    type: 'system',
    title: '密码修改成功',
    content: '您的账户密码已成功修改，如非本人操作请及时联系管理员。',
    isRead: true,
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5天前
  }
]

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const selectedNotification = ref<Notification | null>(null)

  // 计算属性
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.isRead)
  })

  const readNotifications = computed(() => {
    return notifications.value.filter(n => n.isRead)
  })

  const announcements = computed(() => {
    return notifications.value.filter(n => n.type === 'announcement' || n.type === 'system')
  })

  // 按类型分组
  const getByType = (type: NotificationType) => {
    return notifications.value.filter(n => n.type === type)
  }

  // 获取通知列表
  const fetchNotifications = async () => {
    loading.value = true
    try {
      // TODO: 替换为真实 API
      await new Promise(resolve => setTimeout(resolve, 300))
      notifications.value = [...mockNotifications]
    } finally {
      loading.value = false
    }
  }

  // 标记单条已读
  const markAsRead = async (notificationId: number) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.isRead) {
      // TODO: 替换为真实 API
      await new Promise(resolve => setTimeout(resolve, 100))
      notification.isRead = true
      notification.readAt = new Date().toISOString()
    }
  }

  // 标记多条已读
  const markMultipleAsRead = async (notificationIds: number[]) => {
    // TODO: 替换为真实 API
    await new Promise(resolve => setTimeout(resolve, 100))
    notifications.value.forEach(n => {
      if (notificationIds.includes(n.id) && !n.isRead) {
        n.isRead = true
        n.readAt = new Date().toISOString()
      }
    })
  }

  // 全部标记已读
  const markAllAsRead = async () => {
    // TODO: 替换为真实 API
    await new Promise(resolve => setTimeout(resolve, 200))
    notifications.value.forEach(n => {
      if (!n.isRead) {
        n.isRead = true
        n.readAt = new Date().toISOString()
      }
    })
  }

  // 选择通知（查看详情）
  const selectNotification = (notification: Notification) => {
    selectedNotification.value = notification
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
  }

  // 关闭详情
  const clearSelection = () => {
    selectedNotification.value = null
  }

  // 获取通知图标类型
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'learning_reminder': return 'bell'
      case 'exam_due': return 'clock'
      case 'exam_passed': return 'check-circle'
      case 'exam_failed': return 'x-circle'
      case 'task_assigned': return 'clipboard'
      case 'course_assigned': return 'book-open'
      case 'announcement': return 'megaphone'
      case 'system': return 'settings'
      default: return 'bell'
    }
  }

  // 获取通知颜色
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'exam_passed': return 'success'
      case 'exam_failed': return 'destructive'
      case 'exam_due': return 'warning'
      case 'announcement': return 'primary'
      case 'learning_reminder': return 'secondary'
      default: return 'muted'
    }
  }

  // 格式化时间
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return '刚刚'
    if (diffMins < 60) return `${diffMins}分钟前`
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`

    return date.toLocaleDateString('zh-CN', {
      month: 'numeric',
      day: 'numeric'
    })
  }

  return {
    // 状态
    notifications,
    loading,
    selectedNotification,

    // 计算属性
    unreadCount,
    unreadNotifications,
    readNotifications,
    announcements,

    // 方法
    getByType,
    fetchNotifications,
    markAsRead,
    markMultipleAsRead,
    markAllAsRead,
    selectNotification,
    clearSelection,
    getNotificationIcon,
    getNotificationColor,
    formatTime
  }
})
