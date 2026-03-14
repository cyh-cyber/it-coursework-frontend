<template>
  <div class="activity-list">
    <div class="page-header">
      <h2>All Activities</h2>
      <p class="text-muted">Explore and register for upcoming campus events</p>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" :md="6" :lg="6">
        <el-card class="filter-card shadow-sm">
          <h3><el-icon><Filter /></el-icon> Filters</h3>
          <el-divider />
          <el-form label-position="top">
            <el-form-item label="Category">
              <el-select v-model="filters.category" placeholder="All Categories" clearable class="w-100">
                <el-option v-for="cat in categories" :key="cat.value" :label="cat.label" :value="cat.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Date from">
              <el-date-picker v-model="filters.date_from" type="date" placeholder="Select date" format="YYYY-MM-DD" class="w-100" />
            </el-form-item>
            <el-form-item class="filter-actions">
              <el-button type="primary" @click="applyFilters" class="w-100 mb-2">Apply Filters</el-button>
              <el-button @click="resetFilters" class="w-100 mx-0">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="16" :md="18" :lg="18">
        <el-empty v-if="activities.length === 0" description="No activities found matching your criteria" />
        
        <el-row :gutter="20" v-else>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" v-for="activity in activities" :key="activity.id">
            <el-card class="activity-card shadow-hover" :body-style="{ padding: '0px' }">
              <div class="card-image-placeholder">
                <el-tag :type="activity.category === 'academic' ? 'primary' : (activity.category === 'sports' ? 'success' : 'warning')" class="category-tag">
                  {{ getCategoryLabel(activity.category) }}
                </el-tag>
              </div>
              <div class="card-content">
                <h3 class="activity-title" :title="activity.title">{{ activity.title }}</h3>
                <p class="activity-info"><el-icon><Calendar /></el-icon> {{ formatDate(activity.time) }}</p>
                <p class="activity-info"><el-icon><Location /></el-icon> {{ activity.place }}</p>
                
                <el-divider border-style="dashed" />
                
                <div class="card-footer">
                  <el-button plain size="small" @click="goToDetail(activity.id)">Details</el-button>
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
  router.push(`/teacher/activities/${id}`)
}


onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
/* 增加一些高级感 CSS */
.activity-list {
  padding: 20px;
}
.page-header {
  margin-bottom: 24px;
}
.text-muted {
  color: #6c757d;
  font-size: 14px;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.shadow-hover {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.shadow-hover:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.w-100 {
  width: 100%;
}
.filter-actions {
  display: flex;
  flex-direction: column;
}
.mb-2 { margin-bottom: 10px; }
.mx-0 { margin-left: 0 !important; }

/* 卡片美化 */
.card-image-placeholder {
  height: 100px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}
.category-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}
.card-content {
  padding: 16px;
}
.activity-title {
  font-size: 16px;
  margin: 0 0 12px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.activity-info {
  margin: 6px 0;
  color: #555;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>