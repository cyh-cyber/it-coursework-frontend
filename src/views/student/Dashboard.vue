<template>
  <div class="student-dashboard">
    <div class="welcome-banner">
      <h2>Welcome back, {{ username }}! 👋</h2>
      <p>Here is your upcoming schedule.</p>
      <div class="time-display">
        <el-icon><Timer /></el-icon> {{ currentTime }}
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="schedule-card">
          <template #header>
            <div class="card-header">
              <span>My Schedule (Upcoming Activities)</span>
              <el-button type="primary" size="small" @click="goToBrowse">Browse More Activities</el-button>
            </div>
          </template>
          <el-timeline v-if="registeredActivities.length > 0">
            <el-timeline-item
              v-for="act in registeredActivities"
              :key="act.id"
              :timestamp="formatDate(act.time)"
              placement="top"
            >
              <el-card>
                <h4>{{ act.title }}</h4>
                <p><el-icon><Location /></el-icon> {{ act.place }}</p>
                <p><el-icon><Collection /></el-icon> {{ getCategoryLabel(act.category) }}</p>
                <el-button type="primary" link @click="goToDetail(act.id)">View Details</el-button>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="You haven't registered for any activities yet." />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { Timer } from '@element-plus/icons-vue' // 引入时钟图标
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Location, Collection } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { getMySchedule } from '@/api/activities' // 需要后端提供获取学生已注册活动的接口
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()
const registeredActivities = ref([])
const username = computed(() => authStore.user?.username || 'User')

const currentTime = ref(dayjs().format('dddd, MMMM D, YYYY | HH:mm:ss'))
let timer = null//定义时钟变量和定时器

const fetchSchedule = async () => {
  try {
    const res = await getMySchedule()
    registeredActivities.value = res.data
  } catch (error) {
    ElMessage.error('Failed to load schedule')
  }
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const getCategoryLabel = (value) => {
  const map = {
    academic: 'Academic',
    sports: 'Sports',
    culture: 'Culture',
  }
  return map[value] || value
}

const goToDetail = (id) => {
  router.push(`/student/activities/${id}`)
}

const goToBrowse = () => {
  router.push('/student/activities')
}

onMounted(() => {
  fetchSchedule()
  // 每秒钟更新一次时间
  timer = setInterval(() => {
    currentTime.value = dayjs().format('dddd, MMMM D, YYYY | HH:mm:ss')
  }, 1000)
})
//防止内存泄漏
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.student-dashboard {
  padding: 20px;
}

/* 新增的欢迎横幅样式 */
.welcome-banner {
  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.welcome-banner h2 { 
  margin: 0 0 8px 0; 
  font-weight: 600;
}
.welcome-banner p { 
  margin: 0; 
  opacity: 0.9; 
  font-size: 15px;
}
.time-display {
  margin-top: 12px;
  font-family: monospace; /* 用等宽字体显示时间更有科技感 */
  font-size: 16px;
  background: rgba(255, 255, 255, 0.2); /* 半透明背景 */
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.schedule-card {
  margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>