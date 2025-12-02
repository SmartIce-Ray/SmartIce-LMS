<script setup lang="ts">
import { Play } from 'lucide-vue-next'

interface Props {
  id: number
  title: string
  coverUrl?: string
  progress?: number
  totalLessons?: number
  completedLessons?: number
  category?: string
}

const props = withDefaults(defineProps<Props>(), {
  coverUrl: '',
  progress: 0,
  totalLessons: 0,
  completedLessons: 0,
  category: ''
})

const emit = defineEmits<{
  click: [id: number]
}>()
</script>

<template>
  <div
    class="bg-card rounded-xl border border-border overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
    @click="emit('click', id)"
  >
    <!-- 封面图 -->
    <div class="relative aspect-video bg-muted">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        :alt="title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Play class="w-12 h-12 text-muted-foreground/30" />
      </div>

      <!-- 分类标签 -->
      <div
        v-if="category"
        class="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm"
      >
        {{ category }}
      </div>

      <!-- 进度遮罩 -->
      <div
        v-if="progress > 0 && progress < 100"
        class="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/20"
      >
        <div
          class="h-full bg-secondary transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <!-- 已完成标记 -->
      <div
        v-if="progress === 100"
        class="absolute inset-0 bg-success/20 flex items-center justify-center"
      >
        <div class="w-12 h-12 rounded-full bg-success flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- 信息区 -->
    <div class="p-3">
      <h3 class="font-semibold text-foreground text-sm line-clamp-2 mb-1">
        {{ title }}
      </h3>
      <p class="text-xs text-muted-foreground">
        <template v-if="progress > 0">
          {{ completedLessons }}/{{ totalLessons }} 节 · {{ progress }}%
        </template>
        <template v-else>
          共 {{ totalLessons }} 节
        </template>
      </p>
    </div>
  </div>
</template>
