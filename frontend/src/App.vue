<template>
  <router-view v-slot="{ Component, route }">
    <transition name="page-transition" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  // Проверка токена при загрузке приложения
  const token = localStorage.getItem('token');
  if (token) {
    const result = await authStore.checkAuth();
    // Если пользователь авторизован и находится на странице авторизации, редиректим
    if (result.success && authStore.user && window.location.pathname === '/') {
      if (authStore.user.role === 'admin') {
        router.push('/admin');
      } else if (authStore.user.role === 'starosta') {
        router.push('/starosta/topics');
      }
    }
  }
});
</script>

<style scoped>
</style>
