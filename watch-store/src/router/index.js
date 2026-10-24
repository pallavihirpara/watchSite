import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authStore } from '../store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/shop', name: 'shop', component: () => import('../views/ShopView.vue') },
    { path: '/product/:id', name: 'product', component: () => import('../views/ProductView.vue') },
    { path: '/offers', name: 'offers', component: () => import('../views/OffersView.vue') },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('../views/PaymentView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// Guard: protected routes → must be logged in
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.currentUser) {
    authStore.openAuthModal(to.fullPath)
    return false // cancel navigation; modal will redirect after login
  }
})

export default router
