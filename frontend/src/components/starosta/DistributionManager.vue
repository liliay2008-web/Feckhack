<template>
  <div class="animate-fade-in">
    <!-- Заголовок -->
    <div class="mb-8 animate-slide-up">
      <h1 class="text-4xl font-bold gradient-text mb-2">Распределение тем</h1>
      <p class="text-gray-600">Выберите свободную тему и назначьте её студенту из вашей группы</p>
    </div>

    <!-- Информационная карточка -->
    <div class="card mb-6 card-hover animate-slide-up bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200" style="animation-delay: 0.1s">
      <div class="flex items-start space-x-4">
        <div class="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <span class="text-3xl">ℹ️</span>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-dark mb-2">Важная информация</h3>
          <ul class="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Вы можете назначать только <strong>свободные темы</strong></li>
            <li>После выбора темы у вас есть <strong>30 минут</strong> на заполнение всех данных</li>
            <li>Если поля не будут заполнены в течение 30 минут (кроме поля "научный руководитель"), тема станет доступна для других</li>
            <li>Вы не можете изменять уже назначенные темы</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Таблица свободных тем -->
    <div class="card animate-slide-up" style="animation-delay: 0.2s">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <span class="text-2xl">📝</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-dark">Свободные темы</h2>
            <p class="text-sm text-gray-500">Доступно: {{ freeTopics.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Тема</th>
              <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Предмет</th>
              <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">ЦМК</th>
              <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Руководитель</th>
              <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Статус</th>
              <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr 
              v-for="(topic, index) in freeTopics" 
              :key="topic.id" 
              class="hover:bg-green-50 transition-all duration-300 table-row"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td class="px-6 py-4">
                <span class="font-medium text-gray-900">{{ topic.title }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {{ topic.subject || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  {{ topic.cmk || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-700 font-medium">
                  {{ topic.supervisor_name || '<span class="text-gray-400">не указан</span>' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold transition-all duration-300"
                  :style="{
                    background: topic.status === 'free' 
                      ? 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
                      : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    color: topic.status === 'free' ? '#059669' : '#D97706'
                  }"
                >
                  {{ getStatusText(topic.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button
                  v-if="topic.status === 'free'"
                  @click="selectTopic(topic)"
                  class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center space-x-1"
                >
                  <span>✓</span>
                  <span>Выбрать</span>
                </button>
                <span 
                  v-else-if="topic.status === 'locked'"
                  class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold"
                >
                  Заблокирована
                </span>
                <span 
                  v-else 
                  class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold"
                >
                  Недоступно
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="freeTopics.length === 0" class="text-center py-16">
        <div class="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <span class="text-6xl">📭</span>
        </div>
        <p class="text-xl font-semibold text-gray-600 mb-2">Нет свободных тем</p>
        <p class="text-gray-500">Все темы уже назначены или заблокированы</p>
      </div>
    </div>

    <!-- Модальное окно назначения -->
    <el-dialog
      v-model="showDialog"
      title="Назначение темы"
      width="600px"
      class="dialog-custom"
    >
      <div v-if="selectedTopic" class="space-y-6">
        <!-- Информация о теме -->
        <div class="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
          <div class="flex items-center space-x-3 mb-2">
            <span class="text-2xl">📚</span>
            <h3 class="text-lg font-bold text-gray-dark">Тема</h3>
          </div>
          <p class="text-gray-700 font-medium">{{ selectedTopic.title }}</p>
          <div class="mt-2 flex space-x-4 text-sm text-gray-600">
            <span v-if="selectedTopic.subject">Предмет: {{ selectedTopic.subject }}</span>
            <span v-if="selectedTopic.cmk">ЦМК: {{ selectedTopic.cmk }}</span>
          </div>
        </div>

        <!-- Выбор студента -->
        <div>
          <label class="block text-gray-dark font-semibold mb-3 flex items-center space-x-2">
            <span>👤</span>
            <span>Студент из вашей группы:</span>
          </label>
          <el-select
            v-model="assignmentData.student_id"
            placeholder="Выберите студента"
            class="w-full"
            size="large"
          >
            <el-option
              v-for="student in myGroupStudents"
              :key="student.id"
              :label="`${student.full_name} ${student.phone ? '(' + student.phone + ')' : ''}`"
              :value="student.id"
            />
          </el-select>
        </div>

        <!-- Номер телефона -->
        <div>
          <label class="block text-gray-dark font-semibold mb-3 flex items-center space-x-2">
            <span>📱</span>
            <span>Номер телефона (если не указан):</span>
          </label>
          <input
            v-model="assignmentData.phone"
            type="tel"
            class="input-field"
            placeholder="+7 (___) ___-__-__"
          />
        </div>

        <!-- Научный руководитель -->
        <div>
          <label class="block text-gray-dark font-semibold mb-3 flex items-center space-x-2">
            <span>👨‍🏫</span>
            <span>Научный руководитель:</span>
          </label>
          <el-select
            v-model="assignmentData.supervisor_id"
            placeholder="Выберите руководителя"
            class="w-full"
            size="large"
          >
            <el-option
              v-for="supervisor in supervisors"
              :key="supervisor.id"
              :label="supervisor.full_name"
              :value="supervisor.id"
            />
          </el-select>
        </div>

        <!-- Предупреждение о блокировке -->
        <div v-if="lockedUntil" class="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl animate-bounce-in">
          <div class="flex items-start space-x-3">
            <span class="text-3xl">⚠️</span>
            <div class="flex-1">
              <p class="text-yellow-900 font-bold mb-2 text-lg">
                Внимание! Тема заблокирована на 30 минут
              </p>
              <p class="text-yellow-800 text-sm mb-3">
                Заполните все поля до истечения времени. Если поля не будут заполнены в течение 30 минут (за исключением поля "научный руководитель"), тема станет доступна для других.
              </p>
              <div class="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-lg">
                <span class="text-2xl">⏰</span>
                <div>
                  <p class="text-xs text-yellow-700 font-semibold">Осталось времени:</p>
                  <p class="text-xl font-bold text-yellow-900">{{ timeLeft }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDialog = false"
            class="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold"
          >
            Отмена
          </button>
          <button
            @click="assignTopic"
            :disabled="!assignmentData.student_id"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
          >
            <span>✓</span>
            <span>Назначить</span>
          </button>
          <button
            v-if="lockedUntil && assignmentData.supervisor_id"
            @click="completeAssignment"
            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg font-semibold flex items-center space-x-2"
          >
            <span>✅</span>
            <span>Завершить назначение</span>
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import api from '../../api/axios';

const authStore = useAuthStore();
const topics = ref([]);
const students = ref([]);
const supervisors = ref([]);
const showDialog = ref(false);
const selectedTopic = ref(null);
const assignmentData = ref({
  student_id: null,
  phone: '',
  supervisor_id: null
});
const lockedUntil = ref(null);
const timeLeft = ref('');
const timer = ref(null);

const myGroupStudents = computed(() => {
  const userGroups = authStore.user?.groups || [];
  return students.value.filter(s => userGroups.includes(s.group_name));
});

const freeTopics = computed(() => {
  return topics.value.filter(t => t.status === 'free' || t.status === 'locked');
});

onMounted(() => {
  loadData();
  startTimer();
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});

const loadData = async () => {
  await Promise.all([loadTopics(), loadStudents(), loadSupervisors()]);
};

const loadTopics = async () => {
  try {
    const response = await api.get('/topics');
    topics.value = response.data;
  } catch (error) {
    ElMessage.error('Ошибка загрузки тем');
  }
};

const loadStudents = async () => {
  try {
    const response = await api.get('/admin/students');
    students.value = response.data;
  } catch (error) {
    ElMessage.error('Ошибка загрузки студентов');
  }
};

const loadSupervisors = async () => {
  try {
    const response = await api.get('/supervisors');
    supervisors.value = response.data;
  } catch (error) {
    ElMessage.error('Ошибка загрузки руководителей');
  }
};

const getStatusText = (status) => {
  const statusMap = {
    free: 'Свободна',
    occupied: 'Занята',
    locked: 'Заблокирована'
  };
  return statusMap[status] || status;
};

const selectTopic = (topic) => {
  selectedTopic.value = topic;
  assignmentData.value = {
    student_id: null,
    phone: '',
    supervisor_id: null
  };
  lockedUntil.value = null;
  showDialog.value = true;
};

const assignTopic = async () => {
  if (!selectedTopic.value || !assignmentData.value.student_id) return;

  try {
    const response = await api.post(`/topics/${selectedTopic.value.id}/assign`, {
      student_id: assignmentData.value.student_id,
      phone: assignmentData.value.phone || null,
      supervisor_id: assignmentData.value.supervisor_id || null
    });

    if (response.data.locked_until) {
      lockedUntil.value = new Date(response.data.locked_until);
      ElMessage.warning('Тема заблокирована на 30 минут. Заполните все поля до истечения времени.');
      startTimer();
    } else {
      ElMessage.success('Тема успешно назначена');
      showDialog.value = false;
      loadTopics();
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.error || 'Ошибка назначения темы');
  }
};

const completeAssignment = async () => {
  if (!selectedTopic.value || !assignmentData.value.supervisor_id) return;

  try {
    await api.post(`/topics/${selectedTopic.value.id}/complete`, {
      supervisor_id: assignmentData.value.supervisor_id
    });

    ElMessage.success('Тема успешно назначена');
    showDialog.value = false;
    lockedUntil.value = null;
    if (timer.value) {
      clearInterval(timer.value);
    }
    loadTopics();
  } catch (error) {
    ElMessage.error(error.response?.data?.error || 'Ошибка завершения назначения');
  }
};

const startTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
  }

  timer.value = setInterval(() => {
    if (lockedUntil.value) {
      const now = new Date();
      const locked = new Date(lockedUntil.value);
      const diff = locked - now;

      if (diff <= 0) {
        timeLeft.value = 'Время истекло';
        lockedUntil.value = null;
        clearInterval(timer.value);
        ElMessage.warning('Время блокировки истекло. Тема освобождена.');
        showDialog.value = false;
        loadTopics();
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        timeLeft.value = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  }, 1000);
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

/* Стили для модального окна */
:deep(.el-dialog) {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

:deep(.el-dialog__header) {
  padding: 24px 24px 16px;
  border-bottom: 2px solid #f3f4f6;
}

:deep(.el-dialog__title) {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px 24px;
  border-top: 2px solid #f3f4f6;
}
</style>
