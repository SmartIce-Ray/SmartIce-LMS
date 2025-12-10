/**
 * 考试模块类型定义
 */

// 考试状态
export type ExamStatus = 'draft' | 'active' | 'archived'

// 题目类型
export type QuestionType = 'single' | 'multi' | 'true_false' | 'fill'

// 考试定义
export interface Exam {
  id: number
  courseId: number
  title: string
  description?: string
  timeLimitMinutes: number
  passingScore: number
  maxAttempts: number
  questionCount: number
  shuffleQuestions: boolean
  showAnswerAfter: boolean
  status: ExamStatus
  createdAt?: string
}

// 题目选项
export interface QuestionOption {
  key: string
  text: string
}

// 考试题目
export interface Question {
  id: number
  examId: number
  type: QuestionType
  text: string
  options?: QuestionOption[]
  correctAnswer: string | string[]
  score: number
  explanation?: string
  sortOrder: number
}

// 考试尝试记录
export interface ExamAttempt {
  id: number
  examId: number
  userId: number
  attemptNumber: number
  score: number
  totalScore: number
  isPassed: boolean
  startedAt: string
  submittedAt?: string
  timeSpentSeconds: number
  answers?: ExamAnswer[]
}

// 答题记录
export interface ExamAnswer {
  questionId: number
  answer: string | string[]
  isCorrect?: boolean
  scoreEarned?: number
}

// 考试详情（包含题目）
export interface ExamDetail extends Exam {
  questions: Question[]
  myAttempts?: ExamAttempt[]
  bestScore?: number
  attemptsUsed?: number
}

// 提交答卷请求
export interface SubmitExamRequest {
  examId: number
  attemptId: number
  answers: ExamAnswer[]
  timeSpentSeconds: number
}

// 考试结果
export interface ExamResult {
  attempt: ExamAttempt
  exam: Exam
  questions: Question[]
  answers: ExamAnswer[]
  correctCount: number
  wrongCount: number
  unansweredCount: number
}

// 开始考试响应
export interface StartExamResponse {
  attemptId: number
  exam: Exam
  questions: Question[]
  startedAt: string
}
