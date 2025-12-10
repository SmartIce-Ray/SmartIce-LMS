/**
 * 个人中心相关类型定义
 */

/** 学习统计 */
export interface LearningStats {
  completedCourses: number
  passedExams: number
  learningMinutes: number
  streakDays: number
}

/** 已完成课程 */
export interface CompletedCourse {
  id: number
  title: string
  category: string
  completedAt: string
  coverUrl?: string
}

/** 考试成绩 */
export interface ExamResult {
  id: number
  examName: string
  courseName: string
  score: number
  passScore: number
  passed: boolean
  attemptAt: string
}

/** 修改密码请求 */
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
