<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-dark mb-2">Панель администратора</h1>
      <p class="text-gray-600">Добро пожаловать, {{ user?.full_name }}!</p>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Всего студентов</p>
            <p class="text-3xl font-bold text-blue-600">{{ stats.students?.total || 0 }}</p>
          </div>
          <div class="text-4xl text-blue-300">👥</div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Всего тем</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.topics?.total || 0 }}</p>
          </div>
          <div class="text-4xl text-green-300">📚</div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Свободных тем</p>
            <p class="text-3xl font-bold text-purple-600">{{ stats.topics?.free || 0 }}</p>
          </div>
          <div class="text-4xl text-purple-300">📝</div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Занятых тем</p>
            <p class="text-3xl font-bold text-orange-600">{{ stats.topics?.occupied || 0 }}</p>
          </div>
          <div class="text-4xl text-orange-300">✅</div>
        </div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <router-link
        to="/admin/students"
        class="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        <div class="flex items-center space-x-4">
          <div class="p-4 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <span class="text-3xl">👤</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-dark mb-1">Загрузка студентов</h3>
            <p class="text-sm text-gray-600">Загрузите или отредактируйте данные студентов</p>
          </div>
        </div>
      </router-link>

      <router-link
        to="/admin/topics"
        class="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        <div class="flex items-center space-x-4">
          <div class="p-4 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
            <span class="text-3xl">📖</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-dark mb-1">Загрузка тем</h3>
            <p class="text-sm text-gray-600">Управление темами курсовых и дипломных работ</p>
          </div>
        </div>
      </router-link>

      <router-link
        to="/admin/distribution"
        class="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        <div class="flex items-center space-x-4">
          <div class="p-4 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
            <span class="text-3xl">🎯</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-dark mb-1">Распределение тем</h3>
            <p class="text-sm text-gray-600">Автоматическое или ручное распределение тем</p>
          </div>
        </div>
      </router-link>

      <router-link
        to="/admin/export"
        class="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        <div class="flex items-center space-x-4">
          <div class="p-4 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
            <span class="text-3xl">📊</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-dark mb-1">Экспорт данных</h3>
            <p class="text-sm text-gray-600">Экспорт данных в Excel, CSV или PDF</p>
          </div>
        </div>
      </router-link>

      <router-link
        to="/admin/history"
        class="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        <div class="flex items-center space-x-4">
          <div class="p-4 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
            <span class="text-3xl">📜</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-dark mb-1">История изменений</h3>
            <p class="text-sm text-gray-600">Просмотр истории всех изменений в системе</p>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Последние изменения -->
    <div class="card">
      <h2 class="text-2xl font-bold text-gray-dark mb-4">Последние изменения</h2>
      <div v-if="recentHistory.length > 0" class="space-y-4">
        <div
          v-for="item in recentHistory"
          :key="item.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div
              :class="{
                'p-2 rounded-full': true,
                'bg-blue-100': item.entity_type === 'student',
                'bg-green-100': item.entity_type === 'topic',
                'bg-purple-100': item.entity_type === 'distribution'
              }"
            >
              <span class="text-xl">
                {{ item.entity_type === 'student' ? '👤' : item.entity_type === 'topic' ? '📚' : '🎯' }}
              </span>
            </div>
            <div>
              <p class="font-semibold text-gray-dark">{{ item.action }}</p>
              <p class="text-sm text-gray-600">
                {{ item.user_name }} • {{ new Date(item.created_at).toLocaleString('ru-RU') }}
              </p>
            </div>
          </div>
          <span
            :class="{
              'px-3 py-1 rounded-full text-xs font-semibold': true,
              'bg-purple-100 text-purple-800': item.user_role === 'admin',
              'bg-blue-100 text-blue-800': item.user_role === 'starosta'
            }"
          >
            {{ item.user_role === 'admin' ? 'Админ' : 'Староста' }}
          </span>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        Нет последних изменений
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { ElMessage } from 'element-plus';
import api from '../../api/axios';

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const stats = ref({});
const history = ref([]);

const recentHistory = computed(() => {
  return history.value.slice(0, 5);
});

onMounted(() => {
  loadStats();
  loadHistory();
});

const loadStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    stats.value = response.data || {
      students: { total: 0 },
      topics: { total: 0, free: 0, occupied: 0, reserved: 0 }
    };
  } catch (error) {
    ElMessage.error('Ошибка загрузки статистики');
  }
};

const loadHistory = async () => {
  try {
    const response = await api.get('/admin/history');
    history.value = response.data.slice(0, 10);
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
  }
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-md p-6;
}
</style>

