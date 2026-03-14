<template>
  <el-row justify="center" align="middle" class="login-container">
    <el-col :span="8">
      <el-card class="login-card">
        <h2>Learning Activity Management System</h2>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
          <el-form-item label="Username" prop="username">
            <el-input v-model="form.username" placeholder="Enter username" />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="form.password" type="password" placeholder="Enter password" @keyup.enter="handleLogin" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading">Login</el-button>
          </el-form-item>
          <el-form-item>
            <span>Don't have an account? <el-link type="primary" @click="goToRegister">Register</el-link></span>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: 'Please enter username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
}

const handleLogin = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    await authStore.login(form)
    ElMessage.success('Login successful')
  } catch (error) {
    ElMessage.error('Login failed, please check username or password')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background-color: #f5f7fa;
}
.login-card {
  padding: 20px;
}
</style>