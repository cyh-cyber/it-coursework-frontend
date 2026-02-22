import apiClient from './client'

export const login = (username: any, password: any) => {
  return apiClient.post('/login/', { username, password })
}

export const logout = () => {
  return apiClient.post('/logout/')
}

export const register = (userData: { username: string; email: string; password: string; password2: string; role: string }) => {
  return apiClient.post('/register/', userData)
}