<template>
  <div class="offers-page">
    <div class="offers-header">
      <div class="offers-header-content">
        <span class="section-pre">🏷️ Exclusive Deals</span>
        <h1>Special Offers</h1>
        <p>Limited-time deals on premium timepieces. Don't miss out!</p>
      </div>
    </div>

    <!-- Timer Banner -->
    <div class="timer-banner">
      <div class="timer-inner">
        <p>⚡ Flash Sale ends in:</p>
        <div class="countdown">
          <div class="count-unit">
            <strong>{{ timeLeft.hours }}</strong>
            <span>Hours</span>
          </div>
          <div class="count-sep">:</div>
          <div class="count-unit">
            <strong>{{ timeLeft.minutes }}</strong>
            <span>Mins</span>
          </div>
          <div class="count-sep">:</div>
          <div class="count-unit">
            <strong>{{ timeLeft.seconds }}</strong>
            <span>Secs</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Offer Cards -->
    <div class="offers-section">
      <div class="offer-card" v-for="p in offerProducts" :key="p.id">
        <div class="offer-img-wrap">
          <img :src="p.image" :alt="p.name" />
          <span class="offer-badge" v-if="!store.hidePrice && p.discount">{{ p.discount }}% OFF</span>
          <span class="offer-badge special-badge" v-else>EXCLUSIVE</span>
        </div>
        <div class="offer-body">
          <p class="offer-brand">{{ p.brand }}</p>
          <h3>{{ p.name }}</h3>
          <div class="offer-price" v-if="!store.hidePrice && p.price > 0">
            <span class="op-current">₹{{ p.price.toLocaleString() }}</span>
            <span class="op-original" v-if="p.originalPrice">₹{{ p.originalPrice.toLocaleString() }}</span>
          </div>
          <p class="offer-save" v-if="!store.hidePrice && p.originalPrice && p.price > 0">You save ₹{{ (p.originalPrice - p.price).toLocaleString() }}</p>
          <div class="offer-price-reveal" v-if="store.hidePrice || !p.price">
            <span class="reveal-badge">✨ Price on Request · Launching Soon</span>
          </div>
          <div class="offer-actions">
            <router-link :to="`/product/${p.id}`" class="view-btn" :id="`offer-view-${p.id}`">View Watch</router-link>
            <button class="add-btn" @click="addToCart(p)" :id="`offer-cart-${p.id}`">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Promo Codes (Commented out - will launch later)
    <div class="promo-codes-section">
      <h2>Use Promo Codes</h2>
      <div class="codes-grid">
        <div class="code-card" v-for="code in promoCodes" :key="code.code">
          <div class="code-display">{{ code.code }}</div>
          <p>{{ code.desc }}</p>
          <button class="copy-btn" @click="copyCode(code.code)" :id="`copy-code-${code.code}`">
            {{ copied === code.code ? '✓ Copied!' : 'Copy Code' }}
          </button>
        </div>
      </div>
    </div>
    -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { store } from '../store'
import { products as defaultProducts } from '../data/products'

const offerProducts = computed(() => {
  const all = store.products?.length ? store.products : defaultProducts
  if (store.hidePrice) return all.slice(0, 8)
  const discounted = all.filter(p => (p.discount || 0) >= 20)
  return discounted.length ? discounted : all.slice(0, 8)
})
const copied = ref(null)

const timeLeft = ref({ hours: '08', minutes: '34', seconds: '52' })

let timer
const updateTimer = () => {
  let total = (parseInt(timeLeft.value.hours) * 3600 + parseInt(timeLeft.value.minutes) * 60 + parseInt(timeLeft.value.seconds)) - 1
  if (total < 0) total = 28800
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  timeLeft.value = {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
}
onMounted(() => { timer = setInterval(updateTimer, 1000) })
onUnmounted(() => clearInterval(timer))

const addToCart = (p) => store.addToCart(p)

const copyCode = (code) => {
  navigator.clipboard?.writeText(code).catch(() => {})
  copied.value = code
  setTimeout(() => { copied.value = null }, 2000)
}

const promoCodes = [
  { code: 'LUXORIA10', desc: '10% off on any watch' },
  { code: 'FREESHIP', desc: 'Free shipping on all orders' },
  { code: 'NEWUSER20', desc: '20% off for new customers' },
  { code: 'COUPLES15', desc: '15% off on couple sets' }
]
</script>

<style scoped>
.offers-page { padding-top: 72px; min-height: 100vh; }
.offers-header {
  background: linear-gradient(135deg, #C9A84C 0%, #8B6914 100%);
  padding: 4rem 2rem;
  text-align: center;
}
.section-pre {
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
  display: block;
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
}
.offers-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.75rem;
}
.offers-header p {
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  color: rgba(255,255,255,0.85);
  margin: 0;
  font-weight: 300;
}
.timer-banner {
  background: #1a1a1a;
  padding: 1.5rem 2rem;
}
.timer-inner {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.timer-inner p {
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  color: #C9A84C;
  margin: 0;
  font-weight: 500;
}
.countdown { display: flex; align-items: center; gap: 0.5rem; }
.count-unit { text-align: center; }
.count-unit strong {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #fff;
  line-height: 1;
  min-width: 50px;
}
.count-unit span {
  font-family: 'Jost', sans-serif;
  font-size: 0.65rem;
  color: #888;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.count-sep {
  font-family: 'Jost', sans-serif;
  font-size: 1.5rem;
  color: #C9A84C;
  line-height: 1;
  margin-bottom: 0.75rem;
}
.offers-section {
  max-width: 1300px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.offer-card {
  background: #fff;
  border: 1px solid #f0e8d8;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.offer-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(201,168,76,0.12); }
.offer-img-wrap {
  position: relative;
  aspect-ratio: 1;
  background: #faf8f4;
}
.offer-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.offer-badge {
  position: absolute;
  top: 12px; right: 12px;
  background: #ef4444;
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
}
.offer-badge.special-badge {
  background: #C9A84C;
  color: #1a1a1a;
  letter-spacing: 0.08em;
}
.offer-price-reveal {
  margin: 0.2rem 0 0.8rem;
}
.reveal-badge {
  display: inline-block;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #C9A84C;
  background: rgba(201, 168, 76, 0.08);
  border: 1px dashed rgba(201, 168, 76, 0.4);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}
.offer-body { padding: 1.25rem; }
.offer-brand {
  font-family: 'Jost', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  color: #C9A84C;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 0.3rem;
}
.offer-body h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.75rem;
}
.offer-price { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem; }
.op-current {
  font-family: 'Jost', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}
.op-original {
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #bbb;
  text-decoration: line-through;
}
.offer-save {
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  color: #27ae60;
  font-weight: 500;
  margin: 0 0 1rem;
}
.offer-actions { display: flex; gap: 0.5rem; }
.view-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f0e8;
  color: #8B6914;
  padding: 0.6rem;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid #e0cfa0;
  transition: all 0.2s;
}
.view-btn:hover { background: #C9A84C; color: #fff; border-color: #C9A84C; }
.add-btn {
  flex: 1;
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 0.6rem;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover { background: #C9A84C; }
.promo-codes-section {
  background: #faf8f4;
  padding: 3rem 2rem;
  border-top: 1px solid #ede5d8;
}
.promo-codes-section h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 2rem;
}
.codes-grid {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.code-card {
  background: #fff;
  border: 2px dashed #e0d5c0;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.2s;
}
.code-card:hover { border-color: #C9A84C; }
.code-display {
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #8B6914;
  background: #f5f0e8;
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}
.code-card p {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #888;
  margin: 0 0 0.75rem;
}
.copy-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}
.copy-btn:hover { background: #C9A84C; }

@media (max-width: 1024px) {
  .offers-section { grid-template-columns: repeat(2, 1fr); }
  .codes-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .offers-section { grid-template-columns: 1fr; }
  .codes-grid { grid-template-columns: 1fr; }
}
</style>
