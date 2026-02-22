<template>
  <div class="create-activity">
    <h2>Create New Activity</h2>
    <el-card>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="Time" prop="time">
          <el-date-picker v-model="form.time" type="datetime" placeholder="Select date and time" format="YYYY-MM-DD HH:mm" />
        </el-form-item>
        <el-form-item label="Place" prop="place">
          <el-input v-model="form.place" />
        </el-form-item>
        <el-form-item label="Category" prop="category">
          <el-select v-model="form.category" placeholder="Select">
            <el-option label="Academic" value="academic" />
            <el-option label="Sports" value="sports" />
            <el-option label="Culture" value="culture" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">Publish</el-button>
          <el-button @click="router.back()">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
.create-activity {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}
</style>