<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Анимированный фон с blob эффектами -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Большие плавающие blob элементы -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      <div class="absolute top-20 right-1/4 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-6000"></div>
      <div class="absolute bottom-20 left-1/4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-8000"></div>
      
      <!-- Дополнительные световые эффекты -->
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10"></div>
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-500/10 to-transparent"></div>
    </div>

    <!-- Навигационное меню -->
    <nav class="bg-white/80 backdrop-blur-xl shadow-2xl sticky top-0 z-50 border-b border-blue-100/50 relative">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center space-x-8">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <span class="text-2xl">⭐</span>
              </div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
                Староста
              </h1>
            </div>
            <div class="flex space-x-2 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 p-1.5 rounded-xl backdrop-blur-sm border border-blue-200/50 shadow-inner">
              <router-link
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                :class="[
                  'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 relative overflow-hidden group',
                  $route.path.includes(item.path)
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50 transform scale-105'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-white/80 hover:shadow-md'
                ]"
              >
                <span class="relative z-10">{{ item.label }}</span>
                <span 
                  v-if="$route.path.includes(item.path)"
                  class="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></span>
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {{ user?.full_name?.charAt(0) || 'С' }}
              </div>
              <span class="text-gray-800 font-semibold">{{ user?.full_name }}</span>
            </div>
            <button
              @click="handleLogout"
              class="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md font-semibold"
            >
              Выход
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Основной контент -->
    <div class="container mx-auto px-4 py-8 relative" style="z-index: 10;">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);

const menuItems = [
  { path: '/starosta/topics', label: 'Просмотр тем' },
  { path: '/starosta/distribution', label: 'Распределение тем' },
  { path: '/starosta/export', label: 'Экспорт' }
];

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(50px, -80px) scale(1.15) rotate(90deg);
  }
  50% {
    transform: translate(-40px, 40px) scale(0.95) rotate(180deg);
  }
  75% {
    transform: translate(30px, 60px) scale(1.05) rotate(270deg);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-6000 {
  animation-delay: 6s;
}

.animation-delay-8000 {
  animation-delay: 8s;
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s linear infinite;
}
</style>
