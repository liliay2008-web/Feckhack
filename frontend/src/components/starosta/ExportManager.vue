<template>
  <div class="animate-fade-in">
    <!-- Заголовок -->
    <div class="mb-8 animate-slide-up">
      <h1 class="text-4xl font-bold gradient-text mb-2">Экспорт данных</h1>
      <p class="text-gray-600">Экспортируйте список назначенных тем для вашей группы</p>
    </div>

    <div class="card card-hover animate-slide-up" style="animation-delay: 0.1s">
      <div class="flex items-center space-x-3 mb-6">
        <div class="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
          <span class="text-3xl">📊</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-dark">Настройки экспорта</h2>
      </div>
      
      <div class="space-y-6">
        <!-- Формат экспорта -->
        <div>
          <label class="block text-gray-dark font-semibold mb-3 flex items-center space-x-2">
            <span>💾</span>
            <span>Формат:</span>
          </label>
          <div class="flex flex-wrap gap-3">
            <button
              @click="exportFormat = 'xlsx'"
              class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              :class="exportFormat === 'xlsx'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'bg-white text-gray-dark border-2 border-green-300 hover:border-green-500'"
            >
              <span>📗</span>
              <span>Excel</span>
            </button>
            <button
              @click="exportFormat = 'csv'"
              class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              :class="exportFormat === 'csv'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'bg-white text-gray-dark border-2 border-green-300 hover:border-green-500'"
            >
              <span>📄</span>
              <span>CSV</span>
            </button>
          </div>
        </div>

        <!-- Информация о группах -->
        <div v-if="userGroups.length > 0" class="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p class="text-sm font-semibold text-blue-900 mb-2">Ваши группы:</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="group in userGroups" 
              :key="group"
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
            >
              {{ group }}
            </span>
          </div>
        </div>

        <!-- Кнопка экспорта -->
        <div class="pt-4 border-t border-gray-200">
          <button
            @click="exportData"
            :disabled="exporting || userGroups.length === 0"
            class="w-full btn-primary flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="exporting" class="loading-spinner"></span>
            <span v-else class="text-2xl">💾</span>
            <span>{{ exporting ? 'Экспорт...' : 'Экспортировать данные' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import api from '../../api/axios';

const authStore = useAuthStore();
const exportFormat = ref('xlsx');
const exporting = ref(false);

const userGroups = computed(() => {
  return authStore.user?.groups || [];
});

const exportData = async () => {
  exporting.value = true;

  try {
    if (userGroups.value.length === 0) {
      ElMessage.warning('У вас нет назначенных групп');
      exporting.value = false;
      return;
    }

    // Экспорт для каждой группы
    for (const group of userGroups.value) {
      const params = new URLSearchParams({
        type: 'all',
        format: exportFormat.value,
        group: group
      });

      const response = await api.get(`/export/excel?${params.toString()}`, {
        responseType: 'blob'
      });

      // Создание ссылки для скачивания
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${group}_${Date.now()}.${exportFormat.value}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    ElMessage.success('Экспорт выполнен успешно');
  } catch (error) {
    ElMessage.error('Ошибка экспорта');
  } finally {
    exporting.value = false;
  }
};
</script>
