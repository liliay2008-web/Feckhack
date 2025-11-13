
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Auth',
    component: () => import('../views/AuthView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/starosta',
    name: 'Starosta',
    component: () => import('../views/StarostaView.vue'),
    meta: { requiresAuth: true, role: 'starosta' },
    children: [
      {
        path: 'topics',
        name: 'StarostaTopics',
        component: () => import('../components/starosta/TopicsList.vue')
      },
      {
        path: 'distribution',
        name: 'StarostaDistribution',
        component: () => import('../components/starosta/DistributionManager.vue')
      },
      {
        path: 'export',
        name: 'StarostaExport',
        component: () => import('../components/starosta/ExportManager.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Если есть токен, но пользователь не загружен, загружаем его
  if (authStore.token && !authStore.user) {
    await authStore.checkAuth();
  }

  // Если пользователь авторизован и пытается зайти на страницу авторизации, редиректим
  if (to.path === '/' && authStore.isAuthenticated && authStore.user) {
    if (authStore.user.role === 'admin') {
      next('/admin');
      return;
    } else if (authStore.user.role === 'starosta') {
      next('/starosta/topics');
      return;
    }
  }

  // Если требуется авторизация, но пользователь не авторизован
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/');
    return;
  }

  // Если указана роль, проверяем соответствие
  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Редирект на соответствующую страницу в зависимости от роли
    if (authStore.user?.role === 'admin') {
      next('/admin');
    } else if (authStore.user?.role === 'starosta') {
      next('/starosta/topics');
    } else {
      next('/');
    }
    return;
  }

  // Навигация разрешена
  next();
});

export default router;
