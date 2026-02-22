<template>
  <div class="activity-list">
    <h2>All Activities</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="filter-card">
          <h3>Filters</h3>
          <el-form label-width="80px">
            <el-form-item label="Category">
              <el-select v-model="filters.category" placeholder="All" clearable>
                <el-option v-for="cat in categories" :key="cat.value" :label="cat.label" :value="cat.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Date from">
              <el-date-picker v-model="filters.date_from" type="date" placeholder="Select date" format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="applyFilters">Filter</el-button>
              <el-button @click="resetFilters">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-row :gutter="20">
          <el-col :span="8" v-for="activity in activities" :key="activity.id">
            <el-card class="activity-card" :body-style="{ padding: '0px' }">
              <div style="padding: 14px">
                <h3>{{ activity.title }}</h3>
                <p><el-icon><Calendar /></el-icon> {{ formatDate(activity.time) }}</p>
                <p><el-icon><Location /></el-icon> {{ activity.place }}</p>
                <p><el-icon><Collection /></el-icon> {{ getCategoryLabel(activity.category) }}</p>
                <div class="card-footer">
                  <el-button type="primary" size="small" @click="goToDetail(activity.id)">View Details</el-button>
                  <el-button v-if="activity.is_registered" type="danger" size="small" @click="cancelRegistration(activity.id)">Cancel Registration</el-button>
                  <el-button v-else type="success" size="small" @click="register(activity.id)">Register Now</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar, Location, Collection } from '@element-plus/icons-vue'
import { getActivities, registerActivity, cancelRegistration as cancel } from '@/api/activities'
import dayjs from 'dayjs'

const router = useRouter()
const activities = ref([])
const categories = [
  { value: 'academic', label: 'Academic' },
  { value: 'sports', label: 'Sports' },
  { value: 'culture', label: 'Culture' },
]

const filters = reactive({
  category: '',
  date_from: '',
})

const fetchActivities = async () => {
  try {
    const params = {}
    if (filters.category) params.category = filters.category
    if (filters.date_from) params.date_from = dayjs(filters.date_from).format('YYYY-MM-DD')
    const res = await getActivities(params)
    activities.value = res.data
  } catch (error) {
    ElMessage.error('Failed to fetch activities')
  }
}

const applyFilters = () => {
  fetchActivities()
}

const resetFilters = () => {
  filters.category = ''
  filters.date_from = ''
  fetchActivities()
}

const getCategoryLabel = (value) => {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.label : value
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const goToDetail = (id) => {
  router.push(`/student/activities/${id}`)
}

const register = async (id) => {
  try {
    await registerActivity(id)
    ElMessage.success('Registration successful')
    fetchActivities() // Refresh list
  } catch (error) {
    ElMessage.error('Registration failed')
  }
}

const cancelRegistration = async (id) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to cancel registration?', 'Confirmation')
    await cancel(id)
    ElMessage.success('Registration cancelled')
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
.activity-list {
  padding: 20px;
}
.filter-card {
  margin-bottom: 20px;
}
.activity-card {
  margin-bottom: 20px;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>