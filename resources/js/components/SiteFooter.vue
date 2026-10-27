<template>
  <footer class="site-footer">
    <!-- Newsletter -->
    <div class="newsletter-section">
      <div class="newsletter-inner">
        <div class="newsletter-text">
          <h2>Stay in the Loop</h2>
          <p>Subscribe for exclusive deals, new arrivals, and timepiece insights.</p>
        </div>
        <form class="newsletter-form" @submit.prevent="subscribe" id="newsletter-form">
          <input
            type="email"
            v-model="email"
            placeholder="Your email address"
            class="nl-input"
            id="newsletter-email-input"
            required
          />
          <button type="submit" class="nl-btn" id="newsletter-submit-btn">
            {{ subscribed ? '✓ Subscribed!' : 'Subscribe' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="footer-main">
      <div class="footer-container">
        <!-- Brand Column -->
        <div class="footer-brand">
          <router-link to="/" class="footer-logo" aria-label="Radhe Timepieces">
            <img src="/radhe-timepieces-logo-light.svg" alt="Radhe Timepieces" class="footer-logo-img" />
          </router-link>
          <p class="brand-desc">
            Crafting moments of elegance since 1987. Every timepiece is a testament to Swiss precision and timeless design.
          </p>
          <div class="social-links">
            <a
              href="https://instagram.com/radheassesories86?xtok=MXFlcGJzNm11d2RldQ=="
              target="_blank"
              rel="noopener noreferrer"
              class="social-link instagram-only"
              aria-label="Follow us on Instagram @radheassesories86"
              id="footer-instagram-link"
              title="Follow @radheassesories86 on Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <span>Follow @radheassesories86</span>
            </a>
          </div>
        </div>

        <!-- Collections -->
        <div class="footer-col">
          <h4>Collections</h4>
          <ul>
            <li><router-link to="/shop?category=Women">Women's Watches</router-link></li>
            <li><router-link to="/shop?category=Men">Men's Watches</router-link></li>
            <li><router-link to="/shop?category=Smart">Smart Watches</router-link></li>
            <li><router-link to="/shop?category=Couple">Couple Watches</router-link></li>
            <li><router-link to="/shop?category=Sport">Sport Watches</router-link></li>
            <li><router-link to="/shop">New Arrivals</router-link></li>
          </ul>
        </div>

        <!-- Customer Care -->
        <div class="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><router-link to="/customer-care?tab=track">Track My Order</router-link></li>
            <li><router-link to="/customer-care?tab=policy">Purchase Policy</router-link></li>
            <li><router-link to="/customer-care?tab=care">Watch Care Guide</router-link></li>
            <li><router-link to="/customer-care?tab=locator">Store Locator</router-link></li>
            <li><router-link to="/customer-care?tab=contact">Contact Us</router-link></li>
          </ul>
        </div>

        <!-- Company -->
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><router-link to="/about?section=story">About Radhe Timepieces</router-link></li>
            <li><router-link to="/about?section=craftsmen">Our Craftsmen</router-link></li>
            <li><router-link to="/about?section=sustainability">Sustainability</router-link></li>
            <li><router-link to="/about?section=press">Press & Media</router-link></li>
            <li><router-link to="/about?section=careers">Careers</router-link></li>
            <li><router-link to="/about?section=blog">Blog / Journal</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <p>© {{ year }} Radhe Timepieces Pvt. Ltd. All rights reserved.</p>
      <div class="bottom-links">
        <router-link to="/privacy">Privacy Policy</router-link>
        <router-link to="/terms">Terms of Use</router-link>
        <router-link to="/privacy#cookies">Cookie Settings</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
const email = ref('')
const subscribed = ref(false)
const year = new Date().getFullYear()
const subscribe = () => {
  if (email.value) {
    subscribed.value = true
    setTimeout(() => { subscribed.value = false; email.value = '' }, 3000)
  }
}
</script>

<style scoped>
.site-footer { background: #0f0e0c; color: #c9c2b8; }
.newsletter-section {
  background: linear-gradient(135deg, #C9A84C 0%, #8B6914 50%, #6B4A1E 100%);
  padding: 3.5rem 2rem;
}
.newsletter-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
.newsletter-text h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.4rem;
}
.newsletter-text p {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.85);
  margin: 0;
}
.newsletter-form { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.nl-input {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.4);
  color: #fff;
  padding: 0.8rem 1.25rem;
  border-radius: 10px;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  width: 280px;
  outline: none;
  transition: border-color 0.2s;
  backdrop-filter: blur(4px);
}
.nl-input::placeholder { color: rgba(255,255,255,0.65); }
.nl-input:focus { border-color: rgba(255,255,255,0.8); }
.nl-btn {
  background: #fff;
  color: #8B6914;
  border: none;
  padding: 0.8rem 1.75rem;
  border-radius: 10px;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s;
}
.nl-btn:hover { background: #1a1a1a; color: #C9A84C; }
.footer-main { padding: 4rem 2rem; }
.footer-container {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 3rem;
}
.footer-logo {
  display: inline-flex;
  align-items: center;
  margin-bottom: 1.25rem;
  text-decoration: none;
}
.footer-logo-img {
  height: 56px;
  width: auto;
  max-width: 170px;
  object-fit: contain;
  transition: transform 0.25s ease;
}
.footer-logo:hover .footer-logo-img {
  transform: scale(1.04);
}
.brand-desc {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  line-height: 1.7;
  color: #8a8070;
  margin-bottom: 1.5rem;
}
.social-links { display: flex; gap: 0.75rem; }
.social-link {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1px solid #333;
  display: flex; align-items: center; justify-content: center;
  color: #8a8070;
  text-decoration: none;
  transition: all 0.25s;
}
.social-link:hover { border-color: #C9A84C; color: #C9A84C; background: rgba(201,168,76,0.1); }
.social-link.instagram-only {
  width: auto;
  height: 42px;
  border-radius: 999px;
  padding: 0 1.15rem;
  gap: 0.6rem;
  border: 1px solid rgba(201, 168, 76, 0.4);
  background: rgba(201, 168, 76, 0.08);
  color: #C9A84C;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}
.social-link.instagram-only:hover {
  background: #C9A84C;
  color: #111;
  border-color: #C9A84C;
  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.35);
  transform: translateY(-2px);
}
.footer-col h4 {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0 0 1.25rem;
}
.footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
.footer-col a,
.footer-text {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  color: #7a7468;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-col a:hover { color: #C9A84C; }
.trust-bar {
  border-top: 1px solid #1f1e1c;
  padding: 2rem;
}
.trust-inner {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.trust-item > span { font-size: 1.6rem; flex-shrink: 0; }
.trust-item strong {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #c9c2b8;
  margin-bottom: 0.1rem;
}
.trust-item p { font-family: 'Jost', sans-serif; font-size: 0.75rem; color: #7a7468; margin: 0; }
.footer-bottom {
  border-top: 1px solid #1f1e1c;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  max-width: 1300px;
  margin: 0 auto;
}
.footer-bottom p {
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  margin: 0;
}
.bottom-links { display: flex; gap: 1.25rem; }
.bottom-links a {
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  color: #c9bcad;
  text-decoration: none;
  transition: color 0.2s;
}
.bottom-links a:hover { color: #C9A84C; }
@media (max-width: 960px) {
  .footer-container { grid-template-columns: 1fr 1fr; }
  .trust-inner { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .newsletter-inner { flex-direction: column; }
  .nl-input { width: 100%; }
  .footer-container { grid-template-columns: 1fr; }
  .trust-inner { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; text-align: center; }
}
</style>
