/**
 * 通知/消息模块类型定义
 */

// 通知类型
export type NotificationType =
  | 'learning_reminder'  // 学习提醒
  | 'exam_due'           // 考试截止
  | 'task_assigned'      // 任务分配
  | 'course_assigned'    // 课程分配
  | 'exam_passed'        // 考试通过
  | 'exam_failed'        // 考试未通过
  | 'system'             // 系统通知
  | 'announcement'       // 公告

// 关联对象类型
export type RelatedType = 'course' | 'exam' | 'enrollment' | 'task'

// 通知
export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  content?: string
  isRead: boolean
  readAt?: string
  createdAt: string
  relatedType?: RelatedType
  relatedId?: number
}

// 通知列表响应
export interface NotificationListResponse {
  items: Notification[]
  total: number
  unreadCount: number
}

// 标记已读请求
export interface MarkReadRequest {
  notificationIds: number[]
}
