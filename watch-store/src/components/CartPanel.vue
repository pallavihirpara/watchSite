<template>
  <!-- Cart Sidebar -->
  <teleport to="body">
    <transition name="fade">
      <div class="overlay" v-if="store.cartOpen || store.wishlistOpen" @click="closeAll"></div>
    </transition>

    <!-- Cart Panel -->
    <transition name="slide-right">
      <div class="panel" v-if="store.cartOpen" id="cart-panel">
        <div class="panel-header">
          <h2>Shopping Cart <span class="count-badge" v-if="store.cartCount">{{ store.cartCount }}</span></h2>
          <button class="close-btn" @click="store.cartOpen = false" id="cart-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="panel-body" v-if="store.cart.length">
          <div class="cart-item" v-for="item in store.cart" :key="item.id">
            <img :src="item.image" :alt="item.name" class="item-img" />
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="item-price" v-if="!store.hidePrice && item.price > 0">₹{{ (item.price * item.qty).toLocaleString() }}</p>
              <p class="item-price item-price-request" v-else>✨ Price on Request</p>
              <div class="qty-controls">
                <button type="button" @click="store.updateQty(item.id, item.qty - 1)" id="cart-qty-minus" aria-label="Decrease quantity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span class="qty-num">{{ item.qty }}</span>
                <button type="button" @click="store.updateQty(item.id, item.qty + 1)" id="cart-qty-plus" aria-label="Increase quantity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
            <button class="remove-btn" @click="store.removeFromCart(item.id)" id="cart-remove-btn" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">🛍️</div>
          <p>Your cart is empty</p>
          <button class="explore-btn" @click="store.cartOpen = false; $router.push('/shop')" id="cart-explore-btn">Explore Watches</button>
        </div>

        <div class="panel-footer" v-if="store.cart.length">
          <div class="total-row">
            <span>Subtotal</span>
            <strong v-if="!store.hidePrice && store.cartTotal > 0">₹{{ store.cartTotal.toLocaleString() }}</strong>
            <strong v-else class="total-request">Pricing on Request</strong>
          </div>
          <p class="free-shipping">✓ Insured Express Delivery included</p>
          <button class="checkout-btn" id="cart-checkout-btn" @click="handleCheckout">
            {{ store.hidePrice ? 'Proceed with Order Enquiry →' : 'Proceed to Checkout →' }}
          </button>
        </div>
      </div>
    </transition>

    <!-- Wishlist Panel -->
    <transition name="slide-right">
      <div class="panel" v-if="store.wishlistOpen" id="wishlist-panel">
        <div class="panel-header">
          <h2>Wishlist <span class="count-badge" v-if="store.wishlist.length">{{ store.wishlist.length }}</span></h2>
          <button class="close-btn" @click="store.wishlistOpen = false" id="wishlist-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="panel-body" v-if="store.wishlist.length">
          <div class="cart-item" v-for="item in store.wishlist" :key="item.id">
            <img :src="item.image" :alt="item.name" class="item-img" />
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="item-price" v-if="!store.hidePrice && item.price > 0">₹{{ item.price.toLocaleString() }}</p>
              <p class="item-price item-price-request" v-else>✨ Price on Request</p>
              <button class="add-cart-btn" @click="moveToCart(item)" id="wishlist-add-to-cart-btn">Add to Cart</button>
            </div>
            <button class="remove-btn" @click="store.toggleWishlist(item)" aria-label="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">💛</div>
          <p>Your wishlist is empty</p>
          <button class="explore-btn" @click="store.wishlistOpen = false; $router.push('/shop')" id="wishlist-explore-btn">Explore Watches</button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { store } from '../store'
import { authStore } from '../store/auth'

const router = useRouter()
const closeAll = () => { store.cartOpen = false; store.wishlistOpen = false }
const moveToCart = (item) => {
  store.addToCart(item)
  store.toggleWishlist(item)
}

const handleCheckout = () => {
  store.cartOpen = false
  if (authStore.currentUser) {
    // Already logged in → go straight to checkout
    router.push('/checkout')
  } else {
    // Not logged in → open auth modal, then redirect to checkout
    authStore.openAuthModal('/checkout')
  }
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1100;
  backdrop-filter: blur(2px);
}
.panel {
  position: fixed;
  top: 0; right: 0;
  width: min(420px, 100vw);
  height: 100vh;
  background: #fff;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.12);
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #f0e8d8;
}
.panel-header h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.count-badge {
  background: #C9A84C;
  color: #fff;
  font-size: 0.7rem;
  font-family: 'Jost', sans-serif;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  font-weight: 600;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.4rem;
  border-radius: 8px;
  display: flex;
  transition: all 0.2s;
}
.close-btn:hover { background: #f5f0e8; color: #C9A84C; }
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.cart-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #f0e8d8;
  border-radius: 12px;
  position: relative;
  transition: box-shadow 0.2s;
}
.cart-item:hover { box-shadow: 0 4px 16px rgba(201,168,76,0.1); }
.item-img { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
.item-info { flex: 1; }
.item-info h4 {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #222;
  margin: 0 0 0.3rem;
}
.item-price {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #C9A84C;
  margin: 0 0 0.6rem;
}
.qty-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.qty-controls button {
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  padding: 0 !important;
  margin: 0;
  border: 1px solid #e0d5c0;
  background: #faf8f4;
  border-radius: 6px;
  cursor: pointer;
  color: #444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  line-height: 1;
  transition: all 0.2s ease;
}
.qty-controls button svg {
  display: block;
  pointer-events: none;
}
.qty-controls button:hover {
  border-color: #C9A84C;
  color: #C9A84C;
  background: #ffffff;
}
.qty-controls .qty-num {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.remove-btn {
  position: absolute;
  top: 0.75rem; right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #bbb;
  padding: 0.2rem;
  transition: color 0.2s;
}
.remove-btn:hover { color: #e74c3c; }
.add-cart-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-cart-btn:hover { background: #C9A84C; }
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #888;
  font-family: 'Jost', sans-serif;
}
.empty-icon { font-size: 3rem; }
.explore-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}
.explore-btn:hover { background: #C9A84C; }
.panel-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #f0e8d8;
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.total-row strong { font-size: 1.15rem; color: #1a1a1a; }
.free-shipping { font-family: 'Jost', sans-serif; font-size: 0.8rem; color: #27ae60; margin: 0 0 1rem; }
.free-shipping-hint { font-family: 'Jost', sans-serif; font-size: 0.78rem; color: #888; margin: 0 0 1rem; }
.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: opacity 0.2s, transform 0.2s;
}
.checkout-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>
