<template>
  <header class="navbar" :class="{ scrolled: isScrolled, 'nav-open': mobileMenuOpen }">
    <div class="nav-container">
      <!-- Logo -->
      <router-link to="/" class="nav-logo" id="nav-brand-logo" aria-label="Radhe Timepieces Home">
        <img src="/radhe-timepieces-logo.svg" alt="Radhe Timepieces" class="logo-img" />
      </router-link>

      <!-- Desktop Nav Links -->
      <nav class="nav-links">
        <div class="nav-item" v-for="cat in navCategories" :key="cat.label">
          <router-link :to="`/shop?category=${cat.id}`" class="nav-link">{{ cat.label }}</router-link>
        </div>
        <router-link to="/shop" class="nav-link">New Arrivals</router-link>
        <router-link to="/offers" class="nav-link nav-offer">Offers</router-link>
      </nav>

      <!-- Right Icons -->
      <div class="nav-actions">
        <!-- Search -->
        <div class="search-wrap" :class="{ active: searchOpen }">
          <input
            v-if="searchOpen"
            v-model="searchQuery"
            @input="handleSearch"
            @keydown.esc="closeSearch"
            placeholder="Search watches..."
            class="search-input"
            ref="searchInput"
            id="navbar-search-input"
          />
          <button class="icon-btn" @click="toggleSearch" id="navbar-search-btn" aria-label="Search">
            <svg v-if="!searchOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <!-- Search Results Dropdown -->
          <div class="search-dropdown" v-if="searchOpen && searchResults.length > 0">
            <div
              v-for="result in searchResults"
              :key="result.id"
              class="search-result-item"
              @click="goToProduct(result.id)"
            >
              <img :src="result.image" :alt="result.name" />
              <div>
                <p class="result-name">{{ result.name }}</p>
                <p class="result-price" v-if="!store.hidePrice && result.price > 0">₹{{ result.price.toLocaleString() }}</p>
                <p class="result-price result-price-request" v-else>✨ Price on Request</p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Account / Sign In -->
        <div class="user-wrap" v-if="authStore.currentUser">
          <button class="icon-btn user-btn" @click="userMenuOpen = !userMenuOpen" id="navbar-user-btn" :aria-label="`Logged in as ${authStore.currentUser.name}`">
            <div class="user-avatar-sm">{{ authStore.currentUser.name?.[0]?.toUpperCase() || '?' }}</div>
          </button>
          <div class="user-dropdown" v-if="userMenuOpen" @click.stop>
            <div class="ud-header">
              <div class="ud-avatar">{{ authStore.currentUser.name?.[0]?.toUpperCase() || '?' }}</div>
              <div>
                <p class="ud-name">{{ authStore.currentUser.name }}</p>
                <p class="ud-email">{{ authStore.currentUser.email }}</p>
              </div>
            </div>
            <router-link to="/checkout" class="ud-link" @click="userMenuOpen = false" id="navbar-goto-checkout-link">🛒 Go to Checkout</router-link>
            <button class="ud-link ud-logout" @click="logout" id="navbar-logout-btn">🚪 Sign Out</button>
          </div>
        </div>
        <button v-else class="icon-btn login-nav-btn" @click="authStore.openAuthModal('/')" id="navbar-login-btn" title="Sign In / Register" aria-label="Sign In or Register">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
        <button class="icon-btn" @click="toggleWishlist" id="navbar-wishlist-btn" aria-label="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="badge" v-if="store.wishlist.length">{{ store.wishlist.length }}</span>
        </button>

        <!-- Cart -->
        <button class="icon-btn cart-btn" @click="toggleCart" id="navbar-cart-btn" aria-label="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="badge" v-if="store.cartCount">{{ store.cartCount }}</span>
        </button>

        <!-- Mobile Menu Toggle -->
        <button class="icon-btn mobile-menu-btn" @click="toggleMobileMenu" aria-label="Menu" id="navbar-mobile-menu-btn">
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-down">
      <div class="mobile-menu" v-if="mobileMenuOpen">
        <router-link v-for="cat in navCategories" :key="cat.id" :to="`/shop?category=${cat.id}`" class="mobile-link" @click="mobileMenuOpen = false">
          {{ cat.label }}
        </router-link>
        <router-link to="/shop" class="mobile-link" @click="mobileMenuOpen = false">New Arrivals</router-link>
        <router-link to="/offers" class="mobile-link mobile-offer" @click="mobileMenuOpen = false">🏷️ Offers</router-link>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import { authStore } from '../store/auth'
import { products as defaultProducts } from '../data/products'

const router = useRouter()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const userMenuOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const searchInput = ref(null)

const navCategories = [
  { id: 'Men', label: "Men's" },
  { id: 'Women', label: "Women's" },
  { id: 'Classic', label: "Classic" },
  { id: 'Smart', label: 'Smart' },
  { id: 'Couple', label: 'Couples' },
  { id: 'Sport', label: 'Sport' }
]

const handleScroll = () => { isScrolled.value = window.scrollY > 60 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const logout = () => {
  authStore.logout()
  userMenuOpen.value = false
}

const toggleMobileMenu = () => { mobileMenuOpen.value = !mobileMenuOpen.value }
const toggleCart = () => { store.cartOpen = !store.cartOpen; store.wishlistOpen = false }
const toggleWishlist = () => { store.wishlistOpen = !store.wishlistOpen; store.cartOpen = false }

const toggleSearch = async () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    searchQuery.value = ''
    searchResults.value = []
  }
}
const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
}
const handleSearch = () => {
  if (!searchQuery.value.trim()) { searchResults.value = []; return }
  const allList = store.products?.length ? store.products : defaultProducts
  searchResults.value = allList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.value.toLowerCase()))
  ).slice(0, 5)
}
const goToProduct = (id) => {
  router.push(`/product/${id}`)
  closeSearch()
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(201,168,76,0.15);
  transition: all 0.3s ease;
}
.navbar.scrolled {
  background: rgba(255,255,255,0.98);
  box-shadow: 0 4px 30px rgba(0,0,0,0.08);
}
.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 72px;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-img {
  height: 54px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
  transition: transform 0.25s ease;
}
.nav-logo:hover .logo-img {
  transform: scale(1.04);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  flex: 1;
  justify-content: center;
}
.nav-link {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  font-weight: 400;
  color: #444;
  text-decoration: none;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  letter-spacing: 0.04em;
  transition: all 0.25s ease;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 50%; right: 50%;
  height: 1.5px;
  background: #C9A84C;
  transition: all 0.3s ease;
}
.nav-link:hover::after,
.router-link-active::after { left: 12px; right: 12px; }
.nav-link:hover { color: #1a1a1a; }
.nav-offer { color: #C9A84C; font-weight: 500; }
.nav-admin-pill {
  background: rgba(201, 168, 76, 0.12);
  color: #8B6914;
  border: 1px solid rgba(201, 168, 76, 0.4);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.82rem;
  margin-left: 0.4rem;
  transition: all 0.25s ease;
}
.nav-admin-pill::after { display: none; }
.nav-admin-pill:hover,
.nav-admin-pill.router-link-active {
  background: #C9A84C;
  color: #ffffff;
  border-color: #C9A84C;
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.35);
  transform: translateY(-1px);
}
.nav-actions { display: flex; align-items: center; gap: 0.25rem; }
.icon-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #333;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
}
.icon-btn:hover { background: #f5f0e8; color: #C9A84C; }
.badge {
  position: absolute;
  top: 2px; right: 2px;
  background: #C9A84C;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Jost', sans-serif;
}
.search-wrap { position: relative; display: flex; align-items: center; }
.search-input {
  border: 1px solid #e0d5c0;
  background: #faf8f4;
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #333;
  width: 220px;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #C9A84C; }
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid #e8dfc8;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  overflow: hidden;
  z-index: 999;
}
.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.search-result-item:hover { background: #faf8f4; }
.search-result-item img { width: 44px; height: 44px; object-fit: cover; border-radius: 8px; }
.result-name { font-family: 'Jost', sans-serif; font-size: 0.85rem; color: #222; margin: 0; }
.result-price { font-family: 'Jost', sans-serif; font-size: 0.8rem; color: #C9A84C; margin: 0; font-weight: 500; }
.mobile-menu-btn { display: none; }
.mobile-menu {
  background: #fff;
  border-top: 1px solid #f0e8d8;
  padding: 1rem 1.5rem 1.5rem;
  display: flex; flex-direction: column; gap: 0.25rem;
}
.mobile-link {
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  color: #444;
  text-decoration: none;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #f5f0e8;
  transition: color 0.2s;
}
.mobile-link:hover { color: #C9A84C; }
.mobile-offer { color: #C9A84C; font-weight: 500; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 900px) {
  .nav-links { display: none; }
  .mobile-menu-btn { display: flex; }
}
@media (max-width: 480px) {
  .nav-container { padding: 0 1rem; }
  .logo-tagline { display: none; }
}
</style>
