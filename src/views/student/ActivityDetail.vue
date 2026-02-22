<template>
  <div v-if="activity" class="activity-detail">
    <el-card>
      <h2>{{ activity.title }}</h2>
      <p><el-icon><Calendar /></el-icon> Time: {{ formatDate(activity.time) }}</p>
      <p><el-icon><Location /></el-icon> Place: {{ activity.place }}</p>
      <p><el-icon><Collection /></el-icon> Category: {{ getCategoryLabel(activity.category) }}</p>
      <p>Description: {{ activity.description }}</p>
      <p>Posted by: {{ activity.teacher_name }}</p>
      <div class="action-buttons">
        <el-button v-if="activity.is_registered" type="danger" @click="handleCancel">Cancel Registration</el-button>
        <el-button v-else type="success" @click="handleRegister">Register Now</el-button>
        <el-button @click="goBack">Back</el-button>
      </div>
    </el-card>

    <el-card style="margin-top: 20px;">
      <h3>Comments ({{ comments.length }})</h3>
      <el-divider />
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <strong>{{ comment.user_name }}：</strong>
        <span>{{ comment.content }}</span>
        <div class="comment-time">{{ formatDate(comment.created_at) }}</div>
      </div>
      <el-divider />
      <el-input v-model="newComment" type="textarea" :rows="3" placeholder="Write your comment..." />
      <el-button type="primary" style="margin-top: 10px;" @click="submitComment">Post Comment</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar, Location, Collection } from '@element-plus/icons-vue'
import { getActivity, registerActivity, cancelRegistration, getComments, postComment } from '@/api/activities'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const activityId = route.params.id
const activity = ref(null)
const comments = ref([])
const newComment = ref('')

const fetchActivity = async () => {
  try {
    const res = await getActivity(activityId)
    activity.value = res.data
  } catch (error) {
    ElMessage.error('Failed to fetch activity details')
  }
}

const fetchComments = async () => {
  try {
    const res = await getComments(activityId)
    comments.value = res.data
  } catch (error) {
    ElMessage.error('Failed to fetch comments')
  }
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const getCategoryLabel = (value) => {
  const categories = {
    academic: 'Academic',
    sports: 'Sports',
    culture: 'Culture',
  }
  return categories[value] || value
}

const handleRegister = async () => {
  try {
    await registerActivity(activityId)
    ElMessage.success('Registration successful')
    fetchActivity() // Refresh activity status
  } catch (error) {
    ElMessage.error('Registration failed')
  }
}

const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('Are you sure you want to cancel registration?', 'Confirmation')
    await cancelRegistration(activityId)
    ElMessage.success('Registration cancelled')
    fetchActivity()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('Operation failed')
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('Please enter comment content')
    return
  }
  try {
    await postComment(activityId, newComment.value)
    ElMessage.success('Comment posted')
    newComment.value = ''
    fetchComments()
  } catch (error) {
    ElMessage.error('Failed to post comment')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchActivity()
  fetchComments()
})
</script>

<style scoped>
.activity-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.comment-item {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.comment-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>