<template>
  <div class="care-page" id="customer-care-page">
    <header class="care-hero">
      <div class="care-hero-inner">
        <span class="hero-tag">Radhe Timepieces • White Glove Service</span>
        <h1>Client Concierge & Care</h1>
        <p class="hero-sub">
          From order dispatch and size adjustments to comprehensive mechanical movement care, our dedicated specialists are at your service.
        </p>
      </div>
    </header>

    <!-- Care Navigation Tabs -->
    <div class="care-tabs-wrap">
      <div class="care-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="care-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
          :id="`care-tab-${tab.id}`"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <div class="care-container">
      <!-- 1. Track My Order -->
      <section v-if="activeTab === 'track'" class="care-card">
        <div class="section-title">
          <h2>📦 Track Your Timepiece Delivery</h2>
          <p>Enter your 6-character order code or tracking number to see real-time armored transit updates.</p>
        </div>

        <div class="track-form-box">
          <form @submit.prevent="lookupOrder" class="track-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Order Reference ID</label>
                <input v-model="trackOrderNo" type="text" placeholder="e.g. LUX-89420 or ORD-102" required />
              </div>
              <div class="form-group">
                <label>Billing Email or Phone</label>
                <input v-model="trackContact" type="text" placeholder="you@example.com or mobile" required />
              </div>
            </div>
            <button type="submit" class="btn-gold" :disabled="trackLoading">
              {{ trackLoading ? 'Retrieving Transit Telemetry...' : 'Track Package →' }}
            </button>
          </form>

          <!-- Mock or Real Tracker Result -->
          <div v-if="trackResult" class="track-status-box">
            <div class="ts-header">
              <div>
                <span class="ts-badge">In Transit • Armored Air Cargo</span>
                <h3>Order #{{ trackResult.id }}</h3>
                <p class="ts-sub">Estimated Doorstep Delivery: <strong>Tomorrow, 2:00 PM – 6:00 PM</strong></p>
              </div>
              <div class="ts-partner">Insured Partner: <strong>BlueDart Apex Safe</strong></div>
            </div>

            <div class="timeline">
              <div class="timeline-step completed">
                <div class="t-dot">✓</div>
                <div class="t-info">
                  <strong>Order Authenticated & Quality Sealed</strong>
                  <span>Mumbai Horology Salon • Passed 48-hr Timing Tolerance Check</span>
                </div>
              </div>
              <div class="timeline-step completed">
                <div class="t-dot">✓</div>
                <div class="t-info">
                  <strong>Armored Vault Handover & Air Transit</strong>
                  <span>Outbound Air Hub Mumbai ✈️ Inbound Destination Hub</span>
                </div>
              </div>
              <div class="timeline-step active">
                <div class="t-dot">🚚</div>
                <div class="t-info">
                  <strong>Out for Signature Delivery</strong>
                  <span>Armored vehicle courier en route with OTP verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Purchase Policy -->
      <section v-if="activeTab === 'policy' || activeTab === 'returns'" class="care-card">
        <div class="section-title">
          <h2>📋 Purchase & Delivery Policy</h2>
          <p>Please review our official sales and order terms.</p>
        </div>

        <div class="policy-notice-box">
          <div class="notice-badge">Important Client Notice</div>
          <h3>All Sales Are Final</h3>
          <p>
            To offer competitive direct pricing on our timepieces, Radhe Timepieces maintains a strict <strong>No Return, No Exchange, and No Warranty Guarantee</strong> policy.
          </p>
          <ul class="policy-bullets">
            <li><strong>No Returns or Refunds:</strong> Once an order is dispatched or delivered, returns and refund requests are not accepted.</li>
            <li><strong>No Exchanges:</strong> We do not offer exchanges or replacements for different models, dial shades, or strap sizes after acquisition.</li>
            <li><strong>No Warranty Guarantees:</strong> Products are supplied as inspected upon delivery. We do not provide mechanical warranty or repair guarantees.</li>
            <li><strong>Doorstep Parcel Inspection:</strong> Clients are requested to inspect parcel external integrity with the courier delivery partner upon handover.</li>
          </ul>
        </div>
      </section>

      <!-- 3. Watch Care Guide -->
      <section v-if="activeTab === 'care'" class="care-card">
        <div class="section-title">
          <h2>⌚ Master Watch Care & Longevity Guide</h2>
          <p>Preserve the accuracy and heirloom luster of your luxury timepieces.</p>
        </div>

        <div class="care-guide-grid">
          <div class="guide-item">
            <span class="guide-icon">🌊</span>
            <h4>Water Resistance Guidelines</h4>
            <p>
              Never operate chronograph pushers or crowns underwater. While 5 ATM withstands rain and surface washing, timepieces should be tested annually before recreational swimming.
            </p>
          </div>
          <div class="guide-item">
            <span class="guide-icon">🧲</span>
            <h4>Magnetic Field Caution</h4>
            <p>
              Keep mechanical watches away from high-powered neodymium magnets, laptop chargers, and magnetic bag clasps to prevent magnetization of the balance spring.
            </p>
          </div>
          <div class="guide-item">
            <span class="guide-icon">⚙️</span>
            <h4>Automatic Movement Winding</h4>
            <p>
              If your automatic watch has rested, manually wind the crown 20–30 turns clockwise in position 0 before strapping it on to establish optimal spring reserve.
            </p>
          </div>
          <div class="guide-item">
            <span class="guide-icon">✨</span>
            <h4>Case & Strap Cleaning</h4>
            <p>
              Wipe stainless steel cases with the provided microfiber cloth. Clean genuine leather straps with specialized conditioner and avoid prolonged water immersion.
            </p>
          </div>
        </div>
      </section>

      <!-- 4. Store Locator -->
      <section v-if="activeTab === 'locator'" class="care-card">
        <div class="section-title">
          <h2>📍 Flagship Boutiques & Salons</h2>
          <p>Experience our master collection in person with private horological consultations.</p>
        </div>

        <div class="boutiques-grid">
          <div class="boutique-card" v-for="b in boutiques" :key="b.city">
            <div class="b-city">{{ b.city }}</div>
            <h4>{{ b.name }}</h4>
            <p class="b-addr">{{ b.address }}</p>
            <div class="b-meta">
              <span>🕒 {{ b.hours }}</span>
              <span>📞 {{ b.phone }}</span>
            </div>
            <a :href="`tel:${b.phone}`" class="b-call-btn">Book VIP Consultation</a>
          </div>
        </div>
      </section>

      <!-- 5. Contact Us -->
      <section v-if="activeTab === 'contact'" class="care-card">
        <div class="section-title">
          <h2>💬 Contact Our Concierge</h2>
          <p>Have a bespoke acquisition query or need personalized styling advice?</p>
        </div>

        <div class="contact-grid">
          <div class="contact-card whatsapp">
            <div class="c-icon">💬</div>
            <h4>WhatsApp VIP Desk</h4>
            <p>Instant chat with our horology advisors for real-time stock verification and VIP deals.</p>
            <a
              href="https://instagram.com/radheassesories86?xtok=MXFlcGJzNm11d2RldQ=="
              target="_blank"
              class="contact-link"
            >
              Direct Instagram Concierge →
            </a>
          </div>

          <div class="contact-card email">
            <div class="c-icon">✉️</div>
            <h4>Email Inquiries</h4>
            <p>Detailed private portfolio reviews and corporate gifting inquiries.</p>
            <a href="mailto:concierge@radhetimepieces.com" class="contact-link">concierge@radhetimepieces.com</a>
          </div>

          <div class="contact-card phone">
            <div class="c-icon">📞</div>
            <h4>Phone Helpline</h4>
            <p>Monday to Saturday: 10:00 AM – 8:00 PM IST</p>
            <a href="tel:+912289004422" class="contact-link">+91 (022) 8900-4422</a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref('track')
const trackOrderNo = ref('')
const trackContact = ref('')
const trackLoading = ref(false)
const trackResult = ref(null)

const tabs = [
  { id: 'track', label: 'Track Order', icon: '📦' },
  { id: 'policy', label: 'Purchase Policy', icon: '📋' },
  { id: 'care', label: 'Watch Care Guide', icon: '⌚' },
  { id: 'locator', label: 'Store Locator', icon: '📍' },
  { id: 'contact', label: 'Contact Us', icon: '💬' }
]

const boutiques = [
  {
    city: 'Mumbai',
    name: 'Radhe Timepieces Flagship Salon',
    address: 'Level 1, Palladium Mall, High Street Phoenix, Lower Parel, Mumbai 400013',
    hours: '11:00 AM – 9:30 PM (Daily)',
    phone: '+91 (022) 8900-4422'
  },
  {
    city: 'Surat',
    name: 'Radhe Timepieces Heritage Gallery',
    address: 'Shop 12-14, Titanium Square, Ghod Dod Road, Surat 395007',
    hours: '10:30 AM – 8:30 PM (Daily)',
    phone: '+91 (261) 2200-8899'
  },
  {
    city: 'New Delhi',
    name: 'The Chanakya Boutique',
    address: 'Ground Floor, The Chanakya, Chanakyapuri, New Delhi 110021',
    hours: '11:00 AM – 9:00 PM (Daily)',
    phone: '+91 (011) 4566-7788'
  },
  {
    city: 'Bengaluru',
    name: 'UB City Salon & Service Centre',
    address: 'Collection UB City, Vittal Mallya Road, Bengaluru 560001',
    hours: '10:30 AM – 9:00 PM (Daily)',
    phone: '+91 (080) 3344-5566'
  }
]

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (route.query.tab) {
    activeTab.value = route.query.tab
  }
})

const lookupOrder = () => {
  trackLoading.value = true
  setTimeout(() => {
    trackLoading.value = false
    trackResult.value = {
      id: trackOrderNo.value.toUpperCase() || 'LUX-89420'
    }
  }, 700)
}
</script>

<style scoped>
.care-page {
  background: #faf8f5;
  min-height: 100vh;
  padding-bottom: 5rem;
}

.care-hero {
  background: linear-gradient(135deg, #181818 0%, #29241b 100%);
  color: #fff;
  padding: 4.5rem 1.5rem 3rem;
  text-align: center;
  border-bottom: 2px solid #C9A84C;
}
.care-hero-inner {
  max-width: 780px;
  margin: 0 auto;
}
.hero-tag {
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #C9A84C;
  font-weight: 600;
  display: block;
  margin-bottom: 0.75rem;
}
.care-hero h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.8rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #fff;
}
.hero-sub {
  font-family: 'Jost', sans-serif;
  font-size: 1.05rem;
  color: #d1c9b8;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Tabs */
.care-tabs-wrap {
  max-width: 1100px;
  margin: -1.8rem auto 2.5rem;
  padding: 0 1.5rem;
  position: relative;
  z-index: 3;
}
.care-tabs {
  background: #ffffff;
  border: 1px solid #ebdcc4;
  border-radius: 16px;
  padding: 6px;
  display: flex;
  gap: 6px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.06);
  overflow-x: auto;
}
.care-tab {
  flex: 1;
  min-width: 140px;
  padding: 0.85rem 1rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.care-tab.active {
  background: #1a1a1a;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}
.care-tab:hover:not(.active) {
  background: #fdfaf4;
  color: #C9A84C;
}

.care-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.care-card {
  background: #ffffff;
  border: 1px solid #ebdcc4;
  border-radius: 20px;
  padding: 2.75rem 3rem;
  box-shadow: 0 12px 36px rgba(0,0,0,0.04);
}
.section-title {
  margin-bottom: 2rem;
  text-align: center;
}
.section-title h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}
.section-title p {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  color: #777;
  margin: 0;
}

/* Track Form */
.track-form-box {
  max-width: 680px;
  margin: 0 auto;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.form-group label {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #666;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}
.form-group input {
  width: 100%;
  border: 1.5px solid #e0d5c0;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  background: #faf8f4;
  outline: none;
  box-sizing: border-box;
}
.form-group input:focus {
  border-color: #C9A84C;
  background: #fff;
}
.btn-gold {
  width: 100%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  border: none;
  padding: 0.95rem;
  border-radius: 12px;
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}
.btn-gold:hover { opacity: 0.95; transform: translateY(-1px); }

/* Track Result */
.track-status-box {
  margin-top: 2rem;
  background: #fdfaf4;
  border: 1px solid #ebdcc4;
  border-radius: 16px;
  padding: 1.75rem;
}
.ts-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f0e6d6;
  padding-bottom: 1rem;
}
.ts-badge {
  background: #e6f4ea;
  color: #137333;
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 0.4rem;
}
.ts-header h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  margin: 0 0 0.2rem;
}
.ts-sub {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  color: #666;
  margin: 0;
}
.ts-partner {
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #888;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-left: 0.5rem;
}
.timeline-step {
  display: flex;
  gap: 1rem;
  position: relative;
}
.timeline-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 28px;
  bottom: -15px;
  width: 2px;
  background: #e5dac7;
}
.t-dot {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem;
  background: #eee;
  color: #888;
  z-index: 1;
}
.timeline-step.completed .t-dot {
  background: #2e7d32;
  color: #fff;
}
.timeline-step.active .t-dot {
  background: #C9A84C;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(201,168,76,0.25);
}
.t-info strong {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.92rem;
  color: #1a1a1a;
}
.t-info span {
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #777;
}

/* Returns Grid */
.returns-steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;
}
.step-card {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 14px;
  padding: 1.5rem 1.25rem;
  text-align: center;
}
.step-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #C9A84C;
  margin-bottom: 0.4rem;
}
.step-card h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #1a1a1a;
}
.step-card p {
  font-family: 'Jost', sans-serif;
  font-size: 0.83rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}
.info-banner {
  background: #fff9e6;
  border-left: 4px solid #ffc107;
  padding: 1rem 1.25rem;
  border-radius: 0 10px 10px 0;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  color: #664d03;
}

/* Care Guide */
.care-guide-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.guide-item {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 14px;
  padding: 1.5rem;
}
.guide-icon { font-size: 2rem; margin-bottom: 0.6rem; display: block; }
.guide-item h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #1a1a1a;
}
.guide-item p {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* Boutiques */
.boutiques-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.boutique-card {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 14px;
  padding: 1.75rem;
}
.b-city {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #C9A84C;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.35rem;
}
.boutique-card h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 0.6rem;
  color: #1a1a1a;
}
.b-addr {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  color: #666;
  margin: 0 0 1rem;
  line-height: 1.5;
}
.b-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #555;
  margin-bottom: 1.25rem;
}
.b-call-btn {
  display: inline-block;
  background: #1a1a1a;
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}
.b-call-btn:hover { background: #C9A84C; }

/* Contact */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.contact-card {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 14px;
  padding: 1.75rem 1.25rem;
  text-align: center;
}
.c-icon { font-size: 2rem; margin-bottom: 0.6rem; }
.contact-card h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #1a1a1a;
}
.contact-card p {
  font-family: 'Jost', sans-serif;
  font-size: 0.84rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 1rem;
}
.contact-link {
  font-family: 'Jost', sans-serif;
  font-size: 0.86rem;
  color: #C9A84C;
  font-weight: 600;
  text-decoration: underline;
}

.policy-notice-box {
  background: #fffdf5;
  border: 1.5px solid #ebd08c;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}
.notice-badge {
  display: inline-block;
  background: #8B6914;
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}
.policy-notice-box h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.75rem;
}
.policy-notice-box p {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
  margin: 0 0 1rem;
}
.policy-bullets {
  font-family: 'Jost', sans-serif;
  font-size: 0.92rem;
  color: #444;
  line-height: 1.7;
  padding-left: 1.25rem;
  margin: 0;
}
.policy-bullets li {
  margin-bottom: 0.5rem;
}

@media (max-width: 800px) {
  .care-card { padding: 2rem 1.5rem; }
  .form-grid { grid-template-columns: 1fr; }
  .returns-steps-grid { grid-template-columns: 1fr 1fr; }
  .care-guide-grid { grid-template-columns: 1fr; }
  .boutiques-grid { grid-template-columns: 1fr; }
  .contact-grid { grid-template-columns: 1fr; }
}
</style>
