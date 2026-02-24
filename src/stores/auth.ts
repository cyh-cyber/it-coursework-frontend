import { defineStore } from 'pinia'
import apiClient from '@/api/client'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')||'null') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isTeacher: (state) => state.user?.role === 'teacher',
    isStudent: (state) => state.user?.role === 'student',
  },
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const response = await apiClient.post('/login/', credentials)
        // 登录成功后，后端会设置 session cookie，并返回用户信息
        const user = response.data.user
        //记录登录时间以便删除localstorage
        localStorage.setItem('login_timestamp', Date.now().toString())
        this.user = user
        localStorage.setItem('user', JSON.stringify(user))

        // 根据角色跳转
        if (user.role === 'teacher') {
          router.push('/teacher/dashboard')
        } else {
          router.push('/student/dashboard')
        }
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    async logout() {
      try {
        await apiClient.post('/logout/')
      } finally {
        this.user = null
        localStorage.removeItem('user')
        router.push('/login')
      }
    },
    async register(userData: any) {
      try {
        const response = await apiClient.post('/register/', userData)
        // 注册成功后通常不自动登录，可跳转到登录页
        return response.data
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },
    // 可选：初始化时检查登录状态（如果需要）
    async checkAuth() {
      try {
        // 发送一个需要认证的请求，例如获取当前用户信息
        const response = await apiClient.get('/user/')  // 需要后端提供该接口
        this.user = response.data.user
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch {
        this.user = null
        localStorage.removeItem('user')
      }
    },
  },
})
