<template>
  <div class="animate-fade-in">
    <!-- Заголовок -->
    <div class="mb-8 animate-slide-up">
      <h1 class="page-title">Экспорт данных</h1>
      <p class="page-subtitle">Экспорт данных в различных форматах с фильтрацией</p>
    </div>

    <div class="card animate-slide-up" style="animation-delay: 0.1s">
      <div class="section-header">
        <div class="section-icon bg-gradient-to-br from-orange-500 to-orange-600">
          <span class="text-3xl">📊</span>
        </div>
        <h2 class="section-title">Настройки экспорта</h2>
      </div>
      
      <div class="space-y-6">
        <!-- Тип экспорта -->
        <div>
          <label class="block text-gray-dark font-semibold mb-3 flex items-center space-x-2">
            <span>📋</span>
            <span>Тип экспорта:</span>
          </label>
          <div class="flex flex-wrap gap-3">
            <button
              @click="exportType = 'all'"
              class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              :class="exportType === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'bg-white text-gray-dark border-2 border-purple-300 hover:border-purple-500'"
            >
              <span>📄</span>
              <span>Полный список</span>
            </button>
            <button
              @click="exportType = 'free'"
              class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              :class="exportType === 'free'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'bg-white text-gray-dark border-2 border-purple-300 hover:border-purple-500'"
            >
              <span>📝</span>
              <span>Свободные темы</span>
            </button>
          </div>
        </div>

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
            <button
              @click="exportFormat = 'pdf'"
              class="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              :class="exportFormat === 'pdf'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                : 'bg-white text-gray-dark border-2 border-green-300 hover:border-green-500'"
            >
              <span>📕</span>
              <span>PDF</span>
            </button>
          </div>
        </div>

        <!-- Фильтры -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-gray-dark font-medium mb-2">По группе:</label>
            <el-select
              v-model="filters.group"
              clearable
              placeholder="Выберите группу"
              class="w-full"
            >
              <el-option
                v-for="group in filterOptions.groups"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </div>
          <div>
            <label class="block text-gray-dark font-medium mb-2">По руководителю:</label>
            <el-select
              v-model="filters.supervisor"
              clearable
              placeholder="Выберите руководителя"
              class="w-full"
            >
              <el-option
                v-for="supervisor in filterOptions.supervisors"
                :key="supervisor"
                :label="supervisor"
                :value="supervisor"
              />
            </el-select>
          </div>
          <div>
            <label class="block text-gray-dark font-medium mb-2">По ЦМК:</label>
            <el-select
              v-model="filters.cmk"
              clearable
              placeholder="Выберите ЦМК"
              class="w-full"
            >
              <el-option
                v-for="cmk in filterOptions.cmks"
                :key="cmk"
                :label="cmk"
                :value="cmk"
              />
            </el-select>
          </div>
        </div>

        <!-- Кнопка экспорта -->
        <div class="pt-4 border-t border-gray-200">
          <button
            @click="exportData"
            :disabled="exporting"
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../api/axios';

const exportType = ref('all');
const exportFormat = ref('xlsx');
const exporting = ref(false);
const filters = ref({
  group: '',
  supervisor: '',
  cmk: ''
});
const filterOptions = ref({
  groups: [],
  supervisors: [],
  cmks: []
});

onMounted(() => {
  loadFilterOptions();
});

const loadFilterOptions = async () => {
  try {
    const response = await api.get('/export/filters');
    filterOptions.value = response.data || { groups: [], supervisors: [], cmks: [] };
  } catch (error) {
    console.error('Ошибка загрузки фильтров:', error);
    // Загружаем из данных, которые уже есть
    loadFiltersFromData();
  }
};

const loadFiltersFromData = async () => {
  try {
    const [studentsRes, topicsRes, supervisorsRes] = await Promise.all([
      api.get('/admin/students').catch(() => ({ data: [] })),
      api.get('/admin/topics').catch(() => ({ data: [] })),
      api.get('/admin/supervisors').catch(() => ({ data: [] }))
    ]);
    const groups = [...new Set((studentsRes.data || []).map(s => s.group_name).filter(Boolean))].sort();
    const supervisors = (supervisorsRes.data || []).map(s => s.full_name).sort();
    const cmks = [...new Set((topicsRes.data || []).map(t => t.cmk).filter(Boolean))].sort();
    filterOptions.value = { groups, supervisors, cmks };
  } catch (error) {
    console.error('Ошибка загрузки фильтров из данных:', error);
  }
};

const exportData = async () => {
  exporting.value = true;

  try {
    const params = new URLSearchParams();
    if (filters.value.group) params.append('group', filters.value.group);
    if (filters.value.supervisor) params.append('supervisor', filters.value.supervisor);
    if (filters.value.cmk) params.append('cmk', filters.value.cmk);
    
    let url = '';
    if (exportFormat.value === 'pdf') {
      url = `/export/pdf${params.toString() ? '?' + params.toString() : ''}`;
    } else {
      url = exportType.value === 'free' 
        ? `/export/csv/free${params.toString() ? '?' + params.toString() : ''}`
        : `/export/csv${params.toString() ? '?' + params.toString() : ''}`;
    }

    const response = await api.get(url, {
      responseType: 'blob'
    });

    // Создание ссылки для скачивания
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `export_${Date.now()}.${exportFormat.value}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    ElMessage.success('Экспорт выполнен успешно');
  } catch (error) {
    ElMessage.error('Ошибка экспорта');
  } finally {
    exporting.value = false;
  }
};
</script>
