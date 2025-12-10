# SmartIce LMS 前端

## 项目概述

有点东西餐饮集团培训管理系统前端，配合 SmartIce LMS 后端使用。

**GitHub**: https://github.com/SmartIce-Ray/LMS-Frontend

### 第一阶段：员工学习端（WebApp）
- **目标用户**：门店员工（新员工入职 + 在岗技能提升）
- **技术形态**：WebApp → 后续小程序/原生
- **核心功能**：课程学习、考试答题、消息通知、个人中心

---

## 开发进度

| Phase | 模块 | 状态 |
|-------|------|------|
| Phase 1 | 基础框架与布局 | ✅ 完成 |
| Phase 2 | 首页（学习中心） | ✅ 完成 |
| Phase 3 | 课程模块 | ✅ 完成 |
| Phase 4 | 个人中心 | ✅ 完成 |
| Phase 5 | 考试功能 | ✅ 完成 (Mock) |
| Phase 6 | 消息中心 | ✅ 完成 (Mock) |
| Phase 7 | API 集成 | ⏳ 待开发 |

---

## 设计风格

- **主题**：浅色模式（默认），支持深色模式切换
- **导航**：侧边栏（移动端抽屉式，桌面端折叠式）
- **设计哲学**：苹果 HIG（清晰、依从、深度）
- **动画**：fadeInUp、bounceIn、shimmer 等微动效

### 色彩系统（Solar Spark 浅色主题）
| 用途 | 色值 |
|-----|------|
| 背景 | #FFFFFF |
| 卡片 | #FFFFFF |
| 主色(CTA) | #EA580C (橙色) |
| 进度条 | #4ECDC4 (青绿) |
| 成功 | #16A34A |
| 警告 | #D97706 |
| 主文字 | #18181B |
| 次文字 | #52525B |

---

## 技术栈

| 组件 | 技术选型 |
|------|----------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| UI 组件库 | shadcn-vue (New York 风格) |
| 样式 | Tailwind CSS v4 |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| HTTP | Axios |
| 构建 | Vite |
| 包管理 | pnpm |

---

## 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/login` | Login.vue | 登录页 |
| `/` | Home.vue | 首页（学习中心） |
| `/courses` | CourseList.vue | 课程列表 |
| `/courses/:id` | CourseDetail.vue | 课程详情 |
| `/courses/:id/learn` | Learn.vue | 学习页面 |
| `/exams/:examId` | TakeExam.vue | 答题页面 |
| `/exams/:examId/result/:attemptId` | ExamResult.vue | 成绩页面 |
| `/messages` | Messages.vue | 消息中心 |
| `/profile` | Profile.vue | 个人中心 |

---

## 目录结构

```
src/
├── components/
│   ├── ui/                  # shadcn-vue 基础组件
│   ├── exam/                # 考试相关组件
│   │   ├── ExamCard.vue
│   │   ├── SingleChoice.vue
│   │   ├── MultiChoice.vue
│   │   ├── TrueFalse.vue
│   │   ├── FillBlank.vue
│   │   └── QuestionNav.vue
│   ├── Sidebar.vue          # 侧边栏导航
│   ├── StatsCard.vue        # 统计卡片
│   ├── StreakBadge.vue      # 连胜徽章
│   ├── NoticeBanner.vue     # 公告横幅
│   ├── RecentCourse.vue     # 继续学习卡片
│   ├── PendingCourses.vue   # 待学课程列表
│   └── CourseCard.vue       # 课程卡片
├── layouts/
│   └── MainLayout.vue       # 主布局
├── pages/
│   ├── Home.vue
│   ├── Login.vue
│   ├── Messages.vue
│   ├── Profile.vue
│   ├── courses/
│   │   ├── CourseList.vue
│   │   ├── CourseDetail.vue
│   │   └── Learn.vue
│   └── exams/
│       ├── TakeExam.vue
│       └── ExamResult.vue
├── stores/
│   ├── auth.ts              # 认证状态
│   ├── exam.ts              # 考试状态 (Mock)
│   └── notification.ts      # 通知状态 (Mock)
├── types/
│   ├── user.ts
│   ├── exam.ts
│   └── notification.ts
├── router/index.ts
├── lib/
│   ├── api.ts               # Axios 实例
│   └── utils.ts             # 工具函数
└── style.css                # 全局样式 + 主题变量
```

---

## 后端 API

- **基础地址**：`http://localhost:8000/api/v1`
- **认证方式**：JWT Bearer Token（access + refresh）
- **API 文档**：`http://localhost:8000/docs`（Swagger）

### 待对接端点
| 端点 | 方法 | 功能 |
|------|------|------|
| `/exams` | GET | 获取考试列表 |
| `/exams/{id}` | GET | 获取考试详情+题目 |
| `/exams/{id}/start` | POST | 开始考试 |
| `/exams/{id}/submit` | POST | 提交答卷 |
| `/notifications` | GET | 获取通知列表 |
| `/notifications/read-all` | POST | 全部已读 |

---

## 开发命令

```bash
pnpm install      # 安装依赖
pnpm dev          # 开发服务器 (localhost:5173)
pnpm build        # 构建生产版本
pnpm preview      # 预览生产版本
```

---

## 关键设计决策

1. **浅色主题默认**：更适合日常培训场景，深色模式可选
2. **侧边栏导航**：移动端抽屉式滑入，桌面端可折叠
3. **Mock 数据优先**：前端功能完整，后端 API 待对接
4. **游戏化元素**：连胜显示、完成动画

---

## 文档索引

| 文档 | 说明 |
|-----|------|
| ~/.claude/plans/playful-moseying-hare.md | 开发计划（Phase 5-7 详细任务） |
