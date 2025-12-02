<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-vue-next'

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
  <div class="bg-card rounded-xl border border-border overflow-hidden">
    <!-- 封面区域 -->
    <div class="relative aspect-[2/1] bg-muted">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <Play class="w-16 h-16 text-primary/50" />
      </div>

      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <!-- 底部信息 -->
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <h3 class="font-bold text-white text-lg mb-1 line-clamp-1">
          {{ title }}
        </h3>
        <p v-if="currentLesson" class="text-white/70 text-sm">
          {{ currentLesson }}
        </p>
      </div>
    </div>

    <!-- 进度和按钮 -->
    <div class="p-4">
      <!-- 进度条 -->
      <div class="flex items-center gap-3 mb-4">
        <div class="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <span class="text-sm font-semibold text-foreground">{{ progress }}%</span>
      </div>

      <!-- 继续学习按钮 -->
      <Button
        class="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-button)] transition-all duration-200 active:scale-[0.98]"
        @click="emit('continue', id)"
      >
        <Play class="w-5 h-5 mr-2" />
        继续学习
      </Button>
    </div>
  </div>
</template>
