import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

// Используем относительный путь для работы с Vite proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);

  const isAuthenticated = computed(() => !!token.value);

  // Установка токена
  const setToken = (newToken) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Установка пользователя
  const setUser = (userData) => {
    user.value = userData;
  };

  // Регистрация
  const register = async (userData) => {
    try {
      console.log('Отправка запроса на регистрацию:', { ...userData, password: '***' });
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Ответ сервера:', {
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        userRole: response.data.user?.role
      });

      setToken(response.data.token);
      setUser(response.data.user);

      // Принудительно обновляем computed для реактивности
      await new Promise(resolve => setTimeout(resolve, 0));

      console.log('Токен и пользователь установлены:', {
        token: !!token.value,
        user: !!user.value,
        userRole: user.value?.role,
        isAuthenticated: isAuthenticated.value
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Ошибка регистрации в store:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: userData
      });

      // Более детальное извлечение ошибки
      let errorMessage = 'Ошибка регистрации';

      if (error.response) {
        // Ошибка от сервера
        const status = error.response.status;
        const data = error.response.data;

        if (status === 500) {
          // Внутренняя ошибка сервера - показываем детали если есть
          errorMessage = data?.error || 'Внутренняя ошибка сервера. Попробуйте еще раз или обратитесь к администратору.';
          // Всегда логируем детали для отладки
          if (data?.details) {
            console.error('Детали ошибки 500:', data.details);
            // Если есть детали, добавляем их к сообщению в режиме разработки
            if (import.meta.env.DEV && data.details.message) {
              errorMessage += ` (${data.details.message})`;
            }
          }
        } else if (status === 400) {
          // Ошибка валидации
          errorMessage = data?.error || 'Ошибка валидации данных. Проверьте введенные данные.';
          // Если есть детали, показываем их
          if (data?.details) {
            const detailMessages = Object.entries(data.details)
              .filter(([_, value]) => value)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
            if (detailMessages) {
              errorMessage += ` (${detailMessages})`;
            }
          }
        } else {
          // Другие ошибки
          errorMessage = data?.error || data?.message || errorMessage;
        }

        // Логируем полный ответ для отладки
        console.error('=== ОТВЕТ СЕРВЕРА ===');
        console.error('Status:', status);
        console.error('Data:', data);
        console.error('Details:', data?.details);
        if (data?.details) {
          console.error('Детали ошибки:', JSON.stringify(data.details, null, 2));
        }
      } else if (error.request) {
        // Запрос отправлен, но ответа нет
        errorMessage = 'Не удалось подключиться к серверу. Проверьте подключение к интернету.';
      } else if (error.message) {
        // Ошибка при настройке запроса
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  // Авторизация
  const login = async (login, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { login, password });
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Ошибка авторизации' };
    }
  };

  // Выход
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Проверка авторизации
  const checkAuth = async () => {
    if (!token.value) return;

    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      setToken(null);
      setUser(null);
      return { success: false };
    }
  };

  // Инициализация axios с токеном
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    checkAuth,
    setToken,
    setUser
  };
});
