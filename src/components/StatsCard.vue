<script setup lang="ts">
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
    <div
      class="stat-card bg-card rounded-xl p-4 border border-border flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 animate-fade-in-up animation-delay-100 animation-fill-both"
    >
      <div class="stat-top-bar absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300" />
      <span class="text-2xl font-bold gradient-text mb-1">{{ completedCourses }}</span>
      <span class="text-xs text-muted-foreground font-medium">完成课程</span>
    </div>

    <!-- 通过考试 -->
    <div
      class="stat-card bg-card rounded-xl p-4 border border-border flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 animate-fade-in-up animation-delay-200 animation-fill-both"
    >
      <div class="stat-top-bar absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300" />
      <span class="text-2xl font-bold gradient-text mb-1">{{ passedExams }}</span>
      <span class="text-xs text-muted-foreground font-medium">通过考试</span>
    </div>

    <!-- 学习时长 -->
    <div
      class="stat-card bg-card rounded-xl p-4 border border-border flex flex-col items-center relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 animate-fade-in-up animation-delay-300 animation-fill-both"
    >
      <div class="stat-top-bar absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity duration-300" />
      <span class="text-2xl font-bold gradient-text mb-1">{{ learningHours }}h</span>
      <span class="text-xs text-muted-foreground font-medium">学习时长</span>
    </div>
  </div>
</template>

<style scoped>
.stat-card:hover .stat-top-bar {
  opacity: 1;
}
</style>
