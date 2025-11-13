import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';
import 'animate.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);
const pinia = createPinia();

// Регистрация иконок Element Plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
app.use(router);
app.use(ElementPlus);

// Глобальная обработка ошибок
app.config.errorHandler = (err, instance, info) => {
  console.error('Глобальная ошибка Vue:', err);
  console.error('Информация:', info);
  console.error('Компонент:', instance);
};

app.mount('#app');
