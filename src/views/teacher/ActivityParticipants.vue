<template>
  <div class="participants-container">
    <div class="page-header">
      <el-button plain @click="router.back()" size="small" class="back-btn">← Back to Dashboard</el-button>
      <h2>👥 Participants List</h2>
      <p class="text-muted">Activity: <strong class="highlight-text">{{ activityTitle }}</strong></p>
    </div>
    
    <el-card class="shadow-sm">
      <el-table :data="participants" style="width: 100%" stripe>
        <template #empty>
          <el-empty description="No students have registered for this activity yet." />
        </template>
        
        <el-table-column type="index" width="60" />
        <el-table-column prop="student__username" label="Username" min-width="120">
          <template #default="{ row }">
            <strong>{{ row.student__username }}</strong>
          </template>
        </el-table-column>
        <el-table-column prop="student__email" label="Email" min-width="180" />
        <el-table-column prop="registered_at" label="Registration Time" width="180">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ formatDate(row.registered_at) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getParticipants } from '@/api/activities'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const activityId = route.params.id
const participants = ref([])
const activityTitle = ref('')

const fetchParticipants = async () => {
  try {
    const res = await getParticipants(activityId)
    participants.value = res.data.participants
    activityTitle.value = res.data.activity_title
  } catch (error) {
    ElMessage.error('Failed to fetch participants')
  }
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  fetchParticipants()
})
</script>

<style scoped>
.participants-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}
.page-header { margin-bottom: 24px; position: relative; }
.back-btn { margin-bottom: 15px; }
.page-header h2 { margin: 0 0 8px 0; color: #303133; }
.text-muted { color: #606266; font-size: 15px; margin: 0; }
.highlight-text { color: #409EFF; font-size: 16px; }
.shadow-sm { box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05); border-radius: 8px; }
</style>