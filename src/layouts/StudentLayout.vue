<template>
  <el-container class="layout">
    <el-header class="header-container">
      <el-menu mode="horizontal" :ellipsis="false" class="nav-menu">
        <el-menu-item index="1" class="logo-text">Learning Activities System (Student)</el-menu-item>
        <div class="flex-grow" />
        
        <el-menu-item index="2" @click="goToDashboard">Dashboard</el-menu-item>
        <el-menu-item index="3" @click="BrowseActivity">Browse Activity</el-menu-item>
        
        <div class="right-actions">
          <el-switch
            v-model="isDark"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sun"
            style="--el-switch-on-color: #2c2c2c; --el-switch-off-color: #dcdfe6; margin-right: 20px;"
            @change="toggleDark"
          />
          
          <el-avatar :size="32" :style="{ backgroundColor: getAvatarColor(username) }" class="user-avatar">
            {{ username ? username.charAt(0).toUpperCase() : 'U' }}
          </el-avatar>
          <span class="username-display">{{ username }}</span>

          <el-menu-item index="4" @click="logout" class="logout-btn">Logout</el-menu-item>
        </div>
      </el-menu>
    </el-header>
    <el-main class="main-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Sunny as Sun, Moon } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 从状态仓库中获取 username
const username = computed(() => authStore.user?.username || 'User')

// 路由跳转方法
const goToDashboard = () => router.push('/student/dashboard')
const BrowseActivity = () => router.push('/student/activities')
const logout = () => authStore.logout()

// 暗黑模式逻辑
const isDark = ref(false)
const toggleDark = (value) => {
  const html = document.documentElement
  if (value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// 动态头像颜色生成逻辑
const getAvatarColor = (name) => {
  if (!name) return '#409EFF'
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a']
  let sum = 0
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i)
  }
  return colors[sum % colors.length]
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
.header-container {
  padding: 0;
  border-bottom: solid 1px var(--el-menu-border-color);
}
.nav-menu {
  border-bottom: none;
  padding: 0 20px;
}
.flex-grow {
  flex-grow: 1;
}
.logo-text {
  font-weight: bold;
  font-size: 16px;
  pointer-events: none; /* 让 Logo 不可点击 */
}

/* 右侧操作区样式 */
.right-actions {
  display: flex;
  align-items: center;
  height: 100%;
}
.user-avatar {
  margin-right: 8px;
  font-weight: bold;
}
.username-display {
  margin-right: 20px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
.logout-btn {
  color: #F56C6C !important;
}
</style>