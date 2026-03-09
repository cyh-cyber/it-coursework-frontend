<template>
  <div class="teacher-dashboard">
    <div class="welcome-banner">
      <h2>Welcome to Teacher Portal, {{ username }}! 👨‍🏫</h2>
      <p>Manage your activities and track student participation.</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="shadow-sm">
          <div class="toolbar">
            <el-button type="primary" size="large" @click="goToCreate">
              ✨ Create New Activity
            </el-button>
          </div>
          
          <el-table :data="activities" style="width: 100%" stripe>
            <template #empty>
              <el-empty description="You haven't published any activities yet. Click the button above to start!" />
            </template>

            <el-table-column prop="title" label="Title" min-width="150" />
            <el-table-column prop="time" label="Time" width="160" :formatter="(row) => formatDate(row.time)" />
            <el-table-column prop="place" label="Place" min-width="120" />
            <el-table-column prop="category" label="Category" width="120">
              <template #default="{ row }">
                <el-tag size="small" :type="row.category === 'academic' ? 'primary' : (row.category === 'sports' ? 'success' : 'warning')">
                  {{ getCategoryLabel(row.category) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_active" label="Status" width="100">
              <template #default="{ row }">
                <el-tag :type="row.is_active ? 'success' : 'info'">{{ row.is_active ? 'Active' : 'Cancelled' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="220" fixed="right">
              <template #default="{ row }">
                <el-button size="small" plain type="primary" @click="viewParticipants(row.id)">Students</el-button>
                <el-button size="small" type="danger" plain @click="cancelActivity(row.id)" v-if="row.is_active">Cancel</el-button>
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

<style scoped>
.teacher-dashboard { padding: 20px; }
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.welcome-banner h2 { margin: 0 0 8px 0; font-weight: 600; }
.welcome-banner p { margin: 0; opacity: 0.9; font-size: 15px; }
.toolbar { margin-bottom: 20px; display: flex; justify-content: flex-end; }
.shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-radius: 8px;}
</style>