<template>
  <div class="simple-legal-page" id="terms-page">
    <div class="legal-card">
      <header class="legal-header">
        <div class="legal-brand">
          <img src="/radhe-timepieces-logo.svg" alt="Radhe Timepieces" class="legal-logo" />
        </div>
        <h1>Terms of Use</h1>
        <p class="legal-meta">Last Updated: October 2026 • Radhe Timepieces</p>
      </header>

      <div class="legal-body">
        <section class="policy-block">
          <h2>1. Overview & Agreement</h2>
          <p>
            Welcome to Radhe Timepieces. By browsing our website, submitting order inquiries, or purchasing products from us, you agree to these Terms of Use. Please review them carefully before placing any order.
          </p>
        </section>

        <!-- No Return, No Exchange, No Warranty Policy -->
        <section class="policy-block alert-block">
          <h2>⚠️ 2. No Return, No Exchange & No Warranty Policy</h2>
          <p><strong>Please note our firm purchase policy:</strong></p>
          <ul>
            <li><strong>All Sales Are Final:</strong> Once an order is confirmed, packed, or delivered, we do not accept returns, cancellations, or refund requests.</li>
            <li><strong>No Exchanges:</strong> We do not offer exchanges for any timepiece, size change, color preference, or design variation after purchase.</li>
            <li><strong>No Warranty Guarantees:</strong> All timepieces are sold on an "as-is" basis as inspected upon delivery. We do not provide manufacturer warranty, mechanical guarantees, or repair warranties.</li>
            <li><strong>Delivery Inspection:</strong> Clients are advised to thoroughly inspect the parcel condition upon delivery before accepting.</li>
          </ul>
        </section>

        <section class="policy-block">
          <h2>3. Pricing & "Price on Request"</h2>
          <p>
            Certain exclusive watches are labeled as <strong>✨ Price on Request</strong>. Submitting a request allows our sales team to provide direct availability, current market quotation, and delivery timelines via phone or WhatsApp.
          </p>
        </section>

        <section class="policy-block">
          <h2>4. Shipping & Delivery</h2>
          <p>
            Orders are packed carefully and dispatched through third-party courier services. Estimated transit times are shared upon dispatch confirmation.
          </p>
        </section>

        <section class="policy-block">
          <h2>5. Accuracy of Information</h2>
          <p>
            We strive to display watch images, dimensions, and colors as accurately as possible. However, slight variations may occur due to photography lighting and device screen calibrations.
          </p>
        </section>

        <section class="policy-block">
          <h2>6. Contact Us</h2>
          <p>If you have any questions regarding these terms, please contact our support team:</p>
          <div class="contact-box">
            <p><strong>Email:</strong> support@radhetimepieces.com</p>
            <p><strong>Instagram:</strong> <a href="https://instagram.com/radheassesories86?xtok=MXFlcGJzNm11d2RldQ==" target="_blank">@radheassesories86</a></p>
          </div>
        </section>
      </div>

      <footer class="legal-footer">
        <router-link to="/privacy" class="footer-link">Privacy Policy</router-link>
        <span class="sep">•</span>
        <router-link to="/" class="footer-link">Back to Home</router-link>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
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

.alert-block {
  background: #fffdf5;
  border: 1.5px solid #e8cb75;
  border-radius: 12px;
  padding: 1.5rem;
}
.alert-block h2 {
  color: #8B6914;
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
