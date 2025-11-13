<template>
  <div class="animate-fade-in">
    <!-- Заголовок -->
    <div class="mb-8 animate-slide-up">
      <h1 class="page-title">Распределение тем</h1>
      <p class="page-subtitle">Автоматическое или ручное распределение тем между студентами</p>
    </div>

    <!-- Карточка управления -->
    <div class="card mb-6 animate-slide-up" style="animation-delay: 0.1s">
      <div class="section-header">
        <div class="section-icon bg-gradient-to-br from-purple-500 to-purple-600 emoji-3d">
          <span class="text-4xl emoji-bounce">🎯</span>
        </div>
        <h2 class="section-title">Режимы распределения</h2>
      </div>
      
      <div class="flex flex-wrap gap-4 mb-6">
        <button
          @click="autoDistribute"
          :disabled="distributing"
          class="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed button-3d glow-purple relative overflow-hidden"
        >
          <span v-if="distributing" class="loading-spinner"></span>
          <span v-else class="text-3xl emoji-rotate">🎲</span>
          <span>{{ distributing ? 'Распределение...' : 'Авто-режим (рандом)' }}</span>
        </button>
        <button
          @click="manualMode = !manualMode"
          class="flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 button-3d relative overflow-hidden"
          :class="manualMode 
            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl glow-purple' 
            : 'bg-white text-gray-dark border-2 border-purple-300 hover:border-purple-500 hover:shadow-lg'"
        >
          <span class="text-3xl emoji-bounce">✏️</span>
          <span>Ручной режим</span>
        </button>
      </div>

      <!-- Статистика -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="stats">
        <div 
          class="p-5 rounded-xl border-l-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-slide-up stats-card-3d"
          style="animation-delay: 0.2s; background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); border-color: #3B82F6"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-4xl emoji-float">📝</span>
            <div class="text-4xl font-bold number-pop" style="color: #1E40AF">{{ stats.freeTopics || 0 }}</div>
          </div>
          <div class="text-sm font-semibold text-gray-700">Свободных тем</div>
        </div>
        <div 
          class="p-5 rounded-xl border-l-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-slide-up stats-card-3d"
          style="animation-delay: 0.3s; background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border-color: #10B981"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-4xl emoji-pulse">✅</span>
            <div class="text-4xl font-bold number-pop" style="color: #059669">{{ stats.occupiedTopics || 0 }}</div>
          </div>
          <div class="text-sm font-semibold text-gray-700">Занятых тем</div>
        </div>
        <div 
          class="p-5 rounded-xl border-l-4 transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-slide-up stats-card-3d"
          style="animation-delay: 0.4s; background: linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%); border-color: #8B5CF6"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-4xl emoji-bounce">👥</span>
            <div class="text-4xl font-bold number-pop" style="color: #7C3AED">{{ stats.freeStudents || 0 }}</div>
          </div>
          <div class="text-sm font-semibold text-gray-700">Свободных студентов</div>
        </div>
      </div>
    </div>

    <!-- Ручной режим -->
    <div v-if="manualMode" class="card mb-6 animate-slide-up" style="animation-delay: 0.3s">
      <div class="flex items-center space-x-3 mb-6">
        <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg emoji-3d">
          <span class="text-3xl emoji-bounce">✏️</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-dark">Ручное распределение</h3>
      </div>
      
      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
        <table class="distribution-table min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <tr>
              <th style="text-align: left; padding: 16px 24px;">ТЕМА</th>
              <th style="width: 120px; text-align: left; padding: 16px 24px;">СТАТУС</th>
              <th style="width: 200px; text-align: left; padding: 16px 24px;">ГРУППА</th>
              <th style="width: 250px; text-align: left; padding: 16px 24px;">СТУДЕНТ</th>
              <th style="width: 160px; text-align: left; padding: 16px 24px;">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr 
              v-for="(topic, index) in freeTopics" 
              :key="topic.id" 
              :data-topic-id="topic.id"
              class="hover:bg-purple-50 transition-all duration-300 table-row"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td style="text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="font-medium text-gray-900">{{ topic.title }}</span>
              </td>
              <td style="width: 120px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-xs font-bold">
                  Свободна
                </span>
              </td>
              <td style="width: 200px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <select
                  v-if="assignments[topic.id]"
                  v-model="assignments[topic.id].group"
                  @change="loadStudentsForGroup(topic.id, assignments[topic.id].group)"
                  class="input-field w-full"
                  style="text-align: left;"
                >
                  <option value="">Выберите группу</option>
                  <option v-for="group in groups" :key="group" :value="group">
                    {{ group }}
                  </option>
                </select>
                <span v-else class="text-gray-400 text-sm">Загрузка...</span>
              </td>
              <td style="width: 250px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <select
                  v-if="assignments[topic.id]"
                  v-model="assignments[topic.id].student_id"
                  class="input-field w-full"
                  :disabled="!assignments[topic.id]?.group"
                  style="text-align: left;"
                >
                  <option :value="null">Выберите студента</option>
                  <option
                    v-for="student in (groupStudents[assignments[topic.id]?.group] || [])"
                    :key="student.id"
                    :value="student.id"
                  >
                    {{ student.full_name }} ({{ student.phone || 'нет телефона' }})
                  </option>
                </select>
                <span v-else class="text-gray-400 text-sm">Загрузка...</span>
              </td>
              <td style="width: 160px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <button
                  @click="assignTopic(topic.id)"
                  :disabled="!assignments[topic.id] || !assignments[topic.id]?.student_id"
                  class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 button-3d glow-green"
                >
                  <span class="text-lg">✓</span>
                  <span>Назначить</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Список всех назначений -->
    <div class="card animate-slide-up" style="animation-delay: 0.4s">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg emoji-3d">
            <span class="text-3xl emoji-pulse">✅</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-dark">Назначенные темы</h2>
            <p class="text-sm text-gray-500">Всего: {{ assignedTopics.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
        <table class="assigned-topics-table min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <tr>
              <th style="text-align: left; padding: 16px 24px;">Тема</th>
              <th style="width: 200px; text-align: left; padding: 16px 24px;">Студент</th>
              <th style="width: 150px; text-align: left; padding: 16px 24px;">Группа</th>
              <th style="width: 200px; text-align: left; padding: 16px 24px;">Руководитель</th>
              <th style="width: 160px; text-align: left; padding: 16px 24px;">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr 
              v-for="(topic, index) in assignedTopics" 
              :key="topic.id" 
              class="hover:bg-green-50 transition-all duration-300 table-row"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td style="text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="font-medium text-gray-900">{{ topic.title }}</span>
              </td>
              <td style="width: 200px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                  {{ topic.student_name }}
                </span>
              </td>
              <td style="width: 150px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {{ topic.student_group }}
                </span>
              </td>
              <td style="width: 200px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span class="text-gray-700 font-medium">
                  {{ topic.supervisor_name || 'не указан' }}
                </span>
              </td>
              <td style="width: 160px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <button
                  @click="changeTopic(topic.id)"
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center space-x-1"
                >
                  <span>🔄</span>
                  <span>Изменить</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="assignedTopics.length === 0" class="text-center py-16">
        <div class="inline-block p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 emoji-3d">
          <span class="text-7xl emoji-float">📋</span>
        </div>
        <p class="text-xl font-semibold text-gray-600 mb-2">Нет назначенных тем</p>
        <p class="text-gray-500">Назначьте темы студентам для начала работы</p>
      </div>
    </div>

    <!-- Модальное окно выбора группы для авто-режима -->
    <el-dialog
      v-model="showGroupSelectDialog"
      width="550px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :show-close="true"
      class="group-select-dialog"
      align-center
    >
      <template #header>
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg emoji-3d">
            <span class="text-2xl emoji-bounce">🎲</span>
          </div>
          <h3 class="text-xl font-bold text-white">Авто-распределение тем</h3>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Информация -->
        <div class="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl animate-bounce-in">
          <div class="flex items-start space-x-3">
            <span class="text-3xl emoji-pulse">ℹ️</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-gray-800 mb-2">
                Автоматическое распределение тем
              </p>
              <p class="text-xs text-gray-700 leading-relaxed">
                Все свободные темы будут случайным образом распределены между свободными студентами выбранной группы.
              </p>
            </div>
          </div>
        </div>

        <!-- Выбор группы -->
        <div>
          <label class="block text-gray-dark font-bold mb-3 flex items-center space-x-2">
            <span class="text-2xl emoji-bounce">👥</span>
            <span>Выберите группу:</span>
          </label>
          <el-select
            v-model="selectedGroupForAuto"
            placeholder="Выберите группу для авто-распределения"
            class="w-full group-select"
            size="large"
            filterable
            clearable
          >
            <el-option
              v-for="group in groups"
              :key="group"
              :label="group"
              :value="group"
            >
              <div class="flex items-center justify-between py-1">
                <span class="font-semibold">{{ group }}</span>
                <span class="text-xs text-gray-500 ml-3 px-2 py-1 bg-blue-100 rounded-full">
                  {{ getGroupStudentCount(group) }} студентов
                </span>
              </div>
            </el-option>
          </el-select>
        </div>

        <!-- Статистика группы -->
        <div v-if="selectedGroupForAuto" class="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl animate-bounce-in stats-card-3d">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-gray-800 flex items-center space-x-2">
              <span class="text-xl">📊</span>
              <span>Статистика группы "{{ selectedGroupForAuto }}"</span>
            </h4>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-white rounded-xl shadow-md">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-2xl emoji-float">👤</span>
                <p class="text-xs text-gray-600 font-semibold">Свободных студентов:</p>
              </div>
              <p class="text-3xl font-bold text-blue-600 number-pop">{{ getFreeStudentsInGroup(selectedGroupForAuto) }}</p>
            </div>
            <div class="p-4 bg-white rounded-xl shadow-md">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-2xl emoji-pulse">📝</span>
                <p class="text-xs text-gray-600 font-semibold">Свободных тем:</p>
              </div>
              <p class="text-3xl font-bold text-green-600 number-pop">{{ stats?.freeTopics || 0 }}</p>
            </div>
          </div>
          <div v-if="getFreeStudentsInGroup(selectedGroupForAuto) === 0" class="mt-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
            <p class="text-xs text-yellow-800 font-semibold flex items-center space-x-2">
              <span>⚠️</span>
              <span>В этой группе нет свободных студентов для распределения</span>
            </p>
          </div>
          <div v-if="stats?.freeTopics === 0" class="mt-4 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
            <p class="text-xs text-yellow-800 font-semibold flex items-center space-x-2">
              <span>⚠️</span>
              <span>Нет свободных тем для распределения</span>
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <button
            @click="showGroupSelectDialog = false; selectedGroupForAuto = ''"
            class="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold shadow-md"
          >
            Отмена
          </button>
          <button
            @click="confirmAutoDistribute"
            :disabled="!selectedGroupForAuto || distributing || getFreeStudentsInGroup(selectedGroupForAuto) === 0 || stats?.freeTopics === 0"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3 button-3d glow-purple"
          >
            <span v-if="distributing" class="loading-spinner"></span>
            <span v-else class="text-2xl emoji-rotate">🎲</span>
            <span>{{ distributing ? 'Распределение...' : 'Распределить' }}</span>
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElSelect, ElOption, ElDialog } from 'element-plus';
import api from '../../api/axios';

const distributing = ref(false);
const manualMode = ref(false);
const topics = ref([]);
const students = ref([]);
const stats = ref(null);
const groups = ref([]);
const groupStudents = reactive({});
const assignments = reactive({});
const showGroupSelectDialog = ref(false);
const selectedGroupForAuto = ref('');

const freeTopics = computed(() => {
  return topics.value.filter(t => t.status === 'free');
});

const assignedTopics = computed(() => {
  return topics.value.filter(t => {
    const isOccupied = t.status === 'occupied' || (t.student_id && t.student_id !== null);
    return isOccupied && t.student_id;
  });
});

onMounted(async () => {
  await loadData();
  await loadStats();
  initializeAssignments();
});

const loadData = async () => {
  await Promise.all([loadTopics(), loadStudents()]);
  // Инициализация assignments после загрузки данных
  if (freeTopics.value.length > 0) {
    initializeAssignments();
  }
};

const loadTopics = async () => {
  try {
    const response = await api.get('/admin/topics');
    const topicsData = response.data || [];
    
    topics.value = topicsData.map(t => {
      const isAssigned = !!t.assigned_student_id;
      return {
        id: t.id,
        title: t.title,
        status: t.status || (isAssigned ? 'occupied' : 'free'),
        student_id: t.assigned_student_id || null,
        student_name: t.student_name || t.assigned_student_full_name || null,
        student_group: t.student_group || t.reserved_by_group_name || null,
        supervisor_name: t.supervisor_full_name || t.supervisor_name || null
      };
    });
    
    // Обновляем assignments только для свободных тем
    initializeAssignments();
  } catch (error) {
    console.error('Ошибка загрузки тем:', error);
    ElMessage.error('Ошибка загрузки тем');
  }
};

const loadStudents = async () => {
  try {
    const response = await api.get('/admin/students');
    students.value = response.data;
    
    // Группировка по группам
    groups.value = [...new Set(students.value.map(s => s.group_name))];
    groups.value.forEach(group => {
      if (group !== undefined && group !== null && group !== '') {
        groupStudents[group] = students.value.filter(s => s.group_name === group);
      }
    });
  } catch (error) {
    ElMessage.error('Ошибка загрузки студентов');
  }
};

const loadStats = async () => {
  try {
    const [topicsRes, studentsRes] = await Promise.all([
      api.get('/admin/topics'),
      api.get('/admin/students')
    ]);
    
    const topicsData = (topicsRes.data || []).map(t => ({ status: t.assigned_student_id ? 'occupied' : 'free', student_id: t.assigned_student_id }));
    const studentsData = studentsRes.data || [];
    
    // Подсчет статистики
    const freeTopics = topicsData.filter(t => t.status === 'free').length;
    const occupiedTopics = topicsData.filter(t => t.status === 'occupied').length;
    
    // Студенты без тем
    const studentsWithTopics = new Set(topicsData.filter(t => t.student_id).map(t => t.student_id));
    const freeStudents = studentsData.filter(s => !studentsWithTopics.has(s.id)).length;
    
    stats.value = {
      freeTopics,
      occupiedTopics,
      freeStudents
    };
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error);
    stats.value = {
      freeTopics: 0,
      occupiedTopics: 0,
      freeStudents: 0
    };
  }
};

const initializeAssignments = () => {
  // Инициализируем assignments для всех свободных тем
  freeTopics.value.forEach(topic => {
    if (topic && topic.id !== undefined && topic.id !== null) {
      const topicId = topic.id;
      // Проверяем, не занята ли тема
      if (topic.status === 'free' && !assignments[topicId]) {
        assignments[topicId] = reactive({
          group: '',
          student_id: null
        });
      }
    }
  });
  
  // Удаляем assignments для тем, которые больше не свободны
  Object.keys(assignments).forEach(topicId => {
    const topicIdNum = parseInt(topicId, 10);
    const topic = topics.value.find(t => t.id === topicIdNum);
    if (!topic || topic.status !== 'free') {
      delete assignments[topicIdNum];
    }
  });
};

const loadStudentsForGroup = (topicId, group) => {
  if (!group || !topicId) return;
  if (assignments[topicId]) {
    assignments[topicId].student_id = null;
  }
};

const getGroupStudentCount = (groupName) => {
  if (!groupName) return 0;
  return groupStudents[groupName]?.length || 0;
};

const getFreeStudentsInGroup = (groupName) => {
  if (!groupName || !stats.value) return 0;
  const groupStudentsList = groupStudents[groupName] || [];
  const studentsWithTopics = new Set(
    topics.value
      .filter(t => t.student_id && t.status === 'occupied')
      .map(t => t.student_id)
  );
  return groupStudentsList.filter(s => !studentsWithTopics.has(s.id)).length;
};

const autoDistribute = async () => {
  // Проверяем наличие групп
  if (groups.value.length === 0) {
    ElMessage.warning('Нет доступных групп. Загрузите студентов сначала.');
    return;
  }

  // Проверяем наличие свободных тем
  if (stats.value && stats.value.freeTopics === 0) {
    ElMessage.warning('Нет свободных тем для распределения.');
    return;
  }

  // Открываем диалог выбора группы
  selectedGroupForAuto.value = '';
  showGroupSelectDialog.value = true;
};

const confirmAutoDistribute = async () => {
  if (!selectedGroupForAuto.value) {
    ElMessage.warning('Выберите группу для распределения');
    return;
  }

  try {
    // Подтверждение
    await ElMessageBox.confirm(
      `Вы уверены, что хотите автоматически распределить все свободные темы между студентами группы "${selectedGroupForAuto.value}"?`,
      'Подтверждение авто-распределения',
      {
        confirmButtonText: 'Да, распределить',
        cancelButtonText: 'Отмена',
        type: 'warning'
      }
    );
  } catch (error) {
    // Пользователь отменил
    if (error === 'cancel') {
      return;
    }
  }

  const anyStudent = students.value.find(s => s.group_name === selectedGroupForAuto.value);
  const groupId = anyStudent?.group_id;
  if (!groupId) {
    ElMessage.error('Не удалось определить идентификатор группы');
    return;
  }

  distributing.value = true;
  showGroupSelectDialog.value = false;
  
  try {
    const response = await api.post('/admin/auto-assign', { group_id: groupId });
    
    const assignedCount = response.data.assigned || 0;
    if (assignedCount > 0) {
      ElMessage.success({
        message: `🎲 Распределено ${assignedCount} тем для группы "${selectedGroupForAuto.value}"!`,
        type: 'success',
        duration: 4000
      });
      
      // Обновляем данные с небольшой задержкой для визуального эффекта
      await new Promise(resolve => setTimeout(resolve, 500));
      await loadData();
      await loadStats();
      initializeAssignments();
    } else {
      ElMessage.warning('Не удалось распределить темы. Возможно, все темы уже заняты или нет свободных студентов в этой группе.');
    }
  } catch (error) {
    console.error('Ошибка авто-распределения:', error);
    ElMessage.error(error.response?.data?.error || 'Ошибка распределения');
  } finally {
    distributing.value = false;
    selectedGroupForAuto.value = '';
  }
};

const assignTopic = async (topicId) => {
  const assignment = assignments[topicId];
  if (!assignment || !assignment.student_id) {
    ElMessage.warning('Выберите студента для назначения темы');
    return;
  }

  try {
    // Анимация перед назначением
    const topicElement = document.querySelector(`[data-topic-id="${topicId}"]`);
    if (topicElement) {
      topicElement.style.transition = 'all 0.5s ease-out';
      topicElement.style.transform = 'scale(0.95)';
      topicElement.style.opacity = '0.8';
    }

    const response = await api.post(`/admin/topics/${topicId}/reassign`, {
      student_id: assignment.student_id
    });

    if (response.data && response.data.ok !== false) {
      ElMessage.success({
        message: 'Тема успешно назначена! 🎉',
        type: 'success',
        duration: 3000
      });
      
      // Обновляем данные
      await loadData();
      await loadStats();
      initializeAssignments();
      
      // Очищаем assignment для этой темы
      if (assignments[topicId]) {
        assignments[topicId].group = '';
        assignments[topicId].student_id = null;
      }
    } else {
      throw new Error('Не удалось назначить тему');
    }
  } catch (error) {
    console.error('Ошибка назначения темы:', error);
    ElMessage.error(error.response?.data?.error || 'Ошибка назначения темы');
    // Возвращаем элемент в исходное состояние при ошибке
    const topicElement = document.querySelector(`[data-topic-id="${topicId}"]`);
    if (topicElement) {
      topicElement.style.transform = '';
      topicElement.style.opacity = '';
    }
  }
};

const changeTopic = async (topicId) => {
  try {
    const topic = topics.value.find(t => t.id === topicId);
    if (!topic) return;

    // Получаем все группы и студентов
    const allGroups = [...new Set(students.value.map(s => s.group_name))];
    
    // Создаем опции для выбора группы
    const groupOptions = {};
    for (let i = 0; i < allGroups.length; i++) {
      const g = allGroups[i];
      if (g !== undefined && g !== null && g !== '') {
        const groupName = String(g);
        groupOptions[groupName] = groupName;
      }
    }
    
    // Сначала выбираем группу
    const groupList = Object.keys(groupOptions);
    if (groupList.length === 0) {
      ElMessage.warning('Нет доступных групп');
      return;
    }
    
    let selectedGroup = null;
    try {
      const promptResult = await ElMessageBox.prompt(
        `Выберите группу нового студента:\n${groupList.map((g, i) => `${i + 1}. ${g}`).join('\n')}\n\nВведите номер группы:`,
        'Изменение темы',
        {
          confirmButtonText: 'Далее',
          cancelButtonText: 'Отмена',
          inputPattern: /^[1-9]\d*$/,
          inputErrorMessage: 'Введите номер группы'
        }
      );
      
      const inputValue = promptResult && promptResult.value ? String(promptResult.value).trim() : null;
      if (inputValue) {
        const index = parseInt(inputValue, 10) - 1;
        if (!isNaN(index) && index >= 0 && index < groupList.length) {
          const selectedGroupName = groupList[index];
          if (selectedGroupName !== undefined && selectedGroupName !== null) {
            selectedGroup = selectedGroupName;
          } else {
            ElMessage.error('Неверный номер группы');
            return;
          }
        } else {
          ElMessage.error('Неверный номер группы');
          return;
        }
      }
    } catch (error) {
      // Пользователь отменил
      return;
    }
    if (!selectedGroup) return;

    // Получаем студентов выбранной группы
    const groupStudentsList = students.value.filter(s => s.group_name === selectedGroup);
    
    // Создаем опции для выбора студента
    const studentOptions = {};
    for (let i = 0; i < groupStudentsList.length; i++) {
      const s = groupStudentsList[i];
      if (s && s.id !== undefined && s.id !== null) {
        const studentId = String(s.id);
        studentOptions[studentId] = `${s.full_name} (${s.phone || 'нет телефона'})`;
      }
    }

    // Выбираем студента
    const studentList = Object.keys(studentOptions);
    if (studentList.length === 0) {
      ElMessage.warning('Нет студентов в выбранной группе');
      return;
    }
    
    let selectedStudentId = null;
    try {
      const promptResult = await ElMessageBox.prompt(
        `Выберите нового студента:\n${studentList.map((id, i) => `${i + 1}. ${studentOptions[id]}`).join('\n')}\n\nВведите номер студента:`,
        'Изменение темы',
        {
          confirmButtonText: 'Изменить',
          cancelButtonText: 'Отмена',
          inputPattern: /^[1-9]\d*$/,
          inputErrorMessage: 'Введите номер студента'
        }
      );
      
      const inputValue = promptResult && promptResult.value ? String(promptResult.value).trim() : null;
      if (inputValue) {
        const index = parseInt(inputValue, 10) - 1;
        if (!isNaN(index) && index >= 0 && index < studentList.length) {
          const selectedId = studentList[index];
          if (selectedId !== undefined && selectedId !== null) {
            selectedStudentId = selectedId;
          } else {
            ElMessage.error('Неверный номер студента');
            return;
          }
        } else {
          ElMessage.error('Неверный номер студента');
          return;
        }
      }
    } catch (error) {
      // Пользователь отменил
      return;
    }

    if (!selectedStudentId) return;

    // Обновляем назначение
    await api.post(`/admin/topics/${topicId}/reassign`, {
      student_id: parseInt(selectedStudentId)
    });

    ElMessage.success('Тема успешно изменена');
    await loadData();
    await loadStats();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.error || 'Ошибка изменения темы');
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

/* 3D эффекты для эмодзи */
.emoji-3d {
  transform-style: preserve-3d;
  perspective: 1000px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.emoji-bounce {
  animation: emojiBounce 2s ease-in-out infinite;
  display: inline-block;
  transform-style: preserve-3d;
}

@keyframes emojiBounce {
  0%, 100% {
    transform: translateY(0) rotateY(0deg) scale(1);
  }
  50% {
    transform: translateY(-10px) rotateY(10deg) scale(1.1);
  }
}

.emoji-float {
  animation: emojiFloat 3s ease-in-out infinite;
  display: inline-block;
  transform-style: preserve-3d;
}

@keyframes emojiFloat {
  0%, 100% {
    transform: translateY(0) rotateZ(0deg);
  }
  33% {
    transform: translateY(-8px) rotateZ(5deg);
  }
  66% {
    transform: translateY(-4px) rotateZ(-5deg);
  }
}

.emoji-pulse {
  animation: emojiPulse 2s ease-in-out infinite;
  display: inline-block;
}

@keyframes emojiPulse {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.15);
    filter: brightness(1.2);
  }
}

.emoji-rotate {
  animation: emojiRotate 3s ease-in-out infinite;
  display: inline-block;
  transform-style: preserve-3d;
}

@keyframes emojiRotate {
  0%, 100% {
    transform: rotateY(0deg) rotateZ(0deg);
  }
  25% {
    transform: rotateY(90deg) rotateZ(5deg);
  }
  50% {
    transform: rotateY(180deg) rotateZ(0deg);
  }
  75% {
    transform: rotateY(270deg) rotateZ(-5deg);
  }
}

/* 3D эффекты для кнопок */
.button-3d {
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-3d::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.button-3d:hover::before {
  opacity: 1;
}

.button-3d:active {
  transform: translateY(2px) scale(0.98);
}

/* Эффект свечения */
.glow-purple {
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2);
}

.glow-purple:hover {
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3);
}

.glow-green {
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2);
}

.glow-green:hover {
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.6), 0 0 50px rgba(34, 197, 94, 0.3);
}

/* 3D эффекты для карточек статистики */
.stats-card-3d {
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stats-card-3d::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.stats-card-3d:hover::before {
  opacity: 1;
}

.stats-card-3d:hover {
  transform: translateY(-5px) rotateX(5deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Анимация для чисел */
.number-pop {
  animation: numberPop 0.5s ease-out;
  display: inline-block;
}

@keyframes numberPop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Улучшенные тени для таблиц */
table tbody tr {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

table tbody tr:hover {
  transform: translateX(5px) scale(1.01);
  box-shadow: 0 8px 16px rgba(139, 92, 246, 0.15);
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%);
}

/* Плавные переходы для селектов */
select {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

select:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

select:focus {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
}

/* Исправление выравнивания для таблицы распределения */
.distribution-table {
  table-layout: auto;
  border-collapse: collapse;
}

.distribution-table thead th {
  text-align: left !important;
  vertical-align: middle !important;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.distribution-table tbody td {
  text-align: left !important;
  vertical-align: top !important;
}

.distribution-table tbody td span {
  display: inline-block;
  text-align: left;
}

/* Обеспечиваем правильное выравнивание для элементов в ячейках */
.distribution-table tbody td select {
  width: 100%;
  text-align: left;
}

.distribution-table tbody td button {
  text-align: left;
  justify-content: flex-start;
}

/* Бейджи статуса должны быть выровнены по левому краю */
.distribution-table .px-3.py-1.rounded-full {
  display: inline-block;
  white-space: nowrap;
  text-align: left;
}

/* Исправление выравнивания для таблицы назначенных тем */
.assigned-topics-table {
  table-layout: auto;
  border-collapse: collapse;
}

.assigned-topics-table thead th {
  text-align: left !important;
  vertical-align: middle !important;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.assigned-topics-table tbody td {
  text-align: left !important;
  vertical-align: top !important;
}

.assigned-topics-table tbody tr {
  position: relative;
}

.assigned-topics-table tbody tr::before {
  display: none !important;
}

.assigned-topics-table tbody tr:hover {
  transform: none !important;
  background: rgba(34, 197, 94, 0.05) !important;
}

/* Отключаем эффект сдвига для таблицы распределения */
.distribution-table tbody tr::before {
  display: none !important;
}

.distribution-table tbody tr:hover {
  transform: none !important;
}

/* Стили для диалога выбора группы */
:deep(.group-select-dialog) {
  border-radius: 24px;
}

:deep(.group-select-dialog .el-dialog) {
  border-radius: 24px;
  box-shadow: 0 25px 70px rgba(139, 92, 246, 0.4);
  overflow: hidden;
  border: 2px solid rgba(139, 92, 246, 0.2);
}

:deep(.group-select-dialog .el-dialog__header) {
  padding: 20px 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  margin: 0;
}

:deep(.group-select-dialog .el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

:deep(.group-select-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 22px;
  transition: all 0.3s;
}

:deep(.group-select-dialog .el-dialog__headerbtn:hover .el-dialog__close) {
  color: #f3f4f6;
  transform: rotate(90deg) scale(1.1);
}

:deep(.group-select-dialog .el-dialog__body) {
  padding: 24px;
  background: white;
}

:deep(.group-select-dialog .el-dialog__footer) {
  padding: 16px 24px 24px;
  border-top: 2px solid #f3f4f6;
  background: white;
}

:deep(.group-select-dialog .el-select) {
  width: 100%;
}

:deep(.group-select-dialog .el-select .el-select__wrapper) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.group-select-dialog .el-select .el-select__wrapper:hover) {
  border-color: #8B5CF6;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  transform: translateY(-2px);
}

:deep(.group-select-dialog .el-select.is-focused .el-select__wrapper) {
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2), 0 4px 16px rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

:deep(.group-select-dialog .el-select-dropdown) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
  margin-top: 8px;
}

:deep(.group-select-dialog .el-select-dropdown .el-select-dropdown__item) {
  padding: 12px 16px;
  transition: all 0.2s;
}

:deep(.group-select-dialog .el-select-dropdown .el-select-dropdown__item:hover) {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
  transform: translateX(5px);
}

:deep(.group-select-dialog .el-select-dropdown .el-select-dropdown__item.is-selected) {
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  color: #8B5CF6;
  font-weight: 600;
}
</style>
