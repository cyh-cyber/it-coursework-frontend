<template>
  <div class="student-dashboard">
    <h2><h2>Welcome, {{ username }}!</h2></h2>
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
import { ref, onMounted, computed} from 'vue'
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
})
</script>

<style scoped>
.student-dashboard {
  padding: 20px;
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