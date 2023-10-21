import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from './components/welcomePage.vue';
import pessoasPage from './components/pessoasPage.vue';
import produtosPage from './components/produtosPage.vue';
import pedidosPage from './components/pedidosPage.vue';

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/pessoasPage', component: pessoasPage },
  { path: '/produtosPage', component: produtosPage },
  { path: '/pedidosPage', component: pedidosPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
