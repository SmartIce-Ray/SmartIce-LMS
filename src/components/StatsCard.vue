<script setup lang="ts">
import { BookOpen, Award, Clock } from 'lucide-vue-next'

interface Props {
  completedCourses?: number
  passedExams?: number
  learningHours?: number
}

withDefaults(defineProps<Props>(), {
  completedCourses: 0,
  passedExams: 0,
  learningHours: 0
})
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <!-- 完成课程 -->
    <div class="bg-card rounded-xl p-4 border border-border flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        <BookOpen class="w-5 h-5 text-primary" />
      </div>
      <span class="text-2xl font-bold text-foreground">{{ completedCourses }}</span>
      <span class="text-xs text-muted-foreground">完成课程</span>
    </div>

    <!-- 通过考试 -->
    <div class="bg-card rounded-xl p-4 border border-border flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mb-2">
        <Award class="w-5 h-5 text-success" />
      </div>
      <span class="text-2xl font-bold text-foreground">{{ passedExams }}</span>
      <span class="text-xs text-muted-foreground">通过考试</span>
    </div>

    <!-- 学习时长 -->
    <div class="bg-card rounded-xl p-4 border border-border flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
        <Clock class="w-5 h-5 text-secondary" />
      </div>
      <span class="text-2xl font-bold text-foreground">{{ learningHours }}</span>
      <span class="text-xs text-muted-foreground">学习时长</span>
    </div>
  </div>
</template>
