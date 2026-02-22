import apiClient from './client'

export const getActivities = (params: any) => {
  return apiClient.get('/activities/', { params })  // 筛选参数
}

export const getActivity = (id: any) => {
  return apiClient.get(`/activities/${id}/`)
}

export const createActivity = (data: any) => {
  return apiClient.post('/activities/create/', data)
}

export const cancelActivity = (id: any) => {
  return apiClient.post(`/activities/${id}/cancel/`)
}

export const registerActivity = (id: any) => {
  return apiClient.post(`/activities/${id}/register/`)
}

export const cancelRegistration = (id: any) => {
  return apiClient.post(`/activities/${id}/cancel-registration/`)
}

export const getParticipants = (id: any) => {
  return apiClient.get(`/activities/${id}/participants/`)
}

export const sendReminder = (id: any) => {
  return apiClient.post(`/activities/${id}/remind/`)
}

export const getComments = (id: any) => {
  return apiClient.get(`/activities/${id}/comments/`)
}

export const postComment = (id: any, content: any) => {
  return apiClient.post(`/activities/${id}/comments/`, { content })
}

export const getMySchedule = () => {
  return apiClient.get('/student/schedule/')
}