<template>
  <div class="simple-legal-page" id="privacy-page">
    <div class="legal-card">
      <header class="legal-header">
        <div class="legal-brand">
          <img src="/radhe-timepieces-logo.svg" alt="Radhe Timepieces" class="legal-logo" />
        </div>
        <h1>Privacy Policy</h1>
        <p class="legal-meta">Last Updated: October 2026 • Radhe Timepieces</p>
      </header>

      <div class="legal-body">
        <section class="policy-block">
          <h2>1. Introduction</h2>
          <p>
            At Radhe Timepieces, we value your privacy and trust. This Privacy Policy outlines what information we collect when you visit our website, place orders, or contact our team, and how that information is used.
          </p>
        </section>

        <section class="policy-block">
          <h2>2. Information We Collect</h2>
          <p>We only collect information necessary to fulfill orders and communicate with you:</p>
          <ul>
            <li><strong>Contact Details:</strong> Your name, email address, phone number, and delivery address.</li>
            <li><strong>Order Details:</strong> Products ordered, order preferences, and transaction inquiries.</li>
            <li><strong>Account Data:</strong> If you create an account, we store your email, encrypted password, and saved favorite watches.</li>
          </ul>
          <p class="note-text">
            <em>Note: We do not store your debit/credit card numbers or online banking passwords on our servers.</em>
          </p>
        </section>

        <section class="policy-block">
          <h2>3. How We Use Your Information</h2>
          <p>Your details are used strictly for:</p>
          <ul>
            <li>Processing and delivering your orders.</li>
            <li>Contacting you regarding "Price on Request" inquiries and order status.</li>
            <li>Saving your favorites and cart items across your visits.</li>
          </ul>
          <p>We do not sell, rent, or trade your personal data to external advertisers.</p>
        </section>

        <!-- Cookie Settings Section -->
        <section id="cookies" class="policy-block cookie-block">
          <h2>4. Cookies & Cookie Settings</h2>
          <p>
            We use simple cookies and local browser storage strictly to remember your login session, shopping cart items, and wishlist preferences.
          </p>
          <div class="cookie-toggle-box">
            <div class="cookie-item">
              <div>
                <strong>Essential Cookies & Storage</strong>
                <p>Required for shopping cart, login, and basic site navigation.</p>
              </div>
              <span class="badge-always">Always Active</span>
            </div>
            <div class="cookie-item">
              <div>
                <strong>Preference Cookies</strong>
                <p>Remembers your saved wishlist watches and device preferences.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="preferenceCookies" @change="saveCookiePrefs" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <p v-if="savedMsg" class="saved-msg">{{ savedMsg }}</p>
        </section>

        <section class="policy-block">
          <h2>5. Security</h2>
          <p>
            We use standard industry security measures and encrypted connections to keep your personal data safe from unauthorized access.
          </p>
        </section>

        <section class="policy-block">
          <h2>6. Contact Us</h2>
          <p>For any privacy or personal data questions, reach out to us:</p>
          <div class="contact-box">
            <p><strong>Email:</strong> privacy@radhetimepieces.com</p>
            <p><strong>Instagram:</strong> <a href="https://instagram.com/radheassesories86?xtok=MXFlcGJzNm11d2RldQ==" target="_blank">@radheassesories86</a></p>
          </div>
        </section>
      </div>

      <footer class="legal-footer">
        <router-link to="/terms" class="footer-link">Terms of Use</router-link>
        <span class="sep">•</span>
        <router-link to="/" class="footer-link">Back to Home</router-link>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const preferenceCookies = ref(true)
const savedMsg = ref('')

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const saved = localStorage.getItem('rt_pref_cookies')
  if (saved !== null) {
    preferenceCookies.value = saved === 'true'
  }
})

const saveCookiePrefs = () => {
  localStorage.setItem('rt_pref_cookies', preferenceCookies.value.toString())
  savedMsg.value = '✓ Cookie preferences updated!'
  setTimeout(() => { savedMsg.value = '' }, 2500)
}
</script>

<style scoped>
.simple-legal-page {
  background: #faf8f5;
  min-height: 100vh;
  padding: 3rem 1.25rem 5rem;
  display: flex;
  justify-content: center;
}
.legal-card {
  background: #ffffff;
  border: 1px solid #ebdcc4;
  border-radius: 18px;
  max-width: 800px;
  width: 100%;
  padding: 3rem 3.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
}
.legal-header {
  text-align: center;
  border-bottom: 1px solid #f0e6d6;
  padding-bottom: 2rem;
  margin-bottom: 2.25rem;
}
.legal-brand {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.legal-logo {
  height: 48px;
  width: auto;
  object-fit: contain;
}
.legal-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.4rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}
.legal-meta {
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

.legal-body {
  font-family: 'Jost', sans-serif;
  color: #444;
  line-height: 1.7;
}
.policy-block {
  margin-bottom: 2rem;
}
.policy-block h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.45rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.6rem;
}
.policy-block p {
  font-size: 0.95rem;
  margin: 0 0 0.75rem;
}
.policy-block ul {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
  font-size: 0.93rem;
}
.policy-block li {
  margin-bottom: 0.4rem;
}
.note-text {
  font-size: 0.88rem;
  color: #777;
}

/* Cookie Settings */
.cookie-block {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 12px;
  padding: 1.5rem;
}
.cookie-toggle-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.cookie-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee4d4;
}
.cookie-item:last-child {
  border-bottom: none;
}
.cookie-item strong {
  display: block;
  font-size: 0.95rem;
  color: #1a1a1a;
}
.cookie-item p {
  font-size: 0.82rem;
  color: #777;
  margin: 0.2rem 0 0;
}
.badge-always {
  background: #e6f4ea;
  color: #137333;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; cursor: pointer; inset: 0;
  background-color: #ccc;
  transition: .3s;
  border-radius: 24px;
}
.slider:before {
  position: absolute; content: ""; height: 18px; width: 18px;
  left: 3px; bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}
input:checked + .slider { background-color: #C9A84C; }
input:checked + .slider:before { transform: translateX(20px); }

.saved-msg {
  font-size: 0.85rem;
  color: #2e7d32;
  font-weight: 500;
  margin-top: 0.75rem;
}

.contact-box {
  background: #faf8f4;
  border: 1px solid #ebdcc4;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-top: 0.75rem;
}
.contact-box p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}
.contact-box a {
  color: #C9A84C;
  font-weight: 500;
  text-decoration: underline;
}

.legal-footer {
  text-align: center;
  border-top: 1px solid #f0e6d6;
  padding-top: 1.75rem;
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}
.footer-link {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  color: #C9A84C;
  text-decoration: none;
  font-weight: 500;
}
.footer-link:hover { text-decoration: underline; }
.sep { color: #ccc; }

@media (max-width: 600px) {
  .legal-card { padding: 2rem 1.5rem; }
  .legal-header h1 { font-size: 2rem; }
}
</style>
