<script setup lang="ts">
import { Flame } from 'lucide-vue-next'

interface Props {
  days?: number
}

withDefaults(defineProps<Props>(), {
  days: 0
})
</script>

<template>
  <div
    v-if="days > 0"
    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
  >
    <Flame class="w-5 h-5 text-orange-500 animate-pulse" />
    <span class="text-sm font-semibold text-orange-400">
      连续学习 {{ days }} 天
    </span>
  </div>
</template>
