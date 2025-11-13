<template>
  <div class="animate-fade-in">
    <!-- Заголовок -->
    <div class="mb-8 animate-slide-up">
      <h1 class="page-title">Загрузка тем</h1>
      <p class="page-subtitle">Управление темами курсовых и дипломных работ</p>
    </div>

    <!-- Карточка загрузки -->
    <div class="card mb-6 animate-slide-up" style="animation-delay: 0.1s">
      <div class="section-header">
        <div class="section-icon bg-gradient-to-br from-green-500 to-green-600">
          <span class="text-3xl">📖</span>
        </div>
        <h2 class="section-title">Загрузка файла</h2>
      </div>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label class="block text-gray-dark font-semibold mb-2 flex items-center space-x-2">
              <span>📚</span>
              <span>Предмет:</span>
            </label>
            <input
              v-model="uploadData.subject"
              type="text"
              class="input-field"
              placeholder="Введите предмет"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-gray-dark font-semibold mb-2 flex items-center space-x-2">
              <span>🏢</span>
              <span>ЦМК:</span>
            </label>
            <input
              v-model="uploadData.cmk"
              type="text"
              class="input-field"
              placeholder="Введите ЦМК"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-gray-dark font-semibold mb-2 flex items-center space-x-2">
              <span>📝</span>
              <span>Тип работы:</span>
            </label>
            <input
              v-model="uploadData.work_type"
              type="text"
              class="input-field"
              placeholder="Курсовая/Дипломная"
            />
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                accept=".xlsx,.xls,.csv"
                class="hidden"
                id="topic-file-input"
              />
              <label
                for="topic-file-input"
                class="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 w-full sm:w-auto glow-effect"
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
              <span class="text-lg">{{ uploading ? 'Загрузка...' : 'Импортировать темы' }}</span>
            </button>
          </div>
          
          <div v-if="selectedFile" class="mt-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl animate-bounce-in shadow-lg">
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
    </div>

    <!-- Таблица тем -->
    <div class="card animate-slide-up" style="animation-delay: 0.2s">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <span class="text-2xl">📚</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-dark">Список тем</h2>
            <p class="text-sm text-gray-500">Всего: {{ topics.length }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <div class="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
            Свободно: {{ topics.filter(t => t.status === 'free').length }}
          </div>
          <div class="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-semibold">
            Занято: {{ topics.filter(t => t.status === 'occupied').length }}
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
        <table class="topics-table min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <tr>
              <th style="width: 80px; text-align: left; padding: 16px 24px;">ID</th>
              <th style="text-align: left; padding: 16px 24px;">Название</th>
              <th style="width: 150px; text-align: left; padding: 16px 24px;">Предмет</th>
              <th style="width: 160px; text-align: left; padding: 16px 24px;">Вид работы</th>
              <th style="width: 150px; text-align: left; padding: 16px 24px;">ЦМК</th>
              <th style="width: 200px; text-align: left; padding: 16px 24px;">Руководитель</th>
              <th style="width: 120px; text-align: left; padding: 16px 24px;">Статус</th>
              <th style="width: 200px; text-align: left; padding: 16px 24px;">Студент</th>
              <th style="width: 180px; text-align: left; padding: 16px 24px;">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr 
              v-for="(topic, index) in topics" 
              :key="topic.id" 
              class="hover:bg-green-50 transition-all duration-300 table-row"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td style="width: 80px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="font-bold text-green-600">#{{ topic.id }}</span>
              </td>
              <td style="text-align: left; padding: 16px 24px; vertical-align: top;">
                <input
                  v-if="editingId === topic.id"
                  v-model="editingData.title"
                  class="input-field w-full"
                  @keyup.enter="saveTopic(topic.id)"
                  @keyup.esc="cancelEdit"
                />
                <span v-else class="font-medium text-gray-900">{{ topic.title }}</span>
              </td>
              <td style="width: 150px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <input
                  v-if="editingId === topic.id"
                  v-model="editingData.subject"
                  class="input-field w-full"
                  @keyup.enter="saveTopic(topic.id)"
                />
                <span v-else class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {{ topic.subject || '-' }}
                </span>
              </td>
              <td style="width: 160px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <input
                  v-if="editingId === topic.id"
                  v-model="editingData.work_type"
                  class="input-field w-full"
                  placeholder="Курсовая/Дипломная"
                  @keyup.enter="saveTopic(topic.id)"
                />
                <span v-else class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                  {{ topic.work_type || '-' }}
                </span>
              </td>
              <td style="width: 150px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <input
                  v-if="editingId === topic.id"
                  v-model="editingData.cmk"
                  class="input-field w-full"
                  @keyup.enter="saveTopic(topic.id)"
                />
                <span v-else class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  {{ topic.cmk || '-' }}
                </span>
              </td>
              <td style="width: 200px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <select
                  v-if="editingId === topic.id"
                  v-model="editingData.supervisor_id"
                  class="input-field w-full"
                >
                  <option value="">Не выбран</option>
                  <option
                    v-for="supervisor in supervisors"
                    :key="supervisor.id"
                    :value="supervisor.id"
                  >
                    {{ supervisor.full_name }}
                  </option>
                </select>
                <span v-else class="text-gray-700 font-medium">
                  {{ topic.supervisor_name || 'не указан' }}
                </span>
              </td>
              <td style="width: 120px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span
                    class="status-badge"
                    :class="{
                      'status-free': topic.status === 'free',
                      'status-occupied': topic.status === 'occupied',
                      'status-reserved': topic.status === 'reserved'
                    }"
                >
                  {{ getStatusText(topic.status) }}
                </span>
              </td>
              <td style="width: 200px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span v-if="topic.student_name" class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                  {{ topic.student_name }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td style="width: 180px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <div v-if="editingId === topic.id" class="flex space-x-2">
                  <button
                    @click="saveTopic(topic.id)"
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
                    @click="editTopic(topic)"
                    class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center space-x-1"
                  >
                    <span>✏️</span>
                    <span>Изменить</span>
                  </button>
                  <button
                    @click="deleteTopic(topic.id)"
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

      <div v-if="topics.length === 0" class="text-center py-16">
        <div class="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <span class="text-6xl">📭</span>
        </div>
        <p class="text-xl font-semibold text-gray-600 mb-2">Нет загруженных тем</p>
        <p class="text-gray-500">Загрузите файл Excel/CSV для начала работы</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../api/axios';

const topics = ref([]);
const supervisors = ref([]);
const selectedFile = ref(null);
const uploading = ref(false);
const editingId = ref(null);
const editingData = ref({});

const uploadData = ref({
  subject: '',
  cmk: '',
  work_type: ''
});

onMounted(() => {
  loadTopics();
  loadSupervisors();
});

const loadTopics = async () => {
  try {
    const response = await api.get('/admin/topics');
    topics.value = (response.data || []).map(t => ({
      id: t.id,
      title: t.title,
      description: t.description || null,
      subject: t.subject_name || t.subject || null,
      cmk: t.commission_name || t.cmk || null,
      work_type: t.work_type || null,
      supervisor_id: t.supervisor_id || null,
      supervisor_name: t.supervisor_full_name || null,
      status: t.status || (t.assigned_student_id ? 'occupied' : 'free'),
      student_name: t.student_name || t.assigned_student_full_name || null,
      student_group: t.student_group || null
    }));
  } catch (error) {
    ElMessage.error('Ошибка загрузки тем');
  }
};

const loadSupervisors = async () => {
  try {
    const response = await api.get('/admin/supervisors');
    supervisors.value = response.data;
  } catch (error) {
    ElMessage.error('Ошибка загрузки руководителей');
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
  formData.append('subject', uploadData.value.subject);
  formData.append('cmk', uploadData.value.cmk);
  formData.append('work_type', uploadData.value.work_type);

  try {
    const response = await api.post('/admin/upload/topics', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    ElMessage.success(`Загружено ${response.data.imported || 0} тем`);
    selectedFile.value = null;
    document.getElementById('topic-file-input').value = '';
    uploadData.value = { subject: '', cmk: '', work_type: '' };
    loadTopics();
  } catch (error) {
    ElMessage.error(error.response?.data?.error || 'Ошибка загрузки файла');
  } finally {
    uploading.value = false;
  }
};

const getStatusText = (status) => {
  const statusMap = {
    free: 'Свободна',
    occupied: 'Занята',
    locked: 'Заблокирована',
    in_progress: 'В процессе'
  };
  return statusMap[status] || status;
};

const editTopic = (topic) => {
  editingId.value = topic.id;
  editingData.value = {
    title: topic.title,
    subject: topic.subject || '',
    cmk: topic.cmk || '',
    work_type: topic.work_type || '',
    supervisor_id: topic.supervisor_id || null
  };
};

const cancelEdit = () => {
  editingId.value = null;
  editingData.value = {};
};

const saveTopic = async (id) => {
  try {
    if (editingData.value.supervisor_id !== undefined) {
      await api.post(`/admin/topics/${id}/supervisor`, { supervisor_id: editingData.value.supervisor_id || null });
      ElMessage.success('Руководитель обновлён');
    } else {
      ElMessage.info('Изменение поддерживается только для руководителя');
    }
    editingId.value = null;
    editingData.value = {};
    loadTopics();
  } catch (error) {
    ElMessage.error('Ошибка обновления темы');
  }
};

const deleteTopic = async (id) => {
  ElMessage.warning('Удаление тем не поддерживается');
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

/* Исправление выравнивания для таблицы тем */
.topics-table {
  table-layout: auto;
  border-collapse: collapse;
}

.topics-table thead th {
  text-align: left !important;
  vertical-align: middle !important;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.topics-table tbody td {
  text-align: left !important;
  vertical-align: top !important;
}

.topics-table tbody tr {
  position: relative;
}

.topics-table tbody tr::before {
  display: none !important;
}

.topics-table tbody tr:hover {
  transform: none !important;
  background: rgba(34, 197, 94, 0.05) !important;
}
</style>
