<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const emit = defineEmits<{
  (e: 'submit', data: { oldPassword: string; newPassword: string }): void
  (e: 'cancel'): void
}>()

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref<Record<string, string>>({})

// 验证表单
const isValid = computed(() => {
  return (
    form.value.oldPassword.length > 0 &&
    form.value.newPassword.length >= 6 &&
    form.value.newPassword === form.value.confirmPassword
  )
})

function validate(): boolean {
  errors.value = {}

  if (!form.value.oldPassword) {
    errors.value.oldPassword = '请输入原密码'
  }

  if (!form.value.newPassword) {
    errors.value.newPassword = '请输入新密码'
  } else if (form.value.newPassword.length < 6) {
    errors.value.newPassword = '密码至少6位'
  }

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = '请确认新密码'
  } else if (form.value.confirmPassword !== form.value.newPassword) {
    errors.value.confirmPassword = '两次密码不一致'
  }

  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validate()) {
    emit('submit', {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    })
  }
}

function handleCancel() {
  form.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  errors.value = {}
  emit('cancel')
}
</script>

<template>
  <div class="space-y-4 pt-2">
    <!-- 原密码 -->
    <div class="space-y-2">
      <Label for="old-password" class="text-sm text-muted-foreground">原密码</Label>
      <div class="relative">
        <Input
          id="old-password"
          v-model="form.oldPassword"
          :type="showOldPassword ? 'text' : 'password'"
          placeholder="请输入原密码"
          class="pr-10"
          :class="{ 'border-destructive': errors.oldPassword }"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          @click="showOldPassword = !showOldPassword"
        >
          <component :is="showOldPassword ? EyeOff : Eye" class="w-4 h-4" />
        </button>
      </div>
      <p v-if="errors.oldPassword" class="text-xs text-destructive">{{ errors.oldPassword }}</p>
    </div>

    <!-- 新密码 -->
    <div class="space-y-2">
      <Label for="new-password" class="text-sm text-muted-foreground">新密码</Label>
      <div class="relative">
        <Input
          id="new-password"
          v-model="form.newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          placeholder="请输入新密码（至少6位）"
          class="pr-10"
          :class="{ 'border-destructive': errors.newPassword }"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          @click="showNewPassword = !showNewPassword"
        >
          <component :is="showNewPassword ? EyeOff : Eye" class="w-4 h-4" />
        </button>
      </div>
      <p v-if="errors.newPassword" class="text-xs text-destructive">{{ errors.newPassword }}</p>
    </div>

    <!-- 确认新密码 -->
    <div class="space-y-2">
      <Label for="confirm-password" class="text-sm text-muted-foreground">确认新密码</Label>
      <div class="relative">
        <Input
          id="confirm-password"
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="请再次输入新密码"
          class="pr-10"
          :class="{ 'border-destructive': errors.confirmPassword }"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <component :is="showConfirmPassword ? EyeOff : Eye" class="w-4 h-4" />
        </button>
      </div>
      <p v-if="errors.confirmPassword" class="text-xs text-destructive">{{ errors.confirmPassword }}</p>
    </div>

    <!-- 按钮组 -->
    <div class="flex gap-3 pt-2">
      <Button
        variant="outline"
        class="flex-1"
        @click="handleCancel"
      >
        取消
      </Button>
      <Button
        class="flex-1 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all"
        :disabled="!isValid"
        @click="handleSubmit"
      >
        确认修改
      </Button>
    </div>
  </div>
</template>
