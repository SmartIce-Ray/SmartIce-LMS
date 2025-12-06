<script setup lang="ts">
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
    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--bg-tertiary)] to-[#FFE4CC] border border-primary/20 shadow-sm"
  >
    <span class="text-lg animate-flame">🔥</span>
    <span class="text-sm font-semibold text-primary">
      {{ days }}天连胜
    </span>
  </div>
</template>
