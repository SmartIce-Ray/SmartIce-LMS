<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, BookOpen, User, LogOut, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/courses', icon: BookOpen, label: '课程' },
  { path: '/profile', icon: User, label: '我的' },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// 桌面端 hover 时暂时展开
const handleMouseEnter = () => {
  // 只在桌面端折叠状态下触发
  if (props.collapsed && window.innerWidth >= 768) {
    emit('update:collapsed', false)
  }
}

const closeSidebar = () => {
  emit('update:collapsed', true)
}

// 点击导航项后，移动端自动关闭侧边栏
const handleNavClick = () => {
  if (window.innerWidth < 768) {
    closeSidebar()
  }
}
</script>

<template>
  <!-- 移动端遮罩 -->
  <Transition name="fade">
    <div
      v-if="!collapsed"
      class="fixed inset-0 z-30 bg-black/50 md:hidden"
      @click="closeSidebar"
    />
  </Transition>

  <!-- 侧边栏 -->
  <aside
    class="fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out"
    :class="[
      collapsed
        ? '-translate-x-full md:translate-x-0 md:w-16 w-64'
        : 'translate-x-0 w-64'
    ]"
  >
    <div class="flex h-full flex-col">
      <!-- Logo 区域 -->
      <div class="flex h-16 items-center px-4 border-b border-sidebar-border">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span class="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span
            class="font-semibold text-sidebar-foreground whitespace-nowrap transition-opacity duration-300"
            :class="collapsed ? 'md:opacity-0' : 'opacity-100'"
          >
            SmartIce LMS
          </span>
        </div>
        <!-- 移动端关闭按钮 -->
        <button
          @click="closeSidebar"
          class="ml-auto p-2 rounded-lg hover:bg-sidebar-accent transition-colors md:hidden"
        >
          <X class="w-5 h-5 text-sidebar-foreground" />
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-primary text-primary-foreground shadow-[var(--shadow-button)]'
              : 'text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed ? 'md:justify-center' : ''
          ]"
          @click="handleNavClick"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span
            class="font-medium whitespace-nowrap transition-opacity duration-300"
            :class="collapsed ? 'md:hidden' : ''"
          >
            {{ item.label }}
          </span>
        </router-link>
      </nav>

      <!-- 退出按钮 -->
      <div class="px-3 py-4 border-t border-sidebar-border overflow-hidden">
        <button
          @click="handleLogout"
          class="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
          :class="collapsed ? 'md:justify-center' : ''"
        >
          <LogOut class="w-5 h-5 flex-shrink-0" />
          <span
            class="font-medium whitespace-nowrap transition-opacity duration-300"
            :class="collapsed ? 'md:hidden' : ''"
          >
            退出登录
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
