import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/Register.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/teacher',
      component: () => import('@/layouts/TeacherLayout.vue'),
      meta: { requiresAuth: true, role: 'teacher' },
      children: [
        { path: 'dashboard', name: 'teacher-dashboard', component: () => import('@/views/teacher/Dashboard.vue') },
        { path: 'activities/create', name: 'teacher-create-activity', component: () => import('@/views/teacher/CreateActivity.vue') },
        { path: 'activities/:id/participants', name: 'teacher-participants', component: () => import('@/views/teacher/ActivityParticipants.vue') },
      ],
    },
    {
      path: '/student',
      component: () => import('@/layouts/StudentLayout.vue'),
      meta: { requiresAuth: true, role: 'student' },
      children: [
        { path: 'dashboard', name: 'student-dashboard', component: () => import('@/views/student/Dashboard.vue') },
        { path: 'activities', name: 'student-activities', component: () => import('@/views/student/ActivityList.vue') },
        { path: 'activities/:id', name: 'student-activity-detail', component: () => import('@/views/student/ActivityDetail.vue') },
      ],
    },
    { path: '/', redirect: '/login' },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/common/NotFound.vue') },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const loginTimestamp = localStorage.getItem('login_timestamp')
  const MAX_AGE = 24 * 60 * 60 * 1000
  
  if (loginTimestamp && (Date.now() - parseInt(loginTimestamp) > MAX_AGE)) {
    localStorage.removeItem('user')
    localStorage.removeItem('login_timestamp')
    authStore.user = null // 清空 store 中的用户信息
    // 如果目标路由需要登录，则强制跳转登录页
    if (to.meta.requiresAuth) {
      return '/login'
    }
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresGuest && authStore.isAuthenticated) {
    next(authStore.isTeacher ? '/teacher/dashboard' : '/student/dashboard')
  } else {
    next()
  }
})

export default router