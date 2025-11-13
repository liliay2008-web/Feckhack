<template>
  <div class="animate-fade-in">
    <!-- Заголовок -->
    <div class="mb-8 animate-slide-up">
      <h1 class="page-title">Управление руководителями</h1>
      <p class="page-subtitle">Загрузите справочник дипломных руководителей из файла или добавьте вручную</p>
    </div>

    <!-- Карточка загрузки файла -->
    <div class="card mb-6 animate-slide-up" style="animation-delay: 0.1s">
      <div class="section-header">
        <div class="section-icon bg-gradient-to-br from-purple-500 to-purple-600">
          <span class="text-3xl">📤</span>
        </div>
        <h2 class="section-title">Загрузка справочника</h2>
      </div>
      
      <div class="space-y-4">
        <div class="relative">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept=".xlsx,.xls,.csv"
            class="hidden"
            id="supervisor-file-input"
          />
          <label
            for="supervisor-file-input"
            class="inline-flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <span class="text-xl">📁</span>
            <span>Выбрать файл (Excel/CSV)</span>
          </label>
        </div>

        <div v-if="selectedFile" class="p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-bounce-in">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">📄</span>
              <div>
                <p class="font-semibold text-gray-900">{{ selectedFile.name }}</p>
                <p class="text-sm text-gray-600">Размер: {{ formatFileSize(selectedFile.size) }}</p>
              </div>
            </div>
            <button
              @click="selectedFile = null"
              class="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <button
          @click="uploadFile"
          :disabled="!selectedFile || uploading"
          class="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="uploading" class="loading-spinner"></span>
          <span v-else class="text-xl">🚀</span>
          <span>{{ uploading ? 'Загрузка...' : 'Загрузить руководителей' }}</span>
        </button>
      </div>
    </div>

    <!-- Добавление нового руководителя -->
    <div class="card mb-6 card-hover animate-slide-up" style="animation-delay: 0.15s">
      <div class="flex items-center space-x-3 mb-6">
        <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <span class="text-3xl">➕</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-dark">Добавить руководителя</h2>
      </div>
      
      <div class="flex space-x-3">
        <input
          v-model="newSupervisorName"
          type="text"
          class="input-field flex-1"
          placeholder="Введите ФИО руководителя"
          @keyup.enter="addSupervisor"
        />
        <button
          @click="addSupervisor"
          :disabled="!newSupervisorName.trim() || adding"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
        >
          <span>✓</span>
          <span>Добавить</span>
        </button>
      </div>
    </div>

    <!-- Таблица руководителей -->
    <div class="card animate-slide-up" style="animation-delay: 0.2s">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <span class="text-2xl">👨‍🏫</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-dark">Список руководителей</h2>
            <p class="text-sm text-gray-500">Всего: {{ supervisors.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
        <table class="supervisors-table min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <tr>
              <th style="width: 80px; text-align: left; padding: 16px 24px;">ID</th>
              <th style="text-align: left; padding: 16px 24px;">ФИО</th>
              <th style="width: 200px; text-align: left; padding: 16px 24px;">Дата добавления</th>
              <th style="width: 200px; text-align: left; padding: 16px 24px;">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr 
              v-for="(supervisor, index) in supervisors" 
              :key="supervisor.id" 
              class="hover:bg-purple-50 transition-all duration-300 table-row"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td style="width: 80px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="font-bold text-purple-600">#{{ supervisor.id }}</span>
              </td>
              <td style="text-align: left; padding: 16px 24px; vertical-align: top;">
                <input
                  v-if="editingId === supervisor.id"
                  v-model="editingData.full_name"
                  class="input-field w-full"
                  @keyup.enter="saveSupervisor(supervisor.id)"
                  @keyup.esc="cancelEdit"
                />
                <span v-else class="font-medium text-gray-900">{{ supervisor.full_name }}</span>
              </td>
              <td style="width: 200px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="text-gray-600 text-sm">
                  {{ formatDate(supervisor.created_at) }}
                </span>
              </td>
              <td style="width: 200px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <div v-if="editingId === supervisor.id" class="flex space-x-2">
                  <button
                    @click="saveSupervisor(supervisor.id)"
                    class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center space-x-1"
                  >
                    <span>✓</span>
                    <span>Сохранить</span>
                  </button>
                  <button
                    @click="cancelEdit"
                    class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-1"
                  >
                    <span>✕</span>
                    <span>Отмена</span>
                  </button>
                </div>
                <div v-else class="flex space-x-2">
                  <button
                    @click="editSupervisor(supervisor)"
                    class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center space-x-1"
                  >
                    <span>✏️</span>
                    <span>Изменить</span>
                  </button>
                  <button
                    @click="deleteSupervisor(supervisor.id)"
                    class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center space-x-1"
                  >
                    <span>🗑️</span>
                    <span>Удалить</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="supervisors.length === 0" class="text-center py-16">
        <div class="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <span class="text-6xl">📭</span>
        </div>
        <p class="text-xl font-semibold text-gray-600 mb-2">Нет загруженных руководителей</p>
        <p class="text-gray-500">Загрузите файл Excel/CSV или добавьте руководителя вручную</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../api/axios';

const supervisors = ref([]);
const selectedFile = ref(null);
const uploading = ref(false);
const adding = ref(false);
const editingId = ref(null);
const editingData = ref({});
const newSupervisorName = ref('');

onMounted(() => {
  loadSupervisors();
});

const loadSupervisors = async () => {
  try {
    const response = await api.get('/admin/supervisors');
    supervisors.value = response.data;
  } catch (error) {
    ElMessage.error('Ошибка загрузки руководителей');
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await api.post('/admin/upload/supervisors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    ElMessage.success(`Загружено ${response.data.imported || 0} руководителей`);
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    await loadSupervisors();
  } catch (error) {
    ElMessage.error(error.response?.data?.error || 'Ошибка загрузки файла');
  } finally {
    uploading.value = false;
  }
};

const addSupervisor = async () => {
  if (!newSupervisorName.value.trim()) return;

  adding.value = true;
  try {
    await api.post('/admin/supervisors', {
      full_name: newSupervisorName.value.trim()
    });

    ElMessage.success('Руководитель успешно добавлен');
    newSupervisorName.value = '';
    await loadSupervisors();
  } catch (error) {
    ElMessage.error(error.response?.data?.error || 'Ошибка добавления руководителя');
  } finally {
    adding.value = false;
  }
};

const editSupervisor = (supervisor) => {
  ElMessage.warning('Редактирование руководителя не поддерживается');
};

const saveSupervisor = async (id) => {
  ElMessage.warning('Редактирование руководителя не поддерживается');
};

const cancelEdit = () => {
  editingId.value = null;
  editingData.value = {};
};

const deleteSupervisor = async (id) => {
  ElMessage.warning('Удаление руководителя не поддерживается');
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const fileInput = ref(null);
</script>

<style scoped>
.table-row {
  animation: tableRow 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes tableRow {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Исправление выравнивания для таблицы руководителей */
.supervisors-table {
  table-layout: auto;
  border-collapse: collapse;
}

.supervisors-table thead th {
  text-align: left !important;
  vertical-align: middle !important;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.supervisors-table tbody td {
  text-align: left !important;
  vertical-align: top !important;
}

.supervisors-table tbody tr {
  position: relative;
}

.supervisors-table tbody tr::before {
  display: none !important;
}

.supervisors-table tbody tr:hover {
  transform: none !important;
  background: rgba(139, 92, 246, 0.05) !important;
}
</style>

