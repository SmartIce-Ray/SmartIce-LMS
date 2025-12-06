<script setup lang="ts">
import { computed, ref } from 'vue'
import { Camera } from 'lucide-vue-next'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/user'

interface Props {
  user: User
  storeName?: string
}

const props = withDefaults(defineProps<Props>(), {
  storeName: '未知门店'
})

const emit = defineEmits<{
  (e: 'avatar-change', file: File): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

// 计算头像首字母
const initial = computed(() => {
  const name = props.user.full_name || props.user.username
  return name ? name.charAt(0).toUpperCase() : 'U'
})

// 角色映射
const roleLabel = computed(() => {
  const roleMap: Record<string, string> = {
    super_admin: '超级管理员',
    brand_admin: '品牌管理员',
    store_manager: '店长',
    trainer: '培训师',
    supervisor: '主管',
    employee: '员工'
  }
  const firstRole = props.user.roles?.[0]
  return firstRole ? roleMap[firstRole] || firstRole : '员工'
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('avatar-change', file)
  }
}
</script>

<template>
  <div class="bg-card rounded-xl p-6 border border-border">
    <div class="flex items-start gap-4">
      <!-- 头像区域 -->
      <div class="relative flex-shrink-0">
        <Avatar class="w-16 h-16">
          <AvatarImage
            v-if="user.avatar_url"
            :src="user.avatar_url"
            :alt="user.full_name"
          />
          <AvatarFallback class="bg-primary/20 text-primary text-xl font-bold">
            {{ initial }}
          </AvatarFallback>
        </Avatar>

        <!-- 编辑头像按钮 -->
        <button
          class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all"
          @click="triggerFileInput"
        >
          <Camera class="w-3.5 h-3.5 text-primary-foreground" />
        </button>

        <!-- 隐藏的文件输入 -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <!-- 用户信息 -->
      <div class="flex-1 min-w-0">
        <h2 class="text-xl font-bold text-foreground truncate">
          {{ user.full_name || user.username }}
        </h2>
        <p class="text-sm text-muted-foreground mt-1">
          {{ roleLabel }} · {{ storeName }}
        </p>
        <p class="text-sm text-muted-foreground mt-0.5 truncate">
          {{ user.email }}
        </p>
      </div>
    </div>
  </div>
</template>
