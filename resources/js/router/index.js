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
    },
    { path: '/terms', name: 'terms', component: () => import('../views/TermsView.vue') },
    { path: '/terms-of-use', redirect: '/terms' },
    { path: '/privacy', name: 'privacy', component: () => import('../views/PrivacyView.vue') },
    { path: '/privacy-policy', redirect: '/privacy' },
    { path: '/customer-care', name: 'customer-care', component: () => import('../views/CustomerCareView.vue') },
    { path: '/track-order', redirect: '/customer-care?tab=track' },
    { path: '/returns', redirect: '/customer-care?tab=returns' },
    { path: '/care-guide', redirect: '/customer-care?tab=care' },
    { path: '/store-locator', redirect: '/customer-care?tab=locator' },
    { path: '/contact', redirect: '/customer-care?tab=contact' },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/craftsmen', redirect: '/about?section=craftsmen' },
    { path: '/sustainability', redirect: '/about?section=sustainability' },
    { path: '/press', redirect: '/about?section=press' },
    { path: '/careers', redirect: '/about?section=careers' },
    { path: '/blog', redirect: '/about?section=blog' }
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
