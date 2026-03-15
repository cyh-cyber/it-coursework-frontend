import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',  // 通过代理转发，避免跨域
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 关键：允许携带 cookies
})


export default apiClient