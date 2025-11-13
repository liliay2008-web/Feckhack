<template>
  <div class="animate-fade-in">
    <!-- Заголовок с анимацией -->
    <div class="mb-8 animate-slide-up">
      <h1 class="page-title">Загрузка студентов</h1>
      <p class="page-subtitle">Загрузите файл Excel/CSV или отредактируйте данные вручную</p>
    </div>

    <!-- Карточка загрузки файла -->
    <div class="card mb-6 animate-slide-up" style="animation-delay: 0.1s">
      <div class="section-header">
        <div class="section-icon bg-gradient-to-br from-blue-500 to-blue-600">
          <span class="text-3xl">📤</span>
        </div>
        <h2 class="section-title">Загрузка файла</h2>
      </div>
      
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept=".xlsx,.xls,.csv"
              class="hidden"
              id="student-file-input"
            />
            <label
              for="student-file-input"
              class="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-indigo-600 hover:to-indigo-700 text-white font-bold rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 w-full sm:w-auto glow-effect"
            >
              <span class="text-2xl">📁</span>
              <span class="text-lg">Выбрать файл (Excel/CSV)</span>
              <span class="text-xl">⬆️</span>
            </label>
          </div>
          <button
            v-if="selectedFile"
            @click="uploadFile"
            :disabled="uploading"
            class="px-8 py-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed glow-effect"
          >
            <span v-if="uploading" class="loading-spinner"></span>
            <span v-else class="text-2xl">🚀</span>
            <span class="text-lg">{{ uploading ? 'Загрузка...' : 'Импортировать' }}</span>
          </button>
        </div>

        <div v-if="selectedFile" class="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl animate-bounce-in shadow-lg">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-green-500 rounded-full">
              <span class="text-2xl">✅</span>
            </div>
            <div class="flex-1">
              <p class="font-bold text-green-800 text-lg">Файл готов к импорту:</p>
              <p class="text-base text-green-700 font-semibold mt-1">{{ selectedFile.name }}</p>
              <p class="text-sm text-green-600 mt-1">
                Размер: {{ (selectedFile.size / 1024).toFixed(2) }} KB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица студентов -->
    <div class="card animate-slide-up" style="animation-delay: 0.2s">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <span class="text-2xl">👥</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-dark">Список студентов</h2>
            <p class="text-sm text-gray-500">Всего: {{ students.length }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="students.length > 0"
            @click="clearAllStudents"
            class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center space-x-1"
          >
            <span>🗑️</span>
            <span>Очистить всех</span>
          </button>
          <div class="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold">
            {{ students.length }}
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
        <table class="students-table min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <tr>
              <th style="width: 60px; text-align: left; padding: 16px 24px;">№</th>
              <th style="text-align: left; padding: 16px 24px;">ФИО</th>
              <th style="width: 150px; text-align: left; padding: 16px 24px;">ГРУППА</th>
              <th style="width: 180px; text-align: left; padding: 16px 24px;">ТЕЛЕФОН</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="(student, index) in students"
              :key="student.id"
              class="hover:bg-purple-50 transition-all duration-300 table-row"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td style="width: 60px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="font-medium text-gray-900">{{ index + 1 }}</span>
              </td>
              <td style="text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="font-medium text-gray-900">{{ student.full_name }}</span>
              </td>
              <td style="width: 150px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {{ student.group_name }}
                </span>
              </td>
              <td style="width: 180px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="text-gray-600">
                  {{ student.phone || 'не указан' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="students.length === 0" class="text-center py-16">
        <div class="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <span class="text-6xl">📭</span>
        </div>
        <p class="text-xl font-semibold text-gray-600 mb-2">Нет загруженных студентов</p>
        <p class="text-gray-500">Загрузите файл Excel/CSV для начала работы</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '../../api/axios';

const students = ref([]);
const selectedFile = ref(null);
const uploading = ref(false);
const editingId = ref(null);
const editingData = ref({});

onMounted(() => {
  loadStudents();
});

const loadStudents = async () => {
  try {
    const response = await api.get('/admin/students');
    students.value = response.data;
  } catch (error) {
    ElMessage.error('Ошибка загрузки студентов');
  }
};

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  uploading.value = true;
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await api.post('/admin/upload/students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    ElMessage.success(`Загружено ${response.data.imported || 0} студентов`);
    selectedFile.value = null;
    document.getElementById('student-file-input').value = '';
    loadStudents();
  } catch (error) {
    ElMessage.error(error.response?.data?.error || 'Ошибка загрузки файла');
  } finally {
    uploading.value = false;
  }
};

const editStudent = (student) => {
  ElMessage.warning('Редактирование студентов не поддерживается в текущей версии');
};

const cancelEdit = () => {
  editingId.value = null;
  editingData.value = {};
};

const saveStudent = async (id) => {
  ElMessage.warning('Редактирование студентов не поддерживается');
};

const clearAllStudents = async () => {
  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить всех студентов? Это действие нельзя отменить.',
      'Подтверждение очистки',
      {
        confirmButtonText: 'Очистить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      }
    );

    const response = await api.delete('/admin/students');
    ElMessage.success('Все студенты удалены');
    loadStudents();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Ошибка очистки студентов');
    }
  }
};

const deleteStudent = async (id) => {
  console.log('deleteStudent called with id:', id);
  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить этого студента?',
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      }
    );

    const studentId = Number(id);
    console.log('Sending delete request to /admin/students/' + studentId, 'original id:', id, 'converted:', studentId);
    const response = await api.delete(`/admin/students/${studentId}`);
    console.log('Delete response:', response);
    ElMessage.success('Студент удалён');
    loadStudents();
  } catch (error) {
    console.log('Delete error:', error);
    if (error !== 'cancel') {
      const errorMsg = error.response?.data?.error;
      console.log('Error message:', errorMsg);
      if (errorMsg === 'student_assigned_to_topic') {
        ElMessage.error('Нельзя удалить студента, назначенного на тему. Сначала снимите назначение.');
      } else {
        ElMessage.error('Ошибка удаления студента: ' + (errorMsg || error.message));
      }
    }
  }
};
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

/* Исправление выравнивания для таблицы студентов */
.students-table {
  table-layout: auto;
  border-collapse: collapse;
}

.students-table thead th {
  text-align: left !important;
  vertical-align: middle !important;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.students-table tbody td {
  text-align: left !important;
  vertical-align: top !important;
}

.students-table tbody td span {
  display: inline-block;
  text-align: left;
}

/* Обеспечиваем правильное выравнивание для бейджей */
.students-table .px-3.py-1 {
  display: inline-block;
  white-space: nowrap;
  text-align: left;
}

/* Отключаем эффект сдвига для таблицы студентов */
.students-table tbody tr {
  position: relative;
}

.students-table tbody tr::before {
  display: none !important;
}

.students-table tbody tr:hover {
  transform: none !important;
  background: rgba(139, 92, 246, 0.05) !important;
}
</style>
