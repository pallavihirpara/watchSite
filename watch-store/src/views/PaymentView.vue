<template>
  <div class="payment-page" id="payment-page">
    <!-- Header -->
    <div class="checkout-header">
      <router-link to="/" class="checkout-logo">⌚ <span>LUXORIA</span></router-link>
      <div class="checkout-steps">
        <div class="step done"><span class="step-num">✓</span> Cart</div>
        <div class="step-line done"></div>
        <div class="step done"><span class="step-num">✓</span> Checkout</div>
        <div class="step-line active"></div>
        <div class="step active"><span class="step-num">3</span> Payment</div>
      </div>
      <div class="secure-tag">🔒 Secure Payment</div>
    </div>

    <!-- Success View -->
    <transition name="fade">
      <div class="order-success" v-if="orderPlaced" id="order-success-section">
        <div class="success-circle">✓</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you, <strong>{{ authStore.currentUser?.name }}</strong>! Your timepiece is on its way.</p>
        <div class="order-number">Order #LUX-{{ orderId }}</div>
        <p class="confirm-email">A confirmation email has been sent to <strong>{{ authStore.currentUser?.email }}</strong></p>
        <div class="success-actions">
          <router-link to="/shop" class="btn-continue" id="order-continue-btn">Continue Shopping</router-link>
          <router-link to="/" class="btn-home" id="order-home-btn">Go to Home</router-link>
        </div>
        <div class="success-watch">
          <img src="/images/watch_couple_gold.jpg" alt="Your Order" />
        </div>
      </div>
    </transition>

    <!-- Payment Form -->
    <div class="payment-layout" v-if="!orderPlaced">
      <div class="payment-form-section">

        <!-- Payment Methods -->
        <div class="pay-section">
          <h3>Payment Method</h3>
          <div class="payment-tabs">
            <button
              v-for="tab in paymentTabs" :key="tab.id"
              class="pay-tab"
              :class="{ active: selectedPayment === tab.id }"
              @click="selectedPayment = tab.id"
              :id="`pay-tab-${tab.id}`"
            >
              <span>{{ tab.icon }}</span> {{ tab.label }}
            </button>
          </div>

          <!-- Credit / Debit Card -->
          <div v-if="selectedPayment === 'card'" class="pay-form" id="card-payment-form">
            <div class="card-preview" :class="{ flipped: showBack }">
              <div class="card-front">
                <div class="card-logo">{{ getCardBrand() }}</div>
                <p class="card-number-preview">{{ cardForm.number || '•••• •••• •••• ••••' }}</p>
                <div class="card-meta">
                  <div>
                    <p class="card-label">Card Holder</p>
                    <p class="card-value">{{ cardForm.name || 'YOUR NAME' }}</p>
                  </div>
                  <div>
                    <p class="card-label">Expires</p>
                    <p class="card-value">{{ cardForm.expiry || 'MM/YY' }}</p>
                  </div>
                </div>
              </div>
              <div class="card-back">
                <div class="card-strip"></div>
                <div class="card-cvv-wrap">
                  <p class="card-label">CVV</p>
                  <div class="card-cvv-box">{{ cardForm.cvv ? '•'.repeat(cardForm.cvv.length) : '•••' }}</div>
                </div>
              </div>
            </div>

            <form @submit.prevent="placeOrder" id="card-form">
              <div class="form-group">
                <label for="card-number">Card Number</label>
                <input id="card-number" v-model="cardForm.number" @input="formatCardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required />
              </div>
              <div class="form-group">
                <label for="card-name">Cardholder Name</label>
                <input id="card-name" v-model="cardForm.name" placeholder="As on card" required />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="card-expiry">Expiry Date</label>
                  <input id="card-expiry" v-model="cardForm.expiry" @input="formatExpiry" placeholder="MM/YY" maxlength="5" required />
                </div>
                <div class="form-group">
                  <label for="card-cvv">CVV</label>
                  <input id="card-cvv" v-model="cardForm.cvv" @focus="showBack = true" @blur="showBack = false" placeholder="•••" maxlength="4" type="password" required />
                </div>
              </div>
              <label class="save-card-label" for="save-card">
                <input type="checkbox" id="save-card" v-model="cardForm.saveCard" /> Save card for future payments
              </label>
              <button type="submit" class="pay-btn" id="card-pay-btn" :disabled="loading">
                <span v-if="loading" class="spinner"></span>
                {{ loading ? 'Processing…' : `Pay ₹${totalAmount.toLocaleString()}` }}
              </button>
            </form>
          </div>

          <!-- UPI -->
          <div v-if="selectedPayment === 'upi'" class="pay-form" id="upi-payment-form">
            <div class="upi-apps">
              <button
                v-for="app in upiApps" :key="app.id"
                class="upi-app-btn"
                :class="{ selected: selectedUpi === app.id }"
                @click="selectedUpi = app.id"
                type="button"
                :id="`upi-${app.id}`"
              >
                <span class="upi-icon">{{ app.icon }}</span>
                <span>{{ app.label }}</span>
              </button>
            </div>
            <div class="form-group">
              <label for="upi-id">UPI ID</label>
              <input id="upi-id" v-model="upiId" placeholder="yourname@upi" type="text" />
            </div>
            <button class="pay-btn" @click="placeOrder" :disabled="loading" id="upi-pay-btn">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Verifying…' : `Pay ₹${totalAmount.toLocaleString()}` }}
            </button>
          </div>

          <!-- Net Banking -->
          <div v-if="selectedPayment === 'netbanking'" class="pay-form" id="netbanking-form">
            <div class="bank-grid">
              <button
                v-for="bank in banks" :key="bank.id"
                class="bank-btn"
                :class="{ selected: selectedBank === bank.id }"
                @click="selectedBank = bank.id"
                type="button"
                :id="`bank-${bank.id}`"
              >
                {{ bank.icon }} {{ bank.name }}
              </button>
            </div>
            <button class="pay-btn" @click="placeOrder" :disabled="loading || !selectedBank" id="netbanking-pay-btn">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Redirecting…' : `Pay ₹${totalAmount.toLocaleString()}` }}
            </button>
          </div>

          <!-- Cash on Delivery -->
          <div v-if="selectedPayment === 'cod'" class="pay-form cod-form" id="cod-form">
            <div class="cod-info">
              <span class="cod-icon">🏠</span>
              <div>
                <h4>Pay when you receive</h4>
                <p>Cash / Card on delivery. An extra ₹49 handling charge applies.</p>
              </div>
            </div>
            <button class="pay-btn" @click="placeOrder" :disabled="loading" id="cod-confirm-btn">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Placing order…' : `Confirm Order · ₹${(totalAmount + 49).toLocaleString()}` }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Summary -->
      <div class="pay-summary">
        <h3>Order Summary</h3>
        <div class="summary-items">
          <div class="summary-item" v-for="item in orderData?.items || store.cart" :key="item.id">
            <img :src="item.image" :alt="item.name" class="summary-img" />
            <div class="summary-item-info">
              <p class="si-name">{{ item.name }}</p>
              <p class="si-qty">× {{ item.qty }}</p>
            </div>
            <p class="si-price">₹{{ (item.price * item.qty).toLocaleString() }}</p>
          </div>
        </div>
        <div class="summary-totals">
          <div class="total-row"><span>Subtotal</span><span>₹{{ store.cartTotal.toLocaleString() }}</span></div>
          <div class="total-row"><span>Delivery</span><span>{{ orderData?.address?.delivery === 'express' ? '₹199' : 'FREE' }}</span></div>
          <div class="total-row grand"><strong>Total Payable</strong><strong>₹{{ totalAmount.toLocaleString() }}</strong></div>
        </div>
        <div class="delivery-address-preview" v-if="orderData?.address">
          <h4>📦 Delivering to</h4>
          <p>{{ orderData.address.name }}</p>
          <p>{{ orderData.address.address1 }}, {{ orderData.address.city }}</p>
          <p>{{ orderData.address.state }} – {{ orderData.address.pin }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import { authStore } from '../store/auth'

const router = useRouter()
const orderPlaced = ref(false)
const loading = ref(false)
const orderId = ref('')
const selectedPayment = ref('card')
const showBack = ref(false)
const selectedUpi = ref('')
const selectedBank = ref('')
const upiId = ref('')
const orderData = ref(null)

const cardForm = ref({ number: '', name: '', expiry: '', cvv: '', saveCard: false })

const paymentTabs = [
  { id: 'card', icon: '💳', label: 'Card' },
  { id: 'upi', icon: '📲', label: 'UPI' },
  { id: 'netbanking', icon: '🏦', label: 'Net Banking' },
  { id: 'cod', icon: '🏠', label: 'Cash on Delivery' }
]
const upiApps = [
  { id: 'gpay', icon: '🟢', label: 'GPay' },
  { id: 'phonepe', icon: '🟣', label: 'PhonePe' },
  { id: 'paytm', icon: '🔵', label: 'Paytm' },
  { id: 'bhim', icon: '🟠', label: 'BHIM' }
]
const banks = [
  { id: 'sbi', icon: '🏦', name: 'SBI' },
  { id: 'hdfc', icon: '🏦', name: 'HDFC' },
  { id: 'icici', icon: '🏦', name: 'ICICI' },
  { id: 'axis', icon: '🏦', name: 'Axis' },
  { id: 'kotak', icon: '🏦', name: 'Kotak' },
  { id: 'pnb', icon: '🏦', name: 'PNB' }
]

const totalAmount = computed(() => {
  return orderData.value?.total || store.cartTotal
})

onMounted(() => {
  if (!authStore.currentUser) { router.push('/'); return }
  if (store.cart.length === 0) { router.push('/'); return }
  try {
    orderData.value = JSON.parse(sessionStorage.getItem('luxoria_checkout') || 'null')
  } catch { orderData.value = null }
})

const getCardBrand = () => {
  const n = cardForm.value.number.replace(/\s/g, '')
  if (n.startsWith('4')) return '💳 VISA'
  if (n.startsWith('5')) return '💳 MC'
  if (n.startsWith('3')) return '💳 AMEX'
  return '💳'
}

const formatCardNumber = () => {
  let v = cardForm.value.number.replace(/\D/g, '').substring(0, 16)
  cardForm.value.number = v.replace(/(.{4})/g, '$1 ').trim()
}

const formatExpiry = () => {
  let v = cardForm.value.expiry.replace(/\D/g, '').substring(0, 4)
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2)
  cardForm.value.expiry = v
}

const placeOrder = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 2000)) // simulate payment
  orderId.value = Math.random().toString(36).substring(2, 8).toUpperCase()
  store.cart.splice(0) // clear cart
  sessionStorage.removeItem('luxoria_checkout')
  loading.value = false
  orderPlaced.value = true
}
</script>

<style scoped>
.payment-page { min-height: 100vh; background: #faf8f4; }
.checkout-header {
  background: #fff;
  border-bottom: 1px solid #ede5d8;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
  gap: 1rem;
}
.checkout-logo {
  display: flex; align-items: center; gap: 0.4rem;
  text-decoration: none; font-size: 1.1rem;
}
.checkout-logo span {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem; font-weight: 600; color: #1a1a1a; letter-spacing: 0.1em;
}
.checkout-steps { display: flex; align-items: center; }
.step {
  display: flex; align-items: center; gap: 0.4rem;
  font-family: 'Jost', sans-serif; font-size: 0.82rem; color: #bbb; font-weight: 500;
}
.step.active { color: #C9A84C; }
.step.done { color: #27ae60; }
.step-num {
  width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #ddd;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700; color: #bbb;
}
.step.active .step-num { border-color: #C9A84C; background: #C9A84C; color: #fff; }
.step.done .step-num { border-color: #27ae60; background: #27ae60; color: #fff; }
.step-line { width: 48px; height: 1.5px; background: #e0d5c0; margin: 0 0.5rem; }
.step-line.active { background: #C9A84C; }
.step-line.done { background: #27ae60; }
.secure-tag {
  font-family: 'Jost', sans-serif; font-size: 0.8rem; color: #27ae60; font-weight: 500;
  display: flex; align-items: center; gap: 0.25rem;
}

/* Payment Layout */
.payment-layout {
  display: grid; grid-template-columns: 1fr 360px; gap: 2rem;
  max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; align-items: start;
}
.pay-section {
  background: #fff; border: 1px solid #e8dfc8; border-radius: 16px; padding: 1.75rem;
}
.pay-section h3 {
  font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600;
  color: #1a1a1a; margin: 0 0 1.25rem;
}
.payment-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.75rem; flex-wrap: wrap; }
.pay-tab {
  display: flex; align-items: center; gap: 0.4rem;
  background: #f5f0e8; border: 1.5px solid transparent;
  padding: 0.6rem 1rem; border-radius: 10px;
  font-family: 'Jost', sans-serif; font-size: 0.85rem; color: #555;
  cursor: pointer; transition: all 0.2s;
}
.pay-tab:hover { border-color: #C9A84C; color: #C9A84C; }
.pay-tab.active { background: #C9A84C; color: #fff; border-color: #C9A84C; }
.pay-form { display: flex; flex-direction: column; gap: 1rem; }

/* Card Preview */
.card-preview {
  perspective: 1000px;
  width: 100%; max-width: 360px; height: 200px;
  position: relative; margin-bottom: 0.5rem;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card-preview.flipped { transform: rotateY(180deg); }
.card-front, .card-back {
  position: absolute; inset: 0;
  border-radius: 16px; padding: 1.5rem;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.card-front {
  background: linear-gradient(135deg, #C9A84C 0%, #8B6914 50%, #5C3D0E 100%);
  display: flex; flex-direction: column; justify-content: space-between;
}
.card-back {
  background: linear-gradient(135deg, #333, #1a1a1a);
  transform: rotateY(180deg);
  display: flex; flex-direction: column; justify-content: center;
}
.card-logo { font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600; color: rgba(255,255,255,0.9); }
.card-number-preview {
  font-family: 'Jost', sans-serif; font-size: 1.3rem; font-weight: 500;
  color: #fff; letter-spacing: 0.12em; margin: 0;
}
.card-meta { display: flex; justify-content: space-between; }
.card-label { font-family: 'Jost', sans-serif; font-size: 0.65rem; color: rgba(255,255,255,0.6); margin: 0 0 0.2rem; text-transform: uppercase; letter-spacing: 0.08em; }
.card-value { font-family: 'Jost', sans-serif; font-size: 0.85rem; color: #fff; margin: 0; font-weight: 500; }
.card-strip { height: 40px; background: #000; margin: 0 -1.5rem 1rem; }
.card-cvv-wrap { display: flex; align-items: center; gap: 1rem; }
.card-cvv-box {
  background: #fff; padding: 0.4rem 1rem; border-radius: 4px;
  font-family: 'Jost', sans-serif; font-size: 0.9rem; letter-spacing: 0.2em; color: #333;
}

.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.form-group label {
  font-family: 'Jost', sans-serif; font-size: 0.75rem; font-weight: 600;
  color: #888; letter-spacing: 0.08em; text-transform: uppercase;
}
.form-group input {
  border: 1.5px solid #e0d5c0; border-radius: 10px;
  padding: 0.7rem 0.9rem;
  font-family: 'Jost', sans-serif; font-size: 0.9rem; color: #1a1a1a;
  background: #faf8f4; outline: none; transition: all 0.2s;
}
.form-group input:focus { border-color: #C9A84C; background: #fff; box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
.save-card-label {
  display: flex; align-items: center; gap: 0.6rem;
  font-family: 'Jost', sans-serif; font-size: 0.85rem; color: #666; cursor: pointer;
}
.save-card-label input { accent-color: #C9A84C; }
.pay-btn {
  width: 100%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff; border: none; padding: 1rem;
  border-radius: 12px;
  font-family: 'Jost', sans-serif; font-size: 1.02rem; font-weight: 500;
  cursor: pointer; letter-spacing: 0.04em; transition: all 0.25s;
  box-shadow: 0 6px 24px rgba(201,168,76,0.3);
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}
.pay-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(201,168,76,0.4); }
.pay-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.spinner {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* UPI */
.upi-apps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.6rem; margin-bottom: 0.5rem; }
.upi-app-btn {
  display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
  padding: 0.75rem 0.5rem; border: 1.5px solid #e0d5c0; border-radius: 10px;
  background: #faf8f4; cursor: pointer; transition: all 0.2s;
  font-family: 'Jost', sans-serif; font-size: 0.78rem; color: #555;
}
.upi-app-btn.selected { border-color: #C9A84C; background: rgba(201,168,76,0.06); color: #C9A84C; }
.upi-icon { font-size: 1.4rem; }

/* Net Banking */
.bank-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-bottom: 0.5rem; }
.bank-btn {
  padding: 0.75rem; border: 1.5px solid #e0d5c0; border-radius: 10px;
  background: #faf8f4; cursor: pointer; transition: all 0.2s;
  font-family: 'Jost', sans-serif; font-size: 0.82rem; color: #555;
}
.bank-btn.selected { border-color: #C9A84C; background: rgba(201,168,76,0.06); color: #C9A84C; }

/* COD */
.cod-form { gap: 1.25rem; }
.cod-info {
  display: flex; gap: 1rem; align-items: flex-start;
  background: #faf8f4; border: 1px solid #e8dfc8; border-radius: 12px; padding: 1.25rem;
}
.cod-icon { font-size: 2rem; flex-shrink: 0; }
.cod-info h4 { font-family: 'Jost', sans-serif; font-size: 0.95rem; font-weight: 600; color: #1a1a1a; margin: 0 0 0.25rem; }
.cod-info p { font-family: 'Jost', sans-serif; font-size: 0.83rem; color: #888; margin: 0; }

/* Summary */
.pay-summary {
  background: #fff; border: 1px solid #e8dfc8; border-radius: 16px; padding: 1.75rem;
  position: sticky; top: 90px;
}
.pay-summary h3 {
  font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; color: #1a1a1a;
  margin: 0 0 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #f0e8d8;
}
.summary-items { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem; }
.summary-item { display: flex; align-items: center; gap: 0.75rem; }
.summary-img { width: 56px; height: 56px; object-fit: cover; border-radius: 8px; flex-shrink: 0; border: 1px solid #f0e8d8; }
.summary-item-info { flex: 1; }
.si-name { font-family: 'Jost', sans-serif; font-size: 0.85rem; font-weight: 500; color: #1a1a1a; margin: 0 0 0.1rem; }
.si-qty { font-family: 'Jost', sans-serif; font-size: 0.73rem; color: #999; margin: 0; }
.si-price { font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600; color: #1a1a1a; flex-shrink: 0; }
.summary-totals { border-top: 1px solid #f0e8d8; padding-top: 1rem; display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem; }
.total-row { display: flex; justify-content: space-between; font-family: 'Jost', sans-serif; font-size: 0.88rem; color: #666; }
.total-row.grand { font-size: 1.05rem; color: #1a1a1a; border-top: 1px solid #f0e8d8; padding-top: 0.75rem; margin-top: 0.25rem; }
.delivery-address-preview { background: #faf8f4; border: 1px solid #e8dfc8; border-radius: 10px; padding: 1rem; }
.delivery-address-preview h4 { font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 600; color: #888; margin: 0 0 0.5rem; }
.delivery-address-preview p { font-family: 'Jost', sans-serif; font-size: 0.83rem; color: #555; margin: 0.1rem 0; }

/* Success */
.order-success {
  text-align: center; padding: 5rem 2rem; max-width: 600px; margin: 0 auto;
}
.success-circle {
  width: 90px; height: 90px; border-radius: 50%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff; font-size: 2.5rem; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem; animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.order-success h2 {
  font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 600; color: #1a1a1a; margin: 0 0 0.75rem;
}
.order-success > p { font-family: 'Jost', sans-serif; font-size: 1rem; color: #666; margin: 0 0 1rem; font-weight: 300; }
.order-number {
  display: inline-block; background: #f5f0e8; border: 1px solid #e0cfa0;
  color: #8B6914; font-family: 'Jost', sans-serif; font-size: 1rem; font-weight: 700;
  padding: 0.5rem 1.5rem; border-radius: 8px; margin-bottom: 1rem; letter-spacing: 0.1em;
}
.confirm-email { font-family: 'Jost', sans-serif; font-size: 0.85rem; color: #aaa; margin-bottom: 2rem; }
.success-actions { display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap; }
.btn-continue {
  background: linear-gradient(135deg, #C9A84C, #8B6914); color: #fff;
  padding: 0.85rem 2rem; border-radius: 10px; text-decoration: none;
  font-family: 'Jost', sans-serif; font-size: 0.95rem; font-weight: 500; transition: opacity 0.2s;
}
.btn-continue:hover { opacity: 0.9; }
.btn-home {
  background: #f5f0e8; color: #8B6914; border: 1px solid #e0cfa0;
  padding: 0.85rem 2rem; border-radius: 10px; text-decoration: none;
  font-family: 'Jost', sans-serif; font-size: 0.95rem; font-weight: 500; transition: all 0.2s;
}
.btn-home:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.success-watch img {
  width: 200px; height: 200px; object-fit: cover; border-radius: 50%;
  box-shadow: 0 20px 60px rgba(201,168,76,0.2); opacity: 0.85;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 900px) {
  .payment-layout { grid-template-columns: 1fr; }
  .pay-summary { position: static; order: -1; }
}
@media (max-width: 480px) {
  .upi-apps { grid-template-columns: repeat(2, 1fr); }
  .bank-grid { grid-template-columns: repeat(2, 1fr); }
  .checkout-steps { display: none; }
}
</style>
