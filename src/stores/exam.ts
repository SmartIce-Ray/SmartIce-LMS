import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Exam,
  ExamDetail,
  Question,
  ExamAttempt,
  ExamAnswer,
  ExamResult,
  StartExamResponse
} from '@/types/exam'

// Mock 考试数据
const mockExams: Exam[] = [
  {
    id: 1,
    courseId: 1,
    title: '食品安全基础知识考试',
    description: '本考试测试您对食品安全基础知识的掌握程度，包括食品储存、卫生操作等内容。',
    timeLimitMinutes: 30,
    passingScore: 60,
    maxAttempts: 2,
    questionCount: 10,
    shuffleQuestions: false,
    showAnswerAfter: true,
    status: 'active'
  },
  {
    id: 2,
    courseId: 2,
    title: '客户服务技巧测验',
    description: '检验您对客户服务流程和沟通技巧的理解。',
    timeLimitMinutes: 20,
    passingScore: 70,
    maxAttempts: 3,
    questionCount: 8,
    shuffleQuestions: true,
    showAnswerAfter: true,
    status: 'active'
  }
]

// Mock 题目数据
const mockQuestions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      examId: 1,
      type: 'single',
      text: '食品储存时，冷藏温度应保持在多少度以下？',
      options: [
        { key: 'A', text: '10°C' },
        { key: 'B', text: '5°C' },
        { key: 'C', text: '0°C' },
        { key: 'D', text: '-5°C' }
      ],
      correctAnswer: 'B',
      score: 10,
      explanation: '根据食品安全标准，冷藏食品应保持在5°C以下，以有效抑制细菌繁殖。',
      sortOrder: 1
    },
    {
      id: 2,
      examId: 1,
      type: 'single',
      text: '以下哪种做法是正确的食品卫生操作？',
      options: [
        { key: 'A', text: '生熟食品混放' },
        { key: 'B', text: '用同一砧板切生肉和蔬菜' },
        { key: 'C', text: '生熟食品分开存放和加工' },
        { key: 'D', text: '直接用手接触熟食' }
      ],
      correctAnswer: 'C',
      score: 10,
      explanation: '生熟分开是预防交叉污染的基本原则。',
      sortOrder: 2
    },
    {
      id: 3,
      examId: 1,
      type: 'multi',
      text: '以下哪些情况需要洗手？（多选）',
      options: [
        { key: 'A', text: '接触生肉后' },
        { key: 'B', text: '上完厕所后' },
        { key: 'C', text: '处理垃圾后' },
        { key: 'D', text: '打喷嚏后' }
      ],
      correctAnswer: ['A', 'B', 'C', 'D'],
      score: 10,
      explanation: '以上所有情况都需要洗手，以确保食品安全。',
      sortOrder: 3
    },
    {
      id: 4,
      examId: 1,
      type: 'true_false',
      text: '食品解冻后可以反复冷冻。',
      options: [
        { key: 'true', text: '正确' },
        { key: 'false', text: '错误' }
      ],
      correctAnswer: 'false',
      score: 10,
      explanation: '反复冷冻解冻会导致细菌大量繁殖，影响食品安全。',
      sortOrder: 4
    },
    {
      id: 5,
      examId: 1,
      type: 'single',
      text: '厨房垃圾应该多久清理一次？',
      options: [
        { key: 'A', text: '每周一次' },
        { key: 'B', text: '每天至少一次' },
        { key: 'C', text: '垃圾满了再清理' },
        { key: 'D', text: '每月一次' }
      ],
      correctAnswer: 'B',
      score: 10,
      explanation: '厨房垃圾应每天及时清理，防止异味和细菌滋生。',
      sortOrder: 5
    },
    {
      id: 6,
      examId: 1,
      type: 'fill',
      text: '食品从业人员每年至少应进行____次健康检查。',
      correctAnswer: '1',
      score: 10,
      explanation: '根据规定，食品从业人员每年至少进行1次健康检查。',
      sortOrder: 6
    },
    {
      id: 7,
      examId: 1,
      type: 'single',
      text: '以下哪种温度范围被称为"危险温度带"？',
      options: [
        { key: 'A', text: '0°C - 5°C' },
        { key: 'B', text: '5°C - 60°C' },
        { key: 'C', text: '60°C - 100°C' },
        { key: 'D', text: '-18°C - 0°C' }
      ],
      correctAnswer: 'B',
      score: 10,
      explanation: '5°C至60°C是细菌最容易繁殖的温度范围，称为危险温度带。',
      sortOrder: 7
    },
    {
      id: 8,
      examId: 1,
      type: 'true_false',
      text: '戴手套操作可以完全替代洗手。',
      options: [
        { key: 'true', text: '正确' },
        { key: 'false', text: '错误' }
      ],
      correctAnswer: 'false',
      score: 10,
      explanation: '戴手套前仍需洗手，手套只是额外的防护措施。',
      sortOrder: 8
    },
    {
      id: 9,
      examId: 1,
      type: 'multi',
      text: '以下哪些是正确的食品储存方法？（多选）',
      options: [
        { key: 'A', text: '先进先出原则' },
        { key: 'B', text: '标注生产日期' },
        { key: 'C', text: '食品离地存放' },
        { key: 'D', text: '随意堆放节省空间' }
      ],
      correctAnswer: ['A', 'B', 'C'],
      score: 10,
      explanation: 'A、B、C都是正确的食品储存方法。',
      sortOrder: 9
    },
    {
      id: 10,
      examId: 1,
      type: 'single',
      text: '发现过期食品应该如何处理？',
      options: [
        { key: 'A', text: '打折出售' },
        { key: 'B', text: '立即销毁或退回' },
        { key: 'C', text: '继续使用' },
        { key: 'D', text: '送给员工' }
      ],
      correctAnswer: 'B',
      score: 10,
      explanation: '过期食品应立即下架并销毁或退回，严禁出售。',
      sortOrder: 10
    }
  ],
  2: [
    {
      id: 11,
      examId: 2,
      type: 'single',
      text: '当顾客投诉时，首先应该做什么？',
      options: [
        { key: 'A', text: '解释原因' },
        { key: 'B', text: '道歉并倾听' },
        { key: 'C', text: '找经理处理' },
        { key: 'D', text: '给予折扣' }
      ],
      correctAnswer: 'B',
      score: 12.5,
      explanation: '首先道歉表示重视，然后倾听了解具体问题。',
      sortOrder: 1
    },
    {
      id: 12,
      examId: 2,
      type: 'single',
      text: '与顾客沟通时，眼神应该？',
      options: [
        { key: 'A', text: '避免对视' },
        { key: 'B', text: '保持适度眼神接触' },
        { key: 'C', text: '一直盯着看' },
        { key: 'D', text: '看手机' }
      ],
      correctAnswer: 'B',
      score: 12.5,
      explanation: '适度的眼神接触表示尊重和关注。',
      sortOrder: 2
    },
    {
      id: 13,
      examId: 2,
      type: 'true_false',
      text: '服务过程中可以与同事闲聊。',
      options: [
        { key: 'true', text: '正确' },
        { key: 'false', text: '错误' }
      ],
      correctAnswer: 'false',
      score: 12.5,
      explanation: '服务时应专注于顾客，避免与同事闲聊。',
      sortOrder: 3
    },
    {
      id: 14,
      examId: 2,
      type: 'multi',
      text: '优质服务包括哪些要素？（多选）',
      options: [
        { key: 'A', text: '微笑' },
        { key: 'B', text: '专业知识' },
        { key: 'C', text: '及时响应' },
        { key: 'D', text: '主动服务' }
      ],
      correctAnswer: ['A', 'B', 'C', 'D'],
      score: 12.5,
      explanation: '以上都是优质服务的重要组成部分。',
      sortOrder: 4
    },
    {
      id: 15,
      examId: 2,
      type: 'single',
      text: '顾客说"我再看看"时，应该？',
      options: [
        { key: 'A', text: '立即推销更多产品' },
        { key: 'B', text: '给予空间，表示随时可以提供帮助' },
        { key: 'C', text: '忽略顾客' },
        { key: 'D', text: '催促顾客做决定' }
      ],
      correctAnswer: 'B',
      score: 12.5,
      explanation: '尊重顾客的节奏，同时表达随时服务的意愿。',
      sortOrder: 5
    },
    {
      id: 16,
      examId: 2,
      type: 'fill',
      text: '接待顾客时应该在____秒内给予回应。',
      correctAnswer: '30',
      score: 12.5,
      explanation: '及时响应是优质服务的基本要求，一般应在30秒内回应。',
      sortOrder: 6
    },
    {
      id: 17,
      examId: 2,
      type: 'single',
      text: '结账时发现价格错误，应该？',
      options: [
        { key: 'A', text: '假装没看见' },
        { key: 'B', text: '主动告知顾客并更正' },
        { key: 'C', text: '让顾客自己发现' },
        { key: 'D', text: '按错误价格收费' }
      ],
      correctAnswer: 'B',
      score: 12.5,
      explanation: '诚实是服务的基础，应主动更正错误。',
      sortOrder: 7
    },
    {
      id: 18,
      examId: 2,
      type: 'true_false',
      text: '即使顾客态度不好，也应该保持专业和礼貌。',
      options: [
        { key: 'true', text: '正确' },
        { key: 'false', text: '错误' }
      ],
      correctAnswer: 'true',
      score: 12.5,
      explanation: '专业服务人员应在任何情况下保持专业态度。',
      sortOrder: 8
    }
  ]
}

// Mock 考试记录
const mockAttempts: ExamAttempt[] = [
  {
    id: 1,
    examId: 1,
    userId: 1,
    attemptNumber: 1,
    score: 70,
    totalScore: 100,
    isPassed: true,
    startedAt: '2024-12-01T10:00:00Z',
    submittedAt: '2024-12-01T10:25:00Z',
    timeSpentSeconds: 1500
  }
]

export const useExamStore = defineStore('exam', () => {
  // 状态
  const exams = ref<Exam[]>([])
  const currentExam = ref<ExamDetail | null>(null)
  const currentAttempt = ref<ExamAttempt | null>(null)
  const currentAnswers = ref<Map<number, ExamAnswer>>(new Map())
  const examResult = ref<ExamResult | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const getExamByCourseId = computed(() => {
    return (courseId: number) => mockExams.find(e => e.courseId === courseId)
  })

  const answeredCount = computed(() => currentAnswers.value.size)

  const unansweredQuestions = computed(() => {
    if (!currentExam.value) return []
    return currentExam.value.questions.filter(
      q => !currentAnswers.value.has(q.id)
    )
  })

  // 获取课程关联的考试
  async function fetchExamByCourse(courseId: number): Promise<Exam | null> {
    loading.value = true
    try {
      // Mock: 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      const exam = mockExams.find(e => e.courseId === courseId) || null
      return exam
    } finally {
      loading.value = false
    }
  }

  // 获取考试详情（包含题目）
  async function fetchExamDetail(examId: number): Promise<ExamDetail | null> {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const exam = mockExams.find(e => e.id === examId)
      if (!exam) return null

      const questions = mockQuestions[examId] || []
      const myAttempts = mockAttempts.filter(a => a.examId === examId)
      const bestScore = myAttempts.length > 0
        ? Math.max(...myAttempts.map(a => a.score))
        : undefined

      currentExam.value = {
        ...exam,
        questions,
        myAttempts,
        bestScore,
        attemptsUsed: myAttempts.length
      }

      return currentExam.value
    } finally {
      loading.value = false
    }
  }

  // 开始考试
  async function startExam(examId: number): Promise<StartExamResponse | null> {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const exam = mockExams.find(e => e.id === examId)
      if (!exam) {
        error.value = '考试不存在'
        return null
      }

      const existingAttempts = mockAttempts.filter(a => a.examId === examId)
      if (existingAttempts.length >= exam.maxAttempts) {
        error.value = '已达到最大尝试次数'
        return null
      }

      const questions = mockQuestions[examId] || []
      const attemptId = Date.now()

      currentAttempt.value = {
        id: attemptId,
        examId,
        userId: 1,
        attemptNumber: existingAttempts.length + 1,
        score: 0,
        totalScore: questions.reduce((sum, q) => sum + q.score, 0),
        isPassed: false,
        startedAt: new Date().toISOString(),
        timeSpentSeconds: 0
      }

      currentAnswers.value = new Map()

      return {
        attemptId,
        exam,
        questions: exam.shuffleQuestions
          ? [...questions].sort(() => Math.random() - 0.5)
          : questions,
        startedAt: currentAttempt.value.startedAt
      }
    } finally {
      loading.value = false
    }
  }

  // 保存答案
  function saveAnswer(questionId: number, answer: string | string[]) {
    currentAnswers.value.set(questionId, {
      questionId,
      answer
    })
  }

  // 提交考试
  async function submitExam(timeSpentSeconds: number): Promise<ExamResult | null> {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      if (!currentExam.value || !currentAttempt.value) {
        error.value = '考试状态异常'
        return null
      }

      const questions = currentExam.value.questions
      let totalScore = 0
      let correctCount = 0
      let wrongCount = 0
      const answers: ExamAnswer[] = []

      // 计算分数
      for (const question of questions) {
        const userAnswer = currentAnswers.value.get(question.id)
        let isCorrect = false
        let scoreEarned = 0

        if (userAnswer) {
          if (Array.isArray(question.correctAnswer)) {
            // 多选题
            const userAnswerArr = Array.isArray(userAnswer.answer)
              ? userAnswer.answer
              : [userAnswer.answer]
            isCorrect =
              userAnswerArr.length === question.correctAnswer.length &&
              userAnswerArr.every(a => question.correctAnswer.includes(a))
          } else {
            // 单选/判断/填空
            const answerStr = Array.isArray(userAnswer.answer)
              ? userAnswer.answer[0]
              : userAnswer.answer
            isCorrect = answerStr.toLowerCase() === question.correctAnswer.toLowerCase()
          }

          if (isCorrect) {
            scoreEarned = question.score
            correctCount++
          } else {
            wrongCount++
          }

          answers.push({
            questionId: question.id,
            answer: userAnswer.answer,
            isCorrect,
            scoreEarned
          })
        } else {
          answers.push({
            questionId: question.id,
            answer: '',
            isCorrect: false,
            scoreEarned: 0
          })
        }

        totalScore += scoreEarned
      }

      const isPassed = totalScore >= currentExam.value.passingScore
      const unansweredCount = questions.length - answers.filter(a => a.answer !== '').length

      // 更新尝试记录
      currentAttempt.value = {
        ...currentAttempt.value,
        score: totalScore,
        isPassed,
        submittedAt: new Date().toISOString(),
        timeSpentSeconds,
        answers
      }

      // 保存到 mock 数据
      mockAttempts.push(currentAttempt.value)

      examResult.value = {
        attempt: currentAttempt.value,
        exam: currentExam.value,
        questions,
        answers,
        correctCount,
        wrongCount,
        unansweredCount
      }

      return examResult.value
    } finally {
      loading.value = false
    }
  }

  // 获取考试结果
  async function fetchExamResult(attemptId: number): Promise<ExamResult | null> {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      const attempt = mockAttempts.find(a => a.id === attemptId)
      if (!attempt) return null

      const exam = mockExams.find(e => e.id === attempt.examId)
      if (!exam) return null

      const questions = mockQuestions[exam.id] || []

      return {
        attempt,
        exam,
        questions,
        answers: attempt.answers || [],
        correctCount: attempt.answers?.filter(a => a.isCorrect).length || 0,
        wrongCount: attempt.answers?.filter(a => !a.isCorrect && a.answer !== '').length || 0,
        unansweredCount: attempt.answers?.filter(a => a.answer === '').length || 0
      }
    } finally {
      loading.value = false
    }
  }

  // 重置考试状态
  function resetExam() {
    currentExam.value = null
    currentAttempt.value = null
    currentAnswers.value = new Map()
    examResult.value = null
    error.value = null
  }

  return {
    // 状态
    exams,
    currentExam,
    currentAttempt,
    currentAnswers,
    examResult,
    loading,
    error,
    // 计算属性
    getExamByCourseId,
    answeredCount,
    unansweredQuestions,
    // 方法
    fetchExamByCourse,
    fetchExamDetail,
    startExam,
    saveAnswer,
    submitExam,
    fetchExamResult,
    resetExam
  }
})
