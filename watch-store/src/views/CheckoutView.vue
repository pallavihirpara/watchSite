<template>
  <div class="checkout-page" id="checkout-page">
    <!-- Header -->
    <div class="checkout-header">
      <router-link to="/" class="checkout-logo">⌚ <span>LUXORIA</span></router-link>
      <div class="checkout-steps">
        <div class="step active">
          <span class="step-num">1</span> Cart
        </div>
        <div class="step-line active"></div>
        <div class="step active">
          <span class="step-num">2</span> Checkout
        </div>
        <div class="step-line"></div>
        <div class="step">
          <span class="step-num">3</span> Payment
        </div>
      </div>
    </div>

    <div class="checkout-layout">
      <!-- Left: Form -->
      <div class="checkout-form-section">

        <!-- Logged in user tag -->
        <div class="user-tag" v-if="authStore.currentUser">
          <div class="user-tag-avatar">{{ authStore.currentUser.name?.[0]?.toUpperCase() || '?' }}</div>
          <div>
            <p class="user-tag-name">{{ authStore.currentUser.name }}</p>
            <p class="user-tag-email">{{ authStore.currentUser.email }}</p>
          </div>
          <button class="change-user-btn" @click="authStore.logout(); $router.push('/')" id="checkout-logout-btn">
            Not you?
          </button>
        </div>

        <form @submit.prevent="proceedToPayment" id="checkout-form">
          <!-- Delivery Address -->
          <div class="form-section">
            <h3><span class="section-num">📦</span> Delivery Address</h3>
            <div class="form-grid">
              <div class="form-group full">
                <label for="addr-name">Full Name *</label>
                <input id="addr-name" v-model="form.name" type="text" placeholder="Enter your full name" required />
              </div>
              <div class="form-group">
                <label for="addr-phone">Phone *</label>
                <input id="addr-phone" v-model="form.phone" type="tel" placeholder="Enter 10-digit mobile number" required />
              </div>
              <div class="form-group">
                <label for="addr-email">Email *</label>
                <input id="addr-email" v-model="form.email" type="email" placeholder="Enter your email address" required />
              </div>
              <div class="form-group full">
                <label for="addr-line1">Address Line 1 *</label>
                <input id="addr-line1" v-model="form.address1" type="text" placeholder="Flat, House no., Building, Street" required />
              </div>
              <div class="form-group full">
                <label for="addr-line2">Address Line 2</label>
                <input id="addr-line2" v-model="form.address2" type="text" placeholder="Area, Colony, Landmark (optional)" />
              </div>
              <div class="form-group">
                <label for="addr-city">City *</label>
                <input id="addr-city" v-model="form.city" type="text" placeholder="Enter city" required />
              </div>
              <div class="form-group">
                <label for="addr-state">State *</label>
                <select id="addr-state" v-model="form.state" required>
                  <option value="">Select State</option>
                  <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="addr-pin">PIN Code *</label>
                <input id="addr-pin" v-model="form.pin" type="text" placeholder="Enter 6-digit PIN code" required maxlength="6" pattern="[0-9]{6}" />
              </div>
              <div class="form-group">
                <label for="addr-country">Country</label>
                <input id="addr-country" value="India" disabled class="input-disabled" />
              </div>
            </div>
          </div>

          <!-- Delivery Method -->
          <div class="form-section">
            <h3><span class="section-num">🚚</span> Delivery Method</h3>
            <div class="delivery-options">
              <label class="delivery-option" :class="{ selected: form.delivery === 'standard' }" for="del-standard">
                <input type="radio" id="del-standard" name="delivery" value="standard" v-model="form.delivery" />
                <div class="del-info">
                  <strong>Standard Delivery</strong>
                  <span>3–5 Business Days</span>
                </div>
                <span class="del-price">FREE</span>
              </label>
              <label class="delivery-option" :class="{ selected: form.delivery === 'express' }" for="del-express">
                <input type="radio" id="del-express" name="delivery" value="express" v-model="form.delivery" />
                <div class="del-info">
                  <strong>Express Delivery</strong>
                  <span>1–2 Business Days (Fast Delivery)</span>
                </div>
                <span class="del-price">₹199</span>
              </label>
            </div>
          </div>

          <!-- Gift Option -->
          <div class="form-section">
            <h3><span class="section-num">🎁</span> Gift Options</h3>
            <label class="gift-toggle" for="gift-check">
              <input type="checkbox" id="gift-check" v-model="form.isGift" />
              <span>Send as a Gift (complimentary luxury gift wrapping + personalised card)</span>
            </label>
            <div class="gift-message-wrap" v-if="form.isGift">
              <label for="gift-msg">Personalised Gift Message / Note</label>
              <textarea
                id="gift-msg"
                v-model="form.giftMessage"
                placeholder="Enter your personalised gift message for the recipient..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <button type="submit" class="proceed-payment-btn" id="proceed-to-payment-btn">
            Proceed to Payment → ₹{{ totalAmount.toLocaleString() }}
          </button>
        </form>
      </div>

      <!-- Right: Order Summary -->
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-items">
          <div class="summary-item" v-for="item in store.cart" :key="item.id">
            <img :src="item.image" :alt="item.name" class="summary-img" />
            <div class="summary-item-info">
              <p class="si-name">{{ item.name }}</p>
              <p class="si-brand">{{ item.brand }}</p>
              <p class="si-qty">Qty: {{ item.qty }}</p>
            </div>
            <p class="si-price">₹{{ (item.price * item.qty).toLocaleString() }}</p>
          </div>
        </div>

        <div class="summary-totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>₹{{ store.cartTotal.toLocaleString() }}</span>
          </div>
          <div class="total-row">
            <span>Delivery</span>
            <span>{{ form.delivery === 'express' ? '₹199' : 'FREE' }}</span>
          </div>
          <div class="total-row discount" v-if="promoApplied && promoDiscount > 0">
            <span>Coupon Discount</span>
            <span>−₹{{ promoDiscount.toLocaleString() }}</span>
          </div>
          <div class="total-row grand">
            <strong>Total</strong>
            <strong>₹{{ totalAmount.toLocaleString() }}</strong>
          </div>
        </div>

        <!-- Promo Code -->
        <div class="promo-section">
          <div class="promo-input-wrap">
            <input v-model="promoCode" type="text" placeholder="Enter coupon code (e.g. LUXORIA10)" id="checkout-promo-input" />
            <button type="button" @click="applyPromo" id="checkout-promo-apply-btn">Apply</button>
          </div>
          <p class="promo-success" v-if="promoApplied">✓ Promo code applied (10% off)!</p>
          <p class="promo-error" v-if="promoError">{{ promoError }}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import { authStore } from '../store/auth'
import { products as fallbackProducts } from '../data/products'

const router = useRouter()
const promoCode = ref('')
const promoApplied = ref(false)
const promoError = ref('')

const form = ref({
  name: authStore.currentUser?.name || '',
  email: authStore.currentUser?.email || '',
  phone: authStore.currentUser?.phone || '',
  address1: '', address2: '', city: '', state: '', pin: '',
  delivery: 'standard',
  isGift: false,
  giftMessage: ''
})

// Auto-fill user information when user logs in or completes signup on this page
watch(() => authStore.currentUser, (user) => {
  if (user) {
    if (!form.value.name) form.value.name = user.name || ''
    if (!form.value.email) form.value.email = user.email || ''
    if (!form.value.phone) form.value.phone = user.phone || ''
    store.assignCartToUser(user.id)
  }
}, { immediate: true })

const states = [
  'Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
]

const deliveryCharge = computed(() => form.value.delivery === 'express' ? 199 : 0)
const promoDiscount = computed(() => promoApplied.value ? Math.round(store.cartTotal * 0.10) : 0)
const totalAmount = computed(() => Math.max(0, store.cartTotal + deliveryCharge.value - promoDiscount.value))

onMounted(() => {
  if (!authStore.currentUser) {
    // Keep user on this page and prompt login/signup modal directly
    authStore.openAuthModal('/checkout', 'Sign in or create an account to complete your order')
  } else {
    store.assignCartToUser(authStore.currentUser.id)
  }

  // Restore cart items from localStorage if empty
  if (store.cart.length === 0) {
    try {
      const saved = JSON.parse(localStorage.getItem('luxoria_cart') || '[]')
      if (Array.isArray(saved) && saved.length > 0) {
        store.cart = saved
      } else {
        router.push('/shop')
      }
    } catch {
      router.push('/shop')
    }
  }

  // Repair any existing cart items that had 0 or missing prices
  if (store.cart && store.cart.length > 0) {
    store.cart.forEach(item => {
      if (!item.price || Number(item.price) <= 0) {
        const prod = fallbackProducts.find(p => Number(p.id) === Number(item.id))
        if (prod && Number(prod.price) > 0) item.price = Number(prod.price)
      }
    })
    try {
      localStorage.setItem('luxoria_cart', JSON.stringify(store.cart))
    } catch {}
  }
})

const applyPromo = () => {
  promoError.value = ''
  const valid = ['LUXORIA10', 'FREESHIP', 'NEWUSER20', 'COUPLES15']
  if (valid.includes(promoCode.value.toUpperCase())) {
    promoApplied.value = true
    promoError.value = ''
  } else {
    promoError.value = 'Invalid promo code.'
    promoApplied.value = false
  }
}

const proceedToPayment = () => {
  if (!authStore.currentUser) {
    authStore.openAuthModal('/checkout', 'Sign in or create an account to proceed to payment')
    return
  }
  // Assign cart to current user and save to session for payment processing
  store.assignCartToUser(authStore.currentUser.id)
  sessionStorage.setItem('luxoria_checkout', JSON.stringify({
    address: form.value,
    total: totalAmount.value,
    items: store.cart,
    user: authStore.currentUser
  }))
  router.push('/payment')
}
</script>

<style scoped>
.checkout-page { min-height: 100vh; background: #faf8f4; }
.checkout-header {
  background: #fff;
  border-bottom: 1px solid #ede5d8;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
}
.checkout-logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  font-size: 1.1rem;
}
.checkout-logo span {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.1em;
}
.checkout-steps { display: flex; align-items: center; gap: 0; }
.step {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #bbb;
  font-weight: 500;
}
.step.active { color: #C9A84C; }
.step-num {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 1.5px solid #ddd;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #bbb;
}
.step.active .step-num { border-color: #C9A84C; background: #C9A84C; color: #fff; }
.step-line { width: 48px; height: 1.5px; background: #e0d5c0; margin: 0 0.5rem; }
.step-line.active { background: #C9A84C; }

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  align-items: start;
}
.checkout-form-section { display: flex; flex-direction: column; gap: 1.5rem; }
.user-tag {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border: 1px solid #e8dfc8;
  border-radius: 14px;
  padding: 1rem 1.25rem;
}
.user-tag-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-tag-name {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}
.user-tag-email {
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  color: #888;
  margin: 0;
}
.change-user-btn {
  margin-left: auto;
  background: none;
  border: 1px solid #e0d5c0;
  padding: 0.35rem 0.8rem;
  border-radius: 6px;
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.change-user-btn:hover { border-color: #C9A84C; color: #C9A84C; }
.form-section {
  background: #fff;
  border: 1px solid #e8dfc8;
  border-radius: 16px;
  padding: 1.75rem;
}
.form-section h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section-num { font-size: 1.1rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-group.full { grid-column: 1 / -1; }
.form-group label {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #888;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.form-group input, .form-group select, .form-group textarea {
  border: 1.5px solid #e0d5c0;
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  color: #1a1a1a;
  background: #faf8f4;
  outline: none;
  transition: all 0.2s;
  width: 100%;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #C9A84C;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
}
.input-disabled { opacity: 0.6; cursor: not-allowed !important; }
.form-group textarea { resize: vertical; min-height: 80px; }
.delivery-options { display: flex; flex-direction: column; gap: 0.75rem; }
.delivery-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1.5px solid #e0d5c0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}
.delivery-option.selected { border-color: #C9A84C; background: rgba(201,168,76,0.04); }
.delivery-option input[type="radio"] { accent-color: #C9A84C; }
.del-info { flex: 1; }
.del-info strong { display: block; font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600; color: #1a1a1a; }
.del-info span { font-family: 'Jost', sans-serif; font-size: 0.8rem; color: #888; }
.del-price { font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600; color: #C9A84C; }
.gift-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  color: #444;
  cursor: pointer;
  margin-bottom: 1rem;
}
.gift-toggle input { accent-color: #C9A84C; width: 16px; height: 16px; }
.gift-message-wrap {
  margin-top: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.gift-message-wrap label {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #888;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
}
.gift-message-wrap textarea {
  width: 100%;
  min-height: 105px;
  border: 1.5px solid #e0d5c0;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.92rem;
  color: #1a1a1a;
  background: #faf8f4;
  outline: none;
  resize: vertical;
  line-height: 1.55;
  transition: all 0.2s;
  box-sizing: border-box;
}
.gift-message-wrap textarea:focus {
  border-color: #C9A84C;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
}
.proceed-payment-btn {
  width: 100%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  border: none;
  padding: 1.1rem;
  border-radius: 14px;
  font-family: 'Jost', sans-serif;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.25s;
  box-shadow: 0 6px 24px rgba(201,168,76,0.3);
}
.proceed-payment-btn:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(201,168,76,0.4); }

/* Order Summary */
.order-summary {
  background: #fff;
  border: 1px solid #e8dfc8;
  border-radius: 16px;
  padding: 1.75rem;
  position: sticky;
  top: 90px;
}
.order-summary h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0e8d8;
}
.summary-items { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem; }
.summary-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.summary-img {
  width: 56px; height: 56px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  border: 1px solid #f0e8d8;
}
.summary-item-info { flex: 1; }
.si-name { font-family: 'Jost', sans-serif; font-size: 0.85rem; font-weight: 500; color: #1a1a1a; margin: 0 0 0.1rem; }
.si-brand { font-family: 'Jost', sans-serif; font-size: 0.73rem; color: #C9A84C; margin: 0 0 0.1rem; }
.si-qty { font-family: 'Jost', sans-serif; font-size: 0.73rem; color: #999; margin: 0; }
.si-price { font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600; color: #1a1a1a; flex-shrink: 0; }
.summary-totals {
  border-top: 1px solid #f0e8d8;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}
.total-row {
  display: flex;
  justify-content: space-between;
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  color: #666;
}
.total-row.discount { color: #27ae60; }
.total-row.grand {
  font-size: 1.05rem;
  color: #1a1a1a;
  border-top: 1px solid #f0e8d8;
  padding-top: 0.75rem;
  margin-top: 0.25rem;
}
.promo-section { margin-bottom: 1.25rem; }
.promo-input-wrap { display: flex; gap: 0.5rem; }
.promo-input-wrap input {
  flex: 1;
  border: 1.5px solid #e0d5c0;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  outline: none;
  background: #faf8f4;
  transition: border-color 0.2s;
}
.promo-input-wrap input:focus { border-color: #C9A84C; }
.promo-input-wrap button {
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}
.promo-input-wrap button:hover { background: #C9A84C; }
.promo-success { font-family: 'Jost', sans-serif; font-size: 0.8rem; color: #27ae60; margin: 0.4rem 0 0; }
.promo-error { font-family: 'Jost', sans-serif; font-size: 0.8rem; color: #e74c3c; margin: 0.4rem 0 0; }
.trust-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #f0e8d8;
  padding-top: 1rem;
}
.trust-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  color: #888;
}

@media (max-width: 900px) {
  .checkout-layout { grid-template-columns: 1fr; }
  .order-summary { position: static; order: -1; }
}
@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-group.full { grid-column: auto; }
  .checkout-steps { display: none; }
}
</style>
