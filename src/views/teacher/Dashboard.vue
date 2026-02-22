<template>
  <div class="teacher-dashboard">
    <h2>Welcome, {{ username }}!</h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div style="margin-bottom: 20px;">
            <el-button type="primary" @click="goToCreate">Create New Activity</el-button>
          </div>
          <el-table :data="activities" style="width: 100%">
            <el-table-column prop="title" label="Title" />
            <el-table-column prop="time" label="Time" :formatter="(row) => formatDate(row.time)" />
            <el-table-column prop="place" label="Place" />
            <el-table-column prop="category" label="Category" :formatter="(row) => getCategoryLabel(row.category)" />
            <el-table-column prop="is_active" label="Status">
              <template #default="{ row }">
                <el-tag :type="row.is_active ? 'success' : 'info'">{{ row.is_active ? 'Active' : 'Cancelled' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="viewParticipants(row.id)">View Students</el-button>
                <el-button size="small" type="danger" @click="cancelActivity(row.id)" v-if="row.is_active">Cancel</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { getActivities, cancelActivity as cancel } from '@/api/activities'
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()
const activities = ref([])
const username = computed(() => authStore.user?.username || 'User')

const fetchActivities = async () => {
  try {
    // 假设后端支持参数 created_by_me=true 获取当前教师发布的活动
    const res = await getActivities({ created_by_me: true })
    activities.value = res.data
  } catch (error) {
    ElMessage.error('Failed to fetch activities')
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

const goToCreate = () => {
  router.push('/teacher/activities/create')
}

const viewParticipants = (id) => {
  router.push(`/teacher/activities/${id}/participants`)
}

const cancelActivity = async (id) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to cancel this activity? Students will no longer be able to register.', 'Confirmation')
    await cancel(id)
    ElMessage.success('Activity cancelled')
    fetchActivities()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('Operation failed')
  }
}

onMounted(() => {
  fetchActivities()
})
</script>