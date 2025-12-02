<script setup lang="ts">
import { Megaphone, ChevronRight } from 'lucide-vue-next'

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
  <div
    v-if="notices.length > 0"
    class="bg-card/50 rounded-xl px-4 py-3 border border-border flex items-center gap-3 cursor-pointer hover:bg-card transition-colors"
    @click="emit('click', notices[0])"
  >
    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Megaphone class="w-4 h-4 text-primary" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-foreground truncate">
        {{ notices[0].title }}
      </p>
    </div>
    <ChevronRight class="w-4 h-4 text-muted-foreground flex-shrink-0" />
  </div>
</template>
