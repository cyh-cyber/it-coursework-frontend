<template>
  <div class="create-activity">
    <el-row justify="center">
      <el-col :xs="24" :sm="20" :md="16" :lg="12">
        <el-card class="form-card shadow-hover">
          <template #header>
            <div class="card-header">
              <h3>📝 Publish New Activity</h3>
              <span class="text-muted">Fill in the details below</span>
            </div>
          </template>
          
          <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" label-position="top">
            <el-form-item label="Activity Title" prop="title">
              <el-input v-model="form.title" placeholder="e.g., Python Workshop" size="large" />
            </el-form-item>
            
            <el-form-item label="Description" prop="description">
              <el-input v-model="form.description" type="textarea" :rows="4" placeholder="Describe the activity..." />
            </el-form-item>
            
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Time" prop="time">
                  <el-date-picker v-model="form.time" type="datetime" placeholder="Select date and time" format="YYYY-MM-DD HH:mm" class="w-100" size="large" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="Category" prop="category">
                  <el-select v-model="form.category" placeholder="Select category" class="w-100" size="large">
                    <el-option label="Academic" value="academic" />
                    <el-option label="Sports" value="sports" />
                    <el-option label="Culture" value="culture" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="Place (Location)" prop="place">
              <el-input v-model="form.place" placeholder="e.g., Room 402, Building A" size="large" />
            </el-form-item>
            
            <el-divider />
            
            <el-form-item class="form-actions">
              <el-button @click="router.back()" size="large">Cancel</el-button>
              <el-button type="primary" @click="submitForm" :loading="submitting" size="large">🚀 Publish Activity</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createActivity } from '@/api/activities'
import dayjs from 'dayjs'

const router = useRouter()
const formRef = ref()
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  time: '',
  place: '',
  category: '',
})

const rules = {
  title: [{ required: true, message: 'Please enter title', trigger: 'blur' }],
  description: [{ required: true, message: 'Please enter description', trigger: 'blur' }],
  time: [{ required: true, message: 'Please select time', trigger: 'change' }],
  place: [{ required: true, message: 'Please enter place', trigger: 'blur' }],
  category: [{ required: true, message: 'Please select category', trigger: 'change' }],
}

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    // Format time
    const data = {
      ...form,
      time: dayjs(form.time).format('YYYY-MM-DD HH:mm:ss'),
    }
    await createActivity(data)
    ElMessage.success('Activity published successfully')
    router.push('/teacher/dashboard')
  } catch (error) {
    ElMessage.error('Failed to publish')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.create-activity { padding: 20px; }
.form-card { border-radius: 12px; }
.card-header { display: flex; flex-direction: column; }
.card-header h3 { margin: 0 0 5px 0; color: #303133; }
.text-muted { color: #909399; font-size: 13px; }
.w-100 { width: 100%; }
.form-actions { display: flex; justify-content: flex-end; margin-bottom: 0; }
.shadow-hover { transition: box-shadow 0.3s ease; }
.shadow-hover:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
</style>