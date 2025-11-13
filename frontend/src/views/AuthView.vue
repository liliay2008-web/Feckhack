<template>
  <div class="min-h-screen flex items-center justify-start p-4 relative overflow-hidden">
    <!-- Красивый анимированный фон -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Градиентный фон -->
      <div class="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 via-pink-500 to-cyan-500 opacity-90"></div>
      
      <!-- Плавающие blob элементы -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      <div class="absolute top-20 right-1/4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
      <div class="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-8000"></div>
      
      <!-- Дополнительные световые эффекты -->
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/20 to-transparent"></div>
      
      <!-- Опциональное фоновое изображение (если есть) -->
      <div 
        v-if="backgroundStyle.backgroundImage"
        class="absolute inset-0 opacity-20"
        :style="{
          backgroundImage: backgroundStyle.backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'overlay'
        }"
      ></div>
    </div>
    <div class="w-full max-w-md relative z-10 ml-8 lg:ml-16" style="z-index: 10;">
      <!-- Форма регистрации со стеклянным эффектом -->
      <div class="rounded-3xl p-8 lg:p-10 shadow-2xl animate-fade-in w-full relative overflow-hidden" style="
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 2px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.3);
        box-sizing: border-box;
        z-index: 100;
      ">
        <!-- Дополнительный слой для эффекта стекла -->
        <div class="absolute inset-0 bg-gradient-to-br from-white/2 via-white/1 to-transparent pointer-events-none" style="border-radius: 1.5rem;"></div>
        <!-- Рефлекс на стекле -->
        <div class="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-3xl"></div>
        
        <!-- Контент формы -->
        <div class="relative z-10">
          <h1 class="text-3xl font-bold mb-8 text-center" style="color: #1a1a1a; font-family: sans-serif; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.2);">
            {{ isLogin ? 'Вход в систему' : 'Регистрация' }}
          </h1>
          
          <!-- Переключатель ролей -->
          <div class="mb-8 p-1 rounded-lg relative overflow-hidden" style="
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 2px solid rgba(139, 92, 246, 0.3);
            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(139, 92, 246, 0.1);
          ">
          <div class="relative flex">
            <!-- Скользящий индикатор -->
            <div 
              class="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-in-out"
              :style="{
                left: currentRole === 'admin' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)',
                background: 'linear-gradient(135deg, #5C2D91 0%, #7B2FA2 100%)',
                boxShadow: '0 4px 15px rgba(92, 45, 145, 0.4)',
                zIndex: 0
              }"
            ></div>
            
            <!-- Кнопка Администратор -->
            <button
              @click="currentRole = 'admin'"
              type="button"
              class="relative flex-1 py-3 px-4 rounded-lg font-semibold transition-colors duration-300 z-10"
              :style="{
                color: currentRole === 'admin' ? '#FFFFFF' : '#1a1a1a',
                backgroundColor: 'transparent',
                fontFamily: 'sans-serif',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                textShadow: currentRole === 'admin' ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1)'
              }"
            >
              Администратор
            </button>
            
            <!-- Кнопка Староста -->
            <button
              @click="currentRole = 'starosta'"
              type="button"
              class="relative flex-1 py-3 px-4 rounded-lg font-semibold transition-colors duration-300 z-10"
              :style="{
                color: currentRole === 'starosta' ? '#FFFFFF' : '#1a1a1a',
                backgroundColor: 'transparent',
                fontFamily: 'sans-serif',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                textShadow: currentRole === 'starosta' ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1)'
              }"
            >
              Староста
            </button>
          </div>
        </div>

          <!-- Форма регистрации -->
          <form @submit.prevent="handleSubmit" class="space-y-5" v-if="!isLogin">
            <div class="flex items-center gap-4">
              <label for="full_name" class="font-medium flex-shrink-0 text-left" style="color: #1a1a1a; min-width: 120px; font-family: sans-serif; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1);">ФИО:</label>
              <input
                id="full_name"
                v-model="formData.full_name"
                type="text"
                required
                class="flex-1 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
                style="
                  background: rgba(255, 255, 255, 0.9);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                  border: 2px solid rgba(139, 92, 246, 0.3);
                  font-family: sans-serif;
                  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(139, 92, 246, 0.1);
                  color: #1a1a1a;
                "
                placeholder="Введите ФИО"
              />
            </div>

            <div class="flex items-center gap-4">
              <label for="email" class="font-medium flex-shrink-0 text-left" style="color: #1a1a1a; min-width: 120px; font-family: sans-serif; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1);">Email:</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="flex-1 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
                style="
                  background: rgba(255, 255, 255, 0.9);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                  border: 2px solid rgba(139, 92, 246, 0.3);
                  font-family: sans-serif;
                  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(139, 92, 246, 0.1);
                  color: #1a1a1a;
                "
                placeholder="Введите email"
              />
            </div>

            <div class="flex items-center gap-4">
              <label for="login" class="font-medium flex-shrink-0 text-left" style="color: #1a1a1a; min-width: 120px; font-family: sans-serif; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1);">Логин:</label>
              <input
                id="login"
                v-model="formData.login"
                type="text"
                required
                class="flex-1 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
                style="
                  background: rgba(255, 255, 255, 0.9);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                  border: 2px solid rgba(139, 92, 246, 0.3);
                  font-family: sans-serif;
                  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(139, 92, 246, 0.1);
                  color: #1a1a1a;
                "
                placeholder="Введите логин"
              />
            </div>

            <div class="flex items-center gap-4">
              <label for="password" class="font-medium flex-shrink-0 text-left" style="color: #1a1a1a; min-width: 120px; font-family: sans-serif; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1);">Пароль:</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                required
                class="flex-1 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
                style="
                  background: rgba(255, 255, 255, 0.9);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                  border: 2px solid rgba(139, 92, 246, 0.3);
                  font-family: sans-serif;
                  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(139, 92, 246, 0.1);
                  color: #1a1a1a;
                "
                placeholder="Введите пароль"
              />
            </div>

            <div v-if="currentRole === 'starosta'" class="flex items-center gap-4">
              <label for="groups" class="font-medium flex-shrink-0 text-left" style="color: #1a1a1a; min-width: 120px; font-family: sans-serif; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1);">Выберите группу:</label>
              <div class="flex-1 min-w-0 overflow-hidden">
                <el-select
                  id="groups"
                  v-model="formData.groups"
                  placeholder="Выберите группу"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="group in availableGroups"
                    :key="group"
                    :label="group"
                    :value="group"
                  />
                </el-select>
              </div>
            </div>

            <button
              type="button"
              @click.prevent="handleSubmit"
              class="w-full py-3.5 text-lg font-bold text-white rounded-lg transition-all duration-300 hover:opacity-90 mt-6"
              style="
                background: linear-gradient(135deg, #5C2D91 0%, #7B2FA2 100%);
                box-shadow: 0 4px 15px rgba(92, 45, 145, 0.4);
                font-family: sans-serif;
                letter-spacing: 0.5px;
              "
              :disabled="loading"
            >
              {{ loading ? 'Загрузка...' : 'ЗАРЕГИСТРИРОВАТЬСЯ' }}
            </button>
          </form>

          <!-- Форма авторизации -->
          <form @submit.prevent="handleLogin" class="space-y-5" v-else>
            <div class="flex items-center gap-4">
              <label for="login_email" class="font-medium flex-shrink-0 text-left" style="color: #1a1a1a; min-width: 140px; font-family: sans-serif; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1);">Логин или Email:</label>
              <input
                id="login_email"
                v-model="loginData.login"
                type="text"
                required
                class="flex-1 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
                style="
                  background: rgba(255, 255, 255, 0.9);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                  border: 2px solid rgba(139, 92, 246, 0.3);
                  font-family: sans-serif;
                  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(139, 92, 246, 0.1);
                  color: #1a1a1a;
                "
                placeholder="Введите логин или email"
              />
            </div>

            <div class="flex items-center gap-4">
              <label for="login_password" class="font-medium flex-shrink-0 text-left" style="color: #1a1a1a; min-width: 140px; font-family: sans-serif; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1);">Пароль:</label>
              <input
                id="login_password"
                v-model="loginData.password"
                type="password"
                required
                class="flex-1 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-0"
                style="
                  background: rgba(255, 255, 255, 0.9);
                  backdrop-filter: blur(10px);
                  -webkit-backdrop-filter: blur(10px);
                  border: 2px solid rgba(139, 92, 246, 0.3);
                  font-family: sans-serif;
                  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(139, 92, 246, 0.1);
                  color: #1a1a1a;
                "
                placeholder="Введите пароль"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3.5 text-lg font-bold text-white rounded-lg transition-all duration-300 hover:opacity-90 mt-6"
              style="
                background: linear-gradient(135deg, #5C2D91 0%, #7B2FA2 100%);
                box-shadow: 0 4px 15px rgba(92, 45, 145, 0.4);
                font-family: sans-serif;
                letter-spacing: 0.5px;
              "
              :disabled="loading"
            >
              {{ loading ? 'Загрузка...' : 'ВОЙТИ' }}
            </button>
          </form>

          <!-- Переключение между регистрацией и авторизацией -->
          <div class="mt-6 text-center">
            <button
              @click="isLogin = !isLogin"
              type="button"
              class="transition-colors duration-300"
              style="font-family: sans-serif;"
            >
              <span v-if="!isLogin" style="color: #1a1a1a; font-weight: 600; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.2);">Уже есть аккаунт? </span>
              <span v-else style="color: #1a1a1a; font-weight: 600; text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.2);">Нет аккаунта? </span>
              <span class="underline font-semibold" style="color: #9C27B0;">
                {{ isLogin ? 'Зарегистрироваться' : 'Войти' }}
              </span>
            </button>
          </div>

          <!-- Сообщение об ошибке -->
          <div v-if="error" class="mt-4 p-4 bg-red-100/90 border-2 border-red-500 text-red-800 rounded-lg backdrop-blur-sm shadow-lg" style="font-family: sans-serif;">
            <div class="flex items-start">
              <span class="text-red-600 mr-2 text-xl">⚠️</span>
              <div class="flex-1">
                <p class="font-semibold mb-1">Ошибка регистрации</p>
                <p class="text-sm">{{ error }}</p>
              </div>
              <button 
                @click="error = ''" 
                class="text-red-600 hover:text-red-800 ml-2"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const router = useRouter();
const authStore = useAuthStore();

// Стиль фонового изображения (опционально)
const backgroundStyle = computed(() => {
  // Можно использовать фоновое изображение, если оно есть
  // return {
  //   backgroundImage: 'url(/images/back.png)',
  // };
  return {};
});

const isLogin = ref(false);
const currentRole = ref('admin');
const loading = ref(false);
const error = ref('');

const formData = reactive({
  full_name: '',
  email: '',
  login: '',
  password: '',
  role: 'admin',
  groups: null
});

const loginData = reactive({
  login: '',
  password: ''
});

const availableGroups = ref([
  'ИС-101', 'ИС-102', 'ИС-103', 'ИС-104', 'ИС-105', 'ИС-106', 'ИС-107', 'ИС-111', 'ИС-112',
  'ИС-201', 'ИС-202', 'ИС-203', 'ИС-204', 'ИС-205', 'ИС-211', 'ИС-212',
  'ИС-301', 'ИС-302', 'ИС-303', 'ИС-304', 'ИС-305', 'ИС-311', 'ИС-312',
  'ИС-401', 'ИС-402', 'ИС-403',
  'Б-101', 'Б-102', 'Б-111',
  'Б-201', 'Б-202', 'Б-203', 'Б-211',
  'Б-301',
  'БД-101', 'БД-102', 'БД-111',
  'БД-201', 'БД-202', 'БД-203', 'БД-211',
  'БД-301', 'БД-302',
  'ТОР-101', 'ТОР-102', 'ТОР-103', 'ТОР-111',
  'ТОР-201', 'ТОР-202', 'ТОР-203', 'ТОР-211',
  'К-301', 'К-302', 'К-303',
  'Ф-101', 'Ф-102', 'Ф-103', 'Ф-104', 'Ф-105', 'Ф-106', 'Ф-111',
  'Ф-201', 'Ф-202', 'Ф-203', 'Ф-204', 'Ф-211', 'Ф-212',
  'Ф-301', 'Ф-302', 'Ф-303', 'Ф-304',
  'ЮР-101', 'ЮР-102', 'ЮР-103', 'ЮР-104', 'ЮР-105', 'ЮР-106', 'ЮР-107', 'ЮР-108', 'ЮР-109', 'ЮР-111', 'ЮР-112',
  'ЮР-201', 'ЮР-202', 'ЮР-203', 'ЮР-204', 'ЮР-205', 'ЮР-206', 'ЮР-207', 'ЮР-208', 'ЮР-211', 'ЮР-212',
  'П-301', 'П-302', 'П-303', 'П-304', 'П-305', 'П-306', 'П-307'
]);

watch(currentRole, (newRole) => {
  formData.role = newRole;
  // Очищаем группы при смене роли
  formData.groups = null;
});

const handleSubmit = async (event) => {
  // Предотвращаем стандартную отправку формы
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  loading.value = true;
  error.value = '';

  try {
    // Валидация обязательных полей
    if (!formData.full_name || !formData.email || !formData.login || !formData.password) {
      error.value = 'Заполните все обязательные поля';
      loading.value = false;
      return;
    }

    // Валидация email (более строгая)
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      error.value = `Введите корректный email адрес (например: example@gmail.com). Текущее значение: "${trimmedEmail}"`;
      loading.value = false;
      return;
    }

    // Проверка минимальной длины пароля
    if (formData.password.length < 6) {
      error.value = 'Пароль должен содержать минимум 6 символов';
      loading.value = false;
      return;
    }

    // Проверка длины логина
    if (formData.login.trim().length < 3) {
      error.value = 'Логин должен содержать минимум 3 символа';
      loading.value = false;
      return;
    }

    // Подготовка данных для отправки
    const dataToSend = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      login: formData.login.trim(),
      password: formData.password,
      role: currentRole.value
    };

    // Обработка групп в зависимости от роли
    if (currentRole.value === 'starosta') {
      // Для старосты - обязательно одна группа
      if (!formData.groups) {
        error.value = 'Выберите группу для старосты';
        loading.value = false;
        return;
      }
      // Для старосты - одна группа в массиве
      dataToSend.groups = [formData.groups];
    } else {
      // Для админа группы не нужны - явно не отправляем
      dataToSend.groups = null;
    }

    console.log('Отправка данных регистрации:', { ...dataToSend, password: '***' });

    try {
      console.log('Начало регистрации, данные:', { ...dataToSend, password: '***' });
      const result = await authStore.register(dataToSend);
      
      console.log('Результат регистрации:', {
        success: result.success,
        hasData: !!result.data,
        hasError: !!result.error,
        user: result.data?.user,
        role: result.data?.user?.role
      });

      if (result.success) {
        // Используем роль из ответа сервера
        const userRole = result.data?.user?.role || currentRole.value;
        
        console.log('✅ Регистрация успешна, роль:', userRole);
        console.log('✅ Токен установлен:', !!authStore.token);
        console.log('✅ Пользователь установлен:', !!authStore.user);
        
        // Убеждаемся, что токен и пользователь установлены
        if (!authStore.token || !authStore.user) {
          console.error('❌ Токен или пользователь не установлены!');
          error.value = 'Ошибка: данные пользователя не были сохранены. Попробуйте войти.';
          loading.value = false;
          return;
        }
        
        // Очищаем форму после успешной регистрации
        formData.full_name = '';
        formData.email = '';
        formData.login = '';
        formData.password = '';
        formData.groups = null;
        error.value = '';
        
        // Сбрасываем loading перед редиректом
        loading.value = false;
        
        // Небольшая задержка для гарантии, что store обновлен
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Редирект через router
        try {
          if (userRole === 'admin') {
            console.log('🔄 Редирект администратора на /admin');
            await router.push('/admin');
          } else if (userRole === 'starosta') {
            console.log('🔄 Редирект старосты на /starosta/topics');
            await router.push('/starosta/topics');
          } else {
            console.error('❌ Неизвестная роль:', userRole);
            error.value = 'Ошибка: неизвестная роль пользователя';
          }
        } catch (routerError) {
          console.error('Ошибка редиректа:', routerError);
          // Если редирект не сработал, пробуем через window.location
          if (userRole === 'admin') {
            window.location.href = '/admin';
          } else if (userRole === 'starosta') {
            window.location.href = '/starosta/topics';
          }
        }
      } else {
        // Более детальное отображение ошибки
        const errorMsg = result.error || 'Ошибка регистрации. Проверьте введенные данные.';
        error.value = errorMsg;
        loading.value = false;
        console.error('Ошибка регистрации (детали):', {
          error: result.error,
          fullError: result,
          data: dataToSend,
          role: currentRole.value
        });
      }
    } catch (storeError) {
      // Если store вернул ошибку, но не выбросил исключение
      console.error('Ошибка в store:', storeError);
      error.value = storeError?.error || storeError?.message || 'Ошибка регистрации. Попробуйте еще раз.';
      loading.value = false;
    }
  } catch (err) {
    console.error('Исключение при регистрации:', err);
    // Более детальная обработка ошибок
    let errorMessage = 'Ошибка регистрации. Попробуйте еще раз.';
    
    if (err.response) {
      // Ошибка от сервера
      errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      if (err.response.data?.details) {
        console.error('Детали ошибки:', err.response.data.details);
      }
    } else if (err.request) {
      // Запрос отправлен, но ответа нет
      errorMessage = 'Не удалось подключиться к серверу. Проверьте подключение к интернету.';
    } else {
      // Ошибка при настройке запроса
      errorMessage = err.message || errorMessage;
    }
    
    error.value = errorMessage;
    loading.value = false;
  }
};

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const result = await authStore.login(loginData.login, loginData.password);

    if (result.success) {
      // Сбрасываем loading перед редиректом
      loading.value = false;
      
      // Небольшая задержка для гарантии, что store обновлен
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Редирект на соответствующую страницу через router
      const userRole = result.data.user.role;
      try {
        if (userRole === 'admin') {
          await router.push('/admin');
        } else if (userRole === 'starosta') {
          await router.push('/starosta/topics');
        }
      } catch (routerError) {
        console.error('Ошибка редиректа:', routerError);
        // Если редирект не сработал, пробуем через window.location
        if (userRole === 'admin') {
          window.location.href = '/admin';
        } else if (userRole === 'starosta') {
          window.location.href = '/starosta/topics';
        }
      }
    } else {
      error.value = result.error;
      loading.value = false;
    }
  } catch (err) {
    error.value = 'Ошибка авторизации';
    loading.value = false;
  }
};

// Группы фиксированные

// Группы фиксированные, не загружаем
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(50px, -80px) scale(1.15) rotate(90deg);
  }
  50% {
    transform: translate(-40px, 40px) scale(0.95) rotate(180deg);
  }
  75% {
    transform: translate(30px, 60px) scale(1.05) rotate(270deg);
  }
}

.animate-blob {
  animation: blob 8s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animation-delay-6000 {
  animation-delay: 6s;
}

.animation-delay-8000 {
  animation-delay: 8s;
}

.background-container {
  position: relative;
  min-height: 100vh;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: high-quality;
}

/* Анимация появления */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Оптимизация для мобильных устройств */
@media (max-width: 768px) {
  .background-container {
    background-attachment: scroll !important;
  }
}
</style>
