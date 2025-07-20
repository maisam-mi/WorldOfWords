import { createPinia } from 'pinia';
import { createApp } from 'vue';
import piniaPersisted from 'pinia-plugin-persistedstate';
import App from './App.vue';
import './assets/css/index.css';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersisted);
app.use(router);
app.use(pinia);
app.mount('#app');
