import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Main from './components/main/main.vue';
import Profile from './components/Profile/Profile.vue';
import Basket from './components/basket/Basket.vue';
import Address from './components/address/address.vue';
import Registration from './components/Registration/Registration.vue';
import Terms from './components/Terms/Terms.vue';
import ProductDetail from './components/ProductDetail/ProductDetail.vue';
import CardReplenishment from './components/Card replenishment/Card replenishment.vue';
import Legalinformation from './components/Legalinformation/Legalinformation.vue';
import Dataprotection from './components/Dataprotection/Dataprotection.vue';
import Guarantee from './components/Guarantee/Guarantee.vue';
import Contacts from './components/contacts/Сontacts.vue';
import Companies from './components/companies/Companies.vue';
import Delivery from './components/Delivery/Delivery.vue';
import TopBuyers from './components/TopBuyers/TopBuyers.vue';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Main },
    { path: '/Profile', component: Profile },
    { path: '/basket', component: Basket },
    { path: '/address', component: Address },
    { path: '/reg', component: Registration },
    { path: '/terms', component: Terms },
    {
      path: '/product/:id',
      name: 'ProductDetails',
      component: ProductDetail,
      props: true,
    },
    { path: '/card-replenishment', component: CardReplenishment },
    { path: '/legal-information', component: Legalinformation },
    { path: '/data-protection', component: Dataprotection },
    { path: '/Guarantee', component: Guarantee },
    { path: '/Contacts', component: Contacts },
    { path: '/companies', component: Companies },
    { path: '/delivery', component: Delivery },
    { path: '/top-buyers', component: TopBuyers },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (!savedPosition) {
      return { top: 0, behavior: 'smooth' };
    }
    return savedPosition;
  },
});

const app = createApp(App);
app.use(router);
app.use(VueSweetalert2);
app.mount('#app');