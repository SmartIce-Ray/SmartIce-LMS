<script setup lang="ts">
import { computed } from 'vue'
import { BookOpen, Award, Clock, Flame } from 'lucide-vue-next'
import type { LearningStats } from '@/types/profile'

interface Props {
  stats: LearningStats
}

const props = defineProps<Props>()

// 格式化学习时长
const formattedDuration = computed(() => {
  const minutes = props.stats.learningMinutes
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const remainMinutes = minutes % 60
  if (remainMinutes === 0) {
    return `${hours}小时`
  }
  return `${hours}h${remainMinutes}m`
})
</script>

<template>
  <div class="grid grid-cols-4 gap-2">
    <!-- 完成课程 -->
    <div class="bg-card rounded-xl p-3 border border-border flex flex-col items-center">
      <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-1.5">
        <BookOpen class="w-4 h-4 text-primary" />
      </div>
      <span class="text-xl font-bold text-foreground">{{ stats.completedCourses }}</span>
      <span class="text-[10px] text-muted-foreground">完成课程</span>
    </div>

    <!-- 通过考试 -->
    <div class="bg-card rounded-xl p-3 border border-border flex flex-col items-center">
      <div class="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center mb-1.5">
        <Award class="w-4 h-4 text-success" />
      </div>
      <span class="text-xl font-bold text-foreground">{{ stats.passedExams }}</span>
      <span class="text-[10px] text-muted-foreground">通过考试</span>
    </div>

    <!-- 学习时长 -->
    <div class="bg-card rounded-xl p-3 border border-border flex flex-col items-center">
      <div class="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center mb-1.5">
        <Clock class="w-4 h-4 text-secondary" />
      </div>
      <span class="text-xl font-bold text-foreground">{{ formattedDuration }}</span>
      <span class="text-[10px] text-muted-foreground">学习时长</span>
    </div>

    <!-- 连胜天数 -->
    <div class="bg-card rounded-xl p-3 border border-border flex flex-col items-center">
      <div class="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center mb-1.5">
        <Flame class="w-4 h-4 text-orange-500" />
      </div>
      <span class="text-xl font-bold text-foreground">{{ stats.streakDays }}</span>
      <span class="text-[10px] text-muted-foreground">连胜天数</span>
    </div>
  </div>
</template>
