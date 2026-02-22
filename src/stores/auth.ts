import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout } from '../api/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') || null,
    token: localStorage.getItem('access_token') || null,
    role: localStorage.getItem('user_role') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isTeacher: (state) => state.role === 'teacher',
    isStudent: (state) => state.role === 'student',
  },
  actions: {
    async login(credentials: any) {
      try {
        const response = await apiLogin(credentials.username, credentials.password)
        // 假设后端返回 { access: 'token', user: { id, username, role } }
        const { access, user } = response.data
        this.token = access
        this.user = user
        this.role = user.role
        localStorage.setItem('access_token', access)
        localStorage.setItem('user_role', user.role)
        localStorage.setItem('user', JSON.stringify(user))
        // 根据角色跳转
        if (user.role === 'teacher') {
          router.push('/teacher/Dashboard')
        } else {
          router.push('/student/Dashboard')
        }
      } catch (error) {
        throw error
      }
    },
    async logout() {
      await apiLogout()
      this.token = null
      this.user = null
      this.role = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_role')
      localStorage.removeItem('user')
      router.push('/login')
    },
  },
})
