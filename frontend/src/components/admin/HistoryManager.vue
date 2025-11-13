<template>
  <div class="animate-fade-in">
    <!-- Заголовок -->
    <div class="mb-8 animate-slide-up">
      <h1 class="page-title">История изменений</h1>
      <p class="page-subtitle">Просмотр всех изменений в системе</p>
    </div>

    <div class="card animate-slide-up" style="animation-delay: 0.1s">
      <div class="section-header">
        <div class="section-icon bg-gradient-to-br from-gray-500 to-gray-600">
          <span class="text-3xl">📜</span>
        </div>
        <h2 class="section-title">Журнал изменений</h2>
      </div>
      
      <div class="mb-4 flex space-x-4">
        <el-select
          v-model="filters.entity_type"
          clearable
          placeholder="Тип сущности"
          class="w-48"
        >
          <el-option label="Студент" value="student" />
          <el-option label="Тема" value="topic" />
          <el-option label="Распределение" value="distribution" />
        </el-select>
        
        <input
          v-model="filters.entity_id"
          type="number"
          placeholder="ID сущности"
          class="input-field w-48"
        />
      </div>

      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
        <table class="history-table min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
            <tr>
              <th style="width: 180px; text-align: left; padding: 16px 24px;">Время</th>
              <th style="width: 200px; text-align: left; padding: 16px 24px;">Пользователь</th>
              <th style="width: 120px; text-align: left; padding: 16px 24px;">Роль</th>
              <th style="width: 120px; text-align: left; padding: 16px 24px;">Тип</th>
              <th style="width: 80px; text-align: left; padding: 16px 24px;">ID</th>
              <th style="width: 250px; text-align: left; padding: 16px 24px;">Действие</th>
              <th style="text-align: left; padding: 16px 24px;">Изменения</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr 
              v-for="(item, index) in filteredHistory" 
              :key="item.id" 
              class="hover:bg-gray-50 transition-all duration-300 table-row"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td style="width: 180px; text-align: left; padding: 16px 24px; vertical-align: top;">
                {{ new Date(item.created_at).toLocaleString('ru-RU') }}
              </td>
              <td style="width: 200px; text-align: left; padding: 16px 24px; vertical-align: top;">
                {{ item.user_name || 'Система' }}
              </td>
              <td style="width: 120px; text-align: left; padding: 16px 24px; vertical-align: top;">
                <span
                  :class="{
                    'px-2 py-1 rounded text-xs font-semibold': true,
                    'bg-purple-100 text-purple-800': item.user_role === 'admin',
                    'bg-blue-100 text-blue-800': item.user_role === 'starosta'
                  }"
                >
                  {{ item.user_role === 'admin' ? 'Админ' : item.user_role === 'starosta' ? 'Староста' : '-' }}
                </span>
              </td>
              <td style="width: 120px; text-align: left; padding: 16px 24px; vertical-align: top;">
                {{ item.entity_type }}
              </td>
              <td style="width: 80px; text-align: left; padding: 16px 24px; vertical-align: top;">
                {{ item.entity_id || '-' }}
              </td>
              <td style="width: 250px; text-align: left; padding: 16px 24px; vertical-align: top;">
                {{ item.action }}
              </td>
              <td style="text-align: left; padding: 16px 24px; vertical-align: top;">
                <div class="text-sm text-gray-600">
                  <div v-if="item.old_value" class="mb-1">
                    <span class="font-semibold">Было:</span>
                    <pre class="text-xs mt-1">{{ formatValue(item.old_value) }}</pre>
                  </div>
                  <div v-if="item.new_value">
                    <span class="font-semibold">Стало:</span>
                    <pre class="text-xs mt-1">{{ formatValue(item.new_value) }}</pre>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredHistory.length === 0" class="text-center py-16">
        <div class="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <span class="text-6xl">📋</span>
        </div>
        <p class="text-xl font-semibold text-gray-600 mb-2">Нет записей в истории</p>
        <p class="text-gray-500">Изменения появятся здесь после первых действий в системе</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../api/axios';

const history = ref([]);
const filters = ref({
  entity_type: '',
  entity_id: ''
});

const filteredHistory = computed(() => {
  let result = history.value;

  if (filters.value.entity_type) {
    result = result.filter(item => item.entity_type === filters.value.entity_type);
  }

  if (filters.value.entity_id) {
    result = result.filter(item => item.entity_id == filters.value.entity_id);
  }

  return result;
});

onMounted(() => {
  loadHistory();
});

const loadHistory = async () => {
  try {
    const response = await api.get('/admin/history');
    history.value = response.data;
  } catch (error) {
    ElMessage.error('Ошибка загрузки истории');
  }
};

const formatValue = (value) => {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
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

/* Исправление выравнивания для таблицы истории */
.history-table {
  table-layout: auto;
  border-collapse: collapse;
}

.history-table thead th {
  text-align: left !important;
  vertical-align: middle !important;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.history-table tbody td {
  text-align: left !important;
  vertical-align: top !important;
}

.history-table tbody tr {
  position: relative;
}

.history-table tbody tr::before {
  display: none !important;
}

.history-table tbody tr:hover {
  transform: none !important;
  background: rgba(107, 114, 128, 0.05) !important;
}
</style>
