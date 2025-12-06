<script setup lang="ts">
import { ref } from 'vue'
import { Lock, LogOut, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import ChangePasswordForm from './ChangePasswordForm.vue'

const emit = defineEmits<{
  (e: 'logout'): void
}>()

const showPasswordForm = ref(false)

function togglePasswordForm() {
  showPasswordForm.value = !showPasswordForm.value
}

function handleLogout() {
  emit('logout')
}

function handlePasswordSubmit(data: { oldPassword: string; newPassword: string }) {
  // TODO: 调用 API 修改密码
  console.log('修改密码:', data)
  showPasswordForm.value = false
}

function handlePasswordCancel() {
  showPasswordForm.value = false
}
</script>

<template>
  <div class="bg-card rounded-xl border border-border overflow-hidden">
    <!-- 标题栏 -->
    <div class="px-4 py-3 border-b border-border">
      <h3 class="font-bold text-foreground">设置</h3>
    </div>

    <!-- 修改密码 -->
    <div>
      <button
        class="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
        @click="togglePasswordForm"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Lock class="w-4 h-4 text-muted-foreground" />
          </div>
          <span class="text-sm text-foreground">修改密码</span>
        </div>
        <component
          :is="showPasswordForm ? ChevronUp : ChevronDown"
          class="w-4 h-4 text-muted-foreground"
        />
      </button>

      <!-- 修改密码表单 -->
      <div v-if="showPasswordForm" class="px-4 pb-4">
        <ChangePasswordForm
          @submit="handlePasswordSubmit"
          @cancel="handlePasswordCancel"
        />
      </div>
    </div>

    <Separator />

    <!-- 退出登录 -->
    <button
      class="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
      @click="handleLogout"
    >
      <div class="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
        <LogOut class="w-4 h-4 text-destructive" />
      </div>
      <span class="text-sm text-destructive">退出登录</span>
    </button>
  </div>
</template>
