<template>
  <el-container class="layout">
    <el-header>
      <el-menu mode="horizontal" :ellipsis="false">
        <el-menu-item index="1">Learning Activities System (Student)</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="2" @click="goToDashboard">Dashboard</el-menu-item>
        <el-menu-item index="3" @click="BrowseActivity">Browse Activity</el-menu-item>
        <el-menu-item index="4" @click="logout">Logout</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goToDashboard = () => router.push('/student/dashboard')
const BrowseActivity = () => router.push('/student/activities')
const logout = () => authStore.logout()
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
.flex-grow {
  flex-grow: 1;
}
</style>