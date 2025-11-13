<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Анимированный фон с blob эффектами -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none" style="z-index: 0;">
      <!-- Большие плавающие blob элементы -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      <div class="absolute top-20 right-1/4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-6000"></div>
      <div class="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-8000"></div>
      
      <!-- Дополнительные световые эффекты -->
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10"></div>
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
    </div>

    <!-- Навигационное меню -->
    <nav class="bg-white/80 backdrop-blur-xl shadow-2xl sticky top-0 border-b border-purple-100/50 relative" style="z-index: 100; position: relative;">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center space-x-8">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <span class="text-2xl">👑</span>
              </div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Администратор
              </h1>
            </div>
            <div class="flex space-x-2 bg-gradient-to-r from-purple-100/50 to-indigo-100/50 p-1.5 rounded-xl backdrop-blur-sm border border-purple-200/50 shadow-inner">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 relative overflow-hidden group',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 transform scale-105'
                    : 'text-gray-700 hover:text-purple-700 hover:bg-white/80 hover:shadow-md'
                ]"
              >
                <span class="relative z-10">{{ tab.label }}</span>
                <span 
                  v-if="activeTab === tab.id"
                  class="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></span>
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {{ user?.full_name?.charAt(0) || 'А' }}
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

    <!-- Основной контент с вкладками -->
    <div class="container mx-auto px-4 py-8 relative" style="z-index: 10; position: relative; min-height: 60vh;">
      <!-- Отладочная информация (временно для диагностики) -->
      <div v-if="!user" class="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-sm">
        <p class="font-bold text-red-800">⚠️ Пользователь не загружен!</p>
        <p>Token: {{ authStore.token ? 'Есть' : 'Нет' }}</p>
        <p>Authenticated: {{ authStore.isAuthenticated }}</p>
        <button @click="router.push('/')" class="mt-2 px-4 py-2 bg-red-500 text-white rounded">Вернуться на страницу входа</button>
      </div>
      
      <transition name="page-transition" mode="out-in">
        <!-- Статистика (Dashboard) -->
        <DashboardTab
          v-if="activeTab === 'dashboard' && user"
          :user="user"
          @switch-tab="activeTab = $event"
          key="dashboard"
        />
        
        <!-- Сообщение о загрузке -->
        <div v-else-if="activeTab === 'dashboard' && !user" class="card animate-fade-in" style="z-index: 10; position: relative;">
          <div class="text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600 text-lg">Загрузка данных пользователя...</p>
          </div>
        </div>
        
        <!-- Загрузка студентов -->
        <StudentsManager
          v-else-if="activeTab === 'students'"
          key="students"
        />
        
        <!-- Загрузка тем -->
        <TopicsManager
          v-else-if="activeTab === 'topics'"
          key="topics"
        />
        
        <!-- Управление руководителями -->
        <SupervisorsManager
          v-else-if="activeTab === 'supervisors'"
          key="supervisors"
        />
        
        <!-- Распределение тем -->
        <DistributionManager
          v-else-if="activeTab === 'distribution'"
          key="distribution"
        />
        
        <!-- Экспорт -->
        <ExportManager
          v-else-if="activeTab === 'export'"
          key="export"
        />
        
        <!-- История изменений -->
        <HistoryManager
          v-else-if="activeTab === 'history'"
          key="history"
        />
        
        <!-- Fallback если ничего не выбрано -->
        <div v-else class="card animate-fade-in" style="z-index: 10; position: relative;">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Выберите вкладку</h2>
          <p class="text-gray-600">Используйте меню выше для навигации</p>
          <p class="text-sm text-gray-500 mt-2">Текущая вкладка: {{ activeTab }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import DashboardTab from '../components/admin/DashboardTab.vue';
import StudentsManager from '../components/admin/StudentsManager.vue';
import TopicsManager from '../components/admin/TopicsManager.vue';
import SupervisorsManager from '../components/admin/SupervisorsManager.vue';
import DistributionManager from '../components/admin/DistributionManager.vue';
import ExportManager from '../components/admin/ExportManager.vue';
import HistoryManager from '../components/admin/HistoryManager.vue';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const activeTab = ref('dashboard');

// Проверка авторизации при монтировании
onMounted(async () => {
  console.log('AdminView mounted');
  console.log('Auth state:', {
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
    user: authStore.user
  });
  
  if (!authStore.isAuthenticated || !authStore.user) {
    console.warn('Пользователь не авторизован, проверяем токен...');
    if (authStore.token) {
      const result = await authStore.checkAuth();
      if (!result.success) {
        console.warn('Токен невалиден, редирект на страницу входа');
        router.push('/');
        return;
      }
    } else {
      console.warn('Нет токена, редирект на страницу входа');
      router.push('/');
      return;
    }
  }
  
  console.log('Админ панель загружена, пользователь:', authStore.user);
  console.log('Active tab:', activeTab.value);
});

const tabs = [
  { id: 'dashboard', label: 'Главная' },
  { id: 'students', label: 'Загрузка студентов' },
  { id: 'topics', label: 'Загрузка тем' },
  { id: 'supervisors', label: 'Руководители' },
  { id: 'distribution', label: 'Распределение тем' },
  { id: 'export', label: 'Экспорт' },
  { id: 'history', label: 'История изменений' }
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
