<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'

interface Props {
  id: number
  title: string
  coverUrl?: string
  progress?: number
  currentLesson?: string
}

const props = withDefaults(defineProps<Props>(), {
  coverUrl: '',
  progress: 0,
  currentLesson: ''
})

const emit = defineEmits<{
  continue: [id: number]
}>()
</script>

<template>
  <div class="bg-card rounded-xl border border-border overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg">
    <!-- 封面区域 -->
    <div class="relative aspect-[2/1] bg-muted overflow-hidden group">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <svg class="w-16 h-16 text-primary/50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>

      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

      <!-- 底部信息 -->
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <span class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary bg-primary/20 backdrop-blur-sm px-2 py-1 rounded mb-2">
          <span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-soft" />
          正在进行
        </span>
        <h3 class="font-bold text-white text-lg mb-1 line-clamp-1">
          {{ title }}
        </h3>
      </div>
    </div>

    <!-- 进度和按钮 -->
    <div class="p-4">
      <!-- 进度信息 -->
      <div class="flex justify-between text-xs text-muted-foreground mb-2 font-mono">
        <span>{{ currentLesson }}</span>
        <span>{{ progress }}%</span>
      </div>

      <!-- 进度条 -->
      <div class="h-2.5 bg-muted rounded-full overflow-hidden mb-4 shadow-inner">
        <div
          class="progress-fill h-full bg-gradient-to-r from-primary to-accent rounded-full relative overflow-hidden transition-all duration-700"
          :style="{ width: `${progress}%` }"
        >
          <div class="shimmer-effect absolute inset-0" />
        </div>
      </div>

      <!-- 继续学习按钮 -->
      <Button
        class="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-[#D94A00] hover:from-primary/90 hover:to-[#D94A00]/90 text-primary-foreground shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-lg)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] group"
        @click="emit('continue', id)"
      >
        继续学习
        <ArrowRight class="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.shimmer-effect {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
