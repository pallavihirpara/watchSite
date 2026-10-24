<template>
  <NavBar />
  <CartPanel />
  <AuthModal />

  <!-- Global Toast -->
  <transition name="toast-slide">
    <div class="toast-notification" :class="store.toastType" v-if="store.toastMessage">
      <span class="toast-text">{{ store.toastMessage }}</span>
    </div>
  </transition>

  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <SiteFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import CartPanel from './components/CartPanel.vue'
import AuthModal from './components/AuthModal.vue'
import SiteFooter from './components/SiteFooter.vue'
import { authStore } from './store/auth'
import { store } from './store'

// Restore logged-in user, favorites and products from MySQL DB on load
onMounted(() => {
  authStore.init()
  store.fetchProducts()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: 'Jost', sans-serif;
  background: #ffffff;
  color: #1a1a1a;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f5f5f5; }
::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #8B6914; }

a { color: inherit; text-decoration: none; }
button { font-family: 'Jost', sans-serif; cursor: pointer; }
img { max-width: 100%; height: auto; }

.page-fade-enter-active,
.page-fade-leave-active { transition: opacity 0.25s ease; }
.page-fade-enter-from,
.page-fade-leave-to { opacity: 0; }

.container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
::selection { background: rgba(201, 168, 76, 0.2); color: #1a1a1a; }

/* Global Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #1a1714;
  color: #fff;
  padding: 0.9rem 1.4rem;
  border-radius: 12px;
  border-left: 4px solid #C9A84C;
  box-shadow: 0 16px 36px rgba(0,0,0,0.22), 0 0 0 1px rgba(201,168,76,0.25);
  font-family: 'Jost', sans-serif;
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.toast-notification.success {
  border-left-color: #C9A84C;
}
.toast-notification.info {
  border-left-color: #6366f1;
}

.toast-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-slide-leave-active {
  transition: all 0.25s ease-in;
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
