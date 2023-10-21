import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from './components/welcomePage.vue';
import PessoasPage from './components/pessoasPage.vue';
import ProdutosPage from './components/produtosPage.vue';
import PedidosPage from './components/pedidosPage.vue';

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/pessoas', component: PessoasPage },
  { path: '/produtos', component: ProdutosPage },
  { path: '/pedidos', component: PedidosPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
