<template>
  <div class="participants">
    <h2>Participants for "{{ activityTitle }}"</h2>
    <el-card>
      <el-table :data="participants" style="width: 100%">
        <el-table-column prop="student__username" label="Username" />
        <el-table-column prop="student__email" label="Email" />
        <el-table-column prop="registered_at" label="Registered At" :formatter="(row) => formatDate(row.registered_at)" />
      </el-table>
      <div style="margin-top: 20px;">
        <el-button @click="router.back()">Back</el-button>
      </div>
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
.participants {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
</style>