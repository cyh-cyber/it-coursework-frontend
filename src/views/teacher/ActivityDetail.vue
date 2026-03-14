<template>
  <div v-if="activity" class="activity-detail">
    <el-card shadow="hover">
      <el-descriptions
        :title="activity.title"
        :column="1"
        border
        class="mb-4"
      >
        <el-descriptions-item label="Time" label-align="right" align="left">
          <el-icon><Calendar /></el-icon> {{ formatDate(activity.time) }}
        </el-descriptions-item>
        <el-descriptions-item label="Place" label-align="right" align="left">
          <el-icon><Location /></el-icon> {{ activity.place }}
        </el-descriptions-item>
        <el-descriptions-item label="Category" label-align="right" align="left">
          <el-tag size="small">{{ getCategoryLabel(activity.category) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Teacher" label-align="right" align="left">
          {{ activity.teacher_name }}
        </el-descriptions-item>
        <el-descriptions-item label="Description" label-align="right" align="left">
          {{ activity.description }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="action-buttons">
        <el-button @click="goBack" size="large" plain>Back</el-button>
      </div>
    </el-card>

    <el-card style="margin-top: 20px;" shadow="hover">
      <h3>Comments ({{ comments.length }})</h3>
      <el-divider />
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <strong>{{ comment.user_name }}：</strong>
        <span>{{ comment.content }}</span>
        <div class="comment-time">{{ formatDate(comment.created_at) }}</div>
      </div>
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
.mb-4 {
  margin-bottom: 24px;
}
.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end; /* 让按钮整体靠右侧，更符合表单习惯 */
}
.comment-item {
  border-bottom: 1px solid #ebeef5; /* 使用Element Plus的标准边框色 */
  padding: 12px 0;
}
.comment-item:last-child {
  border-bottom: none; /* 最后一个评论不显示底边框 */
}
.comment-time {
  font-size: 12px;
  color: #909399; /* 使用Element Plus的标准次要文字色 */
  margin-top: 6px;
}
</style>