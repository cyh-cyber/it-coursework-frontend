<template>
  <el-row justify="center" align="middle" class="register-container">
    <el-col :span="8" :xs="22" :sm="16" :md="12" :lg="8">
      <el-card class="register-card" role="region" aria-label="Account registration area">
        <h2 tabindex="0">Create Account</h2>
        
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          
          <el-form-item label="Username" prop="username">
            <el-input 
              v-model="form.username" 
              placeholder="Enter username" 
              id="regUsername"
              aria-required="true"
              aria-label="Please enter your username"
            />
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input 
              v-model="form.email" 
              placeholder="Enter email (optional)" 
              id="regEmail"
              aria-label="Please enter your email address, optional"
            />
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="Enter password" 
              id="regPassword"
              aria-required="true"
              aria-label="Please enter your password"
            />
          </el-form-item>

          <el-form-item label="Confirm" prop="password2">
            <el-input 
              v-model="form.password2" 
              type="password" 
              placeholder="Confirm password" 
              id="regConfirmPassword"
              aria-required="true"
              aria-label="Please confirm your password"
            />
          </el-form-item>

          <el-form-item label="Role" prop="role">
            <el-radio-group v-model="form.role" aria-label="Please select your role">
              <el-radio value="student" aria-label="Register as a student">Student</el-radio>
              <el-radio value="teacher" aria-label="Register as a teacher">Teacher</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleRegister" 
              :loading="loading"
              aria-label="Submit registration"
            >
              Register
            </el-button>
          </el-form-item>

          <el-form-item>
            <span>Already have an account? 
              <el-link 
                type="primary" 
                @click="router.push('/login')"
                aria-label="Return to login page"
              >
                Login
              </el-link>
            </span>
          </el-form-item>

        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/auth'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  password2: '',
  role: 'student', // student by default
})

const validatePass2 = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('Passwords do not match'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ required: true, message: 'Please enter username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
  password2: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ],
  role: [{ required: true, message: 'Please select role', trigger: 'change' }],
  email: [{ type: 'email', message: 'Please enter valid email', trigger: 'blur' }]
}

const handleRegister = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    await register(form)
    ElMessage.success('Registration successful, please login')
    router.push('/login')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  background-color: #f5f7fa;
}
.register-card {
  padding: 20px;
}
</style>