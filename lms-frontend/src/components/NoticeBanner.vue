<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

interface Notice {
  id: number
  title: string
  url?: string
}

interface Props {
  notices?: Notice[]
}

withDefaults(defineProps<Props>(), {
  notices: () => []
})

const emit = defineEmits<{
  click: [notice: Notice]
}>()
</script>

<template>
  <button
    v-if="notices.length > 0"
    class="w-full bg-[var(--bg-secondary)] rounded-lg px-4 py-3 border-l-4 border-primary flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-tertiary)] hover:translate-x-1 transition-all duration-200 group"
    @click="emit('click', notices[0])"
  >
    <svg
      class="w-5 h-5 text-primary flex-shrink-0 animate-ring"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
    <span class="flex-1 text-left text-sm text-muted-foreground font-medium truncate">
      {{ notices[0].title }}
    </span>
    <ChevronRight class="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
  </button>
</template>
