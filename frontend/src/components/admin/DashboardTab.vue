<template>
  <div class="animate-fade-in" style="position: relative; z-index: 10;">
    <div class="mb-8 animate-slide-up">
      <h1 class="page-title">Панель администратора</h1>
      <p class="page-subtitle">Добро пожаловать, {{ user?.full_name }}!</p>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="(stat, index) in statsCards" 
        :key="index"
        class="card card-hover bg-gradient-to-br border-l-4 animate-slide-up"
        :style="{ 
          animationDelay: `${index * 0.1}s`,
          background: stat.gradient,
          borderColor: stat.borderColor
        }"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-2">{{ stat.label }}</p>
            <p 
              class="text-4xl font-bold transition-all duration-500"
              :style="{ color: stat.color }"
            >
              {{ stat.value }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ stat.description }}</p>
          </div>
          <div 
            class="text-5xl float transition-transform duration-300 hover:scale-110"
            :style="{ filter: `drop-shadow(0 4px 6px ${stat.shadow})` }"
          >
            {{ stat.icon }}
          </div>
        </div>
        <div class="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :style="{ 
              width: `${Math.min((stat.value / Math.max(stats.students?.total || 1, stats.topics?.total || 1)) * 100, 100)}%`,
              background: stat.color
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Функции администратора -->
    <div class="card mb-8 card-hover animate-slide-up" style="animation-delay: 0.3s">
      <div class="flex items-center space-x-3 mb-6">
        <div class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
          <span class="text-3xl">⚙️</span>
        </div>
        <h2 class="text-2xl font-bold gradient-text">Функции администратора</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="(functionality, index) in adminFunctions" 
          :key="index"
          @click="functionality.tab && $emit('switch-tab', functionality.tab)"
          :class="[
            'group flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl transition-all duration-300 border border-gray-200 animate-slide-up table-row text-left w-full',
            functionality.tab 
              ? 'hover:from-purple-50 hover:to-purple-50/50 hover:border-purple-300 hover:shadow-md cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]' 
              : 'cursor-default'
          ]"
          :style="{ animationDelay: `${(index + 1) * 0.05}s` }"
        >
          <div 
            :class="[
              'flex-shrink-0 p-2 rounded-lg transition-all duration-300',
              functionality.tab 
                ? 'bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300' 
                : 'bg-gradient-to-br from-purple-100 to-purple-200'
            ]"
          >
            <span class="text-2xl">{{ functionality.icon }}</span>
          </div>
          <div class="flex-1">
            <p class="text-gray-800 font-semibold leading-relaxed" v-html="formatFunctionalityText(functionality)"></p>
            <span 
              v-if="functionality.tab" 
              class="inline-flex items-center mt-2 text-sm text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Перейти →
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Быстрый импорт -->
    <div class="card mb-8 animate-slide-up" style="animation-delay: 0.4s">
      <div class="section-header">
        <div class="section-icon bg-gradient-to-br from-indigo-500 to-purple-600">
          <span class="text-3xl">📥</span>
        </div>
        <h2 class="section-title">Быстрый импорт данных</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          @click="$emit('switch-tab', 'students')"
          class="group relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl transition-all duration-300 hover:border-blue-400 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300"></div>
          <div class="relative z-10 flex items-center space-x-4">
            <div class="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl block">👥</span>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition-colors">
                Импорт студентов
              </h3>
              <p class="text-sm text-gray-600">Загрузите файл Excel/CSV со списком студентов</p>
              <div class="mt-3 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-sm font-semibold">Импортировать →</span>
              </div>
            </div>
          </div>
        </button>

        <button
          @click="$emit('switch-tab', 'topics')"
          class="group relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl transition-all duration-300 hover:border-green-400 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300"></div>
          <div class="relative z-10 flex items-center space-x-4">
            <div class="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl block">📚</span>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">
                Импорт тем
              </h3>
              <p class="text-sm text-gray-600">Загрузите файл Excel/CSV со списком тем</p>
              <div class="mt-3 flex items-center text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-sm font-semibold">Импортировать →</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <button
        v-for="(action, index) in quickActions"
        :key="index"
        @click="$emit('switch-tab', action.tab)"
        class="card card-hover cursor-pointer group text-left relative overflow-hidden animate-slide-up"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <!-- Декоративный градиент при наведении -->
        <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-500"
             :style="{ background: action.gradient }"></div>
        
        <div class="flex items-center space-x-4 relative z-10">
          <div 
            class="p-5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            :style="{ 
              background: action.iconBg,
              boxShadow: `0 8px 20px ${action.shadow}`
            }"
          >
            <span class="text-4xl block">{{ action.icon }}</span>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-dark mb-2 group-hover:text-purple-600 transition-colors">
              {{ action.title }}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">{{ action.description }}</p>
            <div class="mt-3 flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="text-sm font-semibold">Перейти →</span>
            </div>
          </div>
        </div>
        
        <!-- Анимированная граница -->
        <div class="absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500 group-hover:w-full w-0"
             :style="{ background: action.gradient }"></div>
      </button>
    </div>

    <!-- Последние изменения -->
    <div class="card animate-slide-up" style="animation-delay: 0.6s">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold gradient-text">Последние изменения</h2>
        <button
          @click="$emit('switch-tab', 'history')"
          class="text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors flex items-center space-x-1"
        >
          <span>Все изменения</span>
          <span>→</span>
        </button>
      </div>
      <div v-if="recentHistory.length > 0" class="space-y-3">
        <div
          v-for="(item, index) in recentHistory"
          :key="item.id"
          class="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-purple-50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-purple-200 animate-slide-up table-row"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="flex items-center space-x-4 flex-1">
            <div
              class="p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md"
              :style="{
                background: item.entity_type === 'student' 
                  ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                  : item.entity_type === 'topic'
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
              }"
            >
              <span class="text-2xl block">
                {{ item.entity_type === 'student' ? '👤' : item.entity_type === 'topic' ? '📚' : '🎯' }}
              </span>
            </div>
            <div class="flex-1">
              <p class="font-bold text-gray-dark mb-1 group-hover:text-purple-600 transition-colors">
                {{ item.action }}
              </p>
              <p class="text-sm text-gray-500 flex items-center space-x-2">
                <span>{{ item.user_name }}</span>
                <span>•</span>
                <span>{{ formatDate(item.created_at) }}</span>
              </p>
            </div>
          </div>
          <span
            class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 group-hover:scale-110"
            :style="{
              background: item.user_role === 'admin'
                ? 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)'
                : 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
              color: item.user_role === 'admin' ? '#6D28D9' : '#1E40AF'
            }"
          >
            {{ item.user_role === 'admin' ? 'Админ' : 'Староста' }}
          </span>
        </div>
      </div>
      <div v-else class="text-center py-12 text-gray-400">
        <div class="text-6xl mb-4">📋</div>
        <p class="text-lg">Нет последних изменений</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../../api/axios';

defineProps({
  user: {
    type: Object,
    default: null
  }
});

defineEmits(['switch-tab']);

const stats = ref({});
const history = ref([]);

const recentHistory = computed(() => {
  return history.value.slice(0, 5);
});

const statsCards = computed(() => {
  return [
    {
      label: 'Всего студентов',
      value: stats.value.students?.total || 0,
      icon: '👥',
      gradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)',
      borderColor: '#3B82F6',
      color: '#1E40AF',
      shadow: 'rgba(59, 130, 246, 0.3)',
      description: 'Зарегистрировано в системе'
    },
    {
      label: 'Всего тем',
      value: stats.value.topics?.total || 0,
      icon: '📚',
      gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #6EE7B7 100%)',
      borderColor: '#10B981',
      color: '#059669',
      shadow: 'rgba(16, 185, 129, 0.3)',
      description: 'Курсовых и дипломных'
    },
    {
      label: 'Свободных тем',
      value: stats.value.topics?.free || 0,
      icon: '📝',
      gradient: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 50%, #C4B5FD 100%)',
      borderColor: '#8B5CF6',
      color: '#7C3AED',
      shadow: 'rgba(139, 92, 246, 0.3)',
      description: 'Доступно для выбора'
    },
    {
      label: 'Занятых тем',
      value: stats.value.topics?.occupied || 0,
      icon: '✅',
      gradient: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 50%, #FB923C 100%)',
      borderColor: '#F97316',
      color: '#EA580C',
      shadow: 'rgba(249, 115, 22, 0.3)',
      description: 'Уже назначены'
    },
    {
      label: 'Резервов',
      value: stats.value.topics?.reserved || 0,
      icon: '⏳',
      gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D 100%)',
      borderColor: '#F59E0B',
      color: '#B45309',
      shadow: 'rgba(245, 158, 11, 0.3)',
      description: 'Зарезервировано на 30 минут'
    }
  ];
});

const adminFunctions = [
  {
    icon: '📋',
    text: 'Загружает/редактирует списки тем и студентов с привязкой к группе. (Темы и студенты загружаются списочно).',
    highlight: 'списочно',
    tab: 'students' // Переход на вкладку загрузки студентов
  },
  {
    icon: '👨‍🏫',
    text: 'Назначает руководителей.',
    tab: 'supervisors' // Переход на вкладку руководителей
  },
  {
    icon: '🔄',
    text: 'Может менять закреплённую тему.',
    tab: 'distribution' // Переход на вкладку распределения тем
  },
  {
    icon: '📊',
    text: 'Может выгружать результаты.',
    tab: 'export' // Переход на вкладку экспорта
  },
  {
    icon: '📝',
    text: 'Указывает вид работы с указанием предмета по которому она пишется.',
    tab: 'topics' // Переход на вкладку загрузки тем
  },
  {
    icon: '🏛️',
    text: 'Указать Цикловую комиссию в рамках которой пишется работа.',
    highlight: 'Цикловую комиссию',
    tab: 'topics' // Переход на вкладку загрузки тем
  },
  {
    icon: '📚',
    text: 'Загрузка справочника дипломных руководителей (списочно)',
    highlight: 'списочно',
    tab: 'supervisors' // Переход на вкладку руководителей
  }
];

const formatFunctionalityText = (func) => {
  if (!func.highlight) {
    return func.text;
  }
  
  // Заменяем подчеркнутые слова на HTML с подчеркиванием
  const regex = new RegExp(`(${func.highlight})`, 'gi');
  return func.text.replace(regex, '<span class="underline decoration-purple-500 decoration-2 font-bold">$1</span>');
};

const quickActions = [
  {
    tab: 'students',
    title: 'Загрузка студентов',
    description: 'Загрузите или отредактируйте данные студентов из Excel/CSV',
    icon: '👤',
    iconBg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    shadow: 'rgba(59, 130, 246, 0.4)'
  },
  {
    tab: 'topics',
    title: 'Загрузка тем',
    description: 'Управление темами курсовых и дипломных работ',
    icon: '📖',
    iconBg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    shadow: 'rgba(16, 185, 129, 0.4)'
  },
  {
    tab: 'distribution',
    title: 'Распределение тем',
    description: 'Автоматическое или ручное распределение тем между студентами',
    icon: '🎯',
    iconBg: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    shadow: 'rgba(139, 92, 246, 0.4)'
  },
  {
    tab: 'export',
    title: 'Экспорт данных',
    description: 'Экспорт данных в Excel, CSV или PDF с фильтрами',
    icon: '📊',
    iconBg: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    shadow: 'rgba(249, 115, 22, 0.4)'
  },
  {
    tab: 'history',
    title: 'История изменений',
    description: 'Просмотр истории всех изменений в системе',
    icon: '📜',
    iconBg: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
    gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
    shadow: 'rgba(107, 114, 128, 0.4)'
  }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} дн. назад`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

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
    history.value = (response.data || []).slice(0, 10);
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
  }
};
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-md p-6;
}

/* Анимация появления с задержкой */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
}

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
</style>

