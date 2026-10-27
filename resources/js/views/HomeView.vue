<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero" id="hero-section">
      <div class="hero-bg" :style="{ backgroundImage: `url(/images/hero_banner_bg.jpg)` }"></div>
      <div class="hero-overlay"></div>

      <div class="hero-container">
        <!-- Left Side Promotional Banners (Always Visible) -->
        <aside class="hero-left-banners" aria-label="Featured Promotions">
          <!-- Main Highlight Banner -->
          <div class="side-banner side-banner-featured" @click="$router.push('/shop?category=Women')">
            <div class="sb-img-wrap">
              <img src="/images/watch_fossil_gold_skeleton.jpg" alt="Fossil Skeleton Gold" />
              <div class="sb-gradient-overlay"></div>
              <span class="sb-tag">✨ SPECIAL EDITION</span>
            </div>
            <div class="sb-content">
              <span class="sb-sub">Handcrafted Luxury</span>
              <h4>Fossil Skeleton Gold</h4>
              <p class="sb-offer" v-if="!store.hidePrice">Up to 25% Off <span>• In Stock</span></p>
              <p class="sb-offer" v-else>✨ Price on Request <span>• In Stock</span></p>
              <router-link to="/shop?category=Women" class="sb-link" @click.stop>Shop Collection →</router-link>
            </div>
          </div>

          <!-- Secondary Bestseller Banner -->
          <div class="side-banner side-banner-secondary" @click="$router.push('/shop?category=Men')">
            <div class="sb-mini-row">
              <img src="/images/watch_armani_exchange_gold_chrono.jpg" alt="Armani Exchange Chronograph" class="sb-thumb" />
              <div class="sb-mini-info">
                <span class="sb-mini-tag">👑 BESTSELLER</span>
                <h5>Armani Exchange Chrono</h5>
                <p>Gold-Tone Quartz Edition</p>
              </div>
              <span class="sb-arrow">→</span>
            </div>
          </div>

          <!-- Luxury Trust Bar -->
          <div class="hero-trust-bar">
            <div class="htb-item"><span>🛡️</span> 100% Genuine</div>
            <div class="htb-dot">•</div>
            <div class="htb-item"><span>🚚</span> Free Express</div>
            <div class="htb-dot">•</div>
            <div class="htb-item"><span>✨</span> Quality Checked</div>
          </div>
        </aside>

        <!-- Center Main Content -->
        <div class="hero-content">
          <div class="hero-tag animate-up" style="animation-delay: 0.1s">✦ New Collection 2025</div>
          <h1 class="hero-title animate-up" style="animation-delay: 0.25s">
            Time Is The<br />
            Most Precious<br />
            <em>Luxury</em>
          </h1>
          <p class="hero-subtitle animate-up" style="animation-delay: 0.4s">
            Discover Luxoria's exclusive collection of handcrafted timepieces.<br />
            Swiss precision meets Indian elegance.
          </p>
          <div class="hero-actions animate-up" style="animation-delay: 0.55s">
            <router-link to="/shop" class="btn-primary" id="hero-shop-btn">Explore Collection</router-link>
            <router-link to="/shop?category=Women" class="btn-outline" id="hero-womens-btn">Women's ↗</router-link>
          </div>
          <div class="hero-stats animate-up" style="animation-delay: 0.7s">
            <div class="stat">
              <strong>100%</strong>
              <span>Verified Authentic</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <strong>{{ totalCount }}</strong>
              <span>Curated Designs</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <strong>4.9★</strong>
              <span>Customer Rating</span>
            </div>
          </div>
        </div>

        <!-- Right Watch Showcase -->
        <div class="hero-watch animate-float">
          <img src="/images/watch_bell_ross_cyber_skeleton.jpg" alt="Featured Luxury Watch" class="hero-watch-img" />
          <div class="hero-watch-card">
            <p class="card-badge">Featured Masterpiece</p>
            <h3>Bell & Ross Cyber Skeleton</h3>
            <p class="card-price" v-if="!store.hidePrice">₹24,995</p>
            <p class="card-price-request" v-else>✨ Price on Request</p>
            <router-link to="/product/1" class="card-link" id="hero-featured-link">View Details →</router-link>
          </div>
        </div>
      </div>

    </section>

    <!-- Categories Scroll -->
    <section class="categories-section" id="categories-section">
      <div class="section-header">
        <span class="section-pre">Browse by Style</span>
        <h2>Our Collections</h2>
        <p>Timepieces crafted for every occasion and personality</p>
      </div>
      <div class="categories-grid">
        <div
          v-for="cat in displayCategories"
          :key="cat.id"
          class="category-card"
          @click="$router.push(`/shop?category=${cat.id}`)"
          :id="`category-card-${cat.id}`"
        >
          <div class="cat-icon">{{ cat.icon }}</div>
          <h3>{{ cat.label }}</h3>
          <p>{{ cat.count }}</p>
          <span class="cat-arrow">→</span>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="products-section" id="featured-products-section">
      <div class="section-header">
        <span class="section-pre">Curated for You</span>
        <h2>Bestselling Timepieces</h2>
        <p>Our most-loved watches, chosen by thousands of discerning customers</p>
      </div>
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab"
          class="filter-tab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
          :id="`filter-tab-${tab.toLowerCase().replace(' ', '-')}`"
        >{{ tab }}</button>
      </div>
      <div class="products-grid">
        <ProductCard v-for="p in filteredProducts" :key="p.id" :product="p" />
      </div>
      <div class="section-cta">
        <router-link to="/shop" class="btn-primary" id="view-all-btn">View All Watches</router-link>
      </div>
    </section>

    <!-- Promo Banner -->
    <section class="promo-banner" id="promo-section">
      <div class="promo-inner">
        <div class="promo-item promo-gold">
          <div class="promo-content">
            <span class="promo-tag">Limited Time</span>
            <h3>Festival Season Sale</h3>
            <p>Up to 30% off on select collections</p>
            <router-link to="/offers" class="promo-btn" id="promo-sale-btn">Shop Sale →</router-link>
          </div>
          <div class="promo-badge">30% OFF</div>
        </div>
        <div class="promo-item promo-dark">
          <div class="promo-content">
            <span class="promo-tag">New In</span>
            <h3>Heritage Collection</h3>
            <p>Vintage-inspired elegance for the modern connoisseur</p>
            <router-link to="/shop?type=Classic" class="promo-btn promo-btn-light" id="promo-heritage-btn">Discover →</router-link>
          </div>
          <img src="/images/watch_vintage_brown.jpg" alt="Heritage Collection" class="promo-img" />
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section" id="testimonials-section">
      <div class="section-header light">
        <span class="section-pre">What They Say</span>
        <h2>Customer Stories</h2>
        <p>Real experiences from our valued customers</p>
      </div>
      <div class="testimonials-grid">
        <div v-for="t in testimonials" :key="t.id" class="testimonial-card">
          <div class="stars-row">
            <span v-for="i in 5" :key="i" class="t-star" :class="{ filled: i <= t.rating }">★</span>
          </div>
          <p class="t-text">"{{ t.text }}"</p>
          <div class="t-footer">
            <div class="t-avatar">{{ t.avatar }}</div>
            <div>
              <strong>{{ t.name }}</strong>
              <p>{{ t.location }} · {{ t.product }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Promise -->
    <section class="promise-section" id="promise-section">
      <div class="promise-inner">
        <div class="promise-text">
          <span class="section-pre">Our Commitment</span>
          <h2>Crafted to Last a Lifetime</h2>
          <p>At Luxoria, every watch undergoes 200+ quality checks before reaching your wrist. We use only the finest Swiss movements, scratch-resistant sapphire crystals, and premium materials sourced from the world's best suppliers.</p>
          <div class="promise-features">
            <div class="pf-item">
              <span>⚙️</span>
              <div>
                <strong>Swiss Precision</strong>
                <p>Mechanical excellence</p>
              </div>
            </div>
            <div class="pf-item">
              <span>💎</span>
              <div>
                <strong>Premium Materials</strong>
                <p>Sapphire, steel, leather</p>
              </div>
            </div>
          </div>
          <router-link to="/shop" class="btn-primary" id="promise-shop-btn">Explore Our Craft</router-link>
        </div>
        <div class="promise-images">
          <img src="/images/watch_bell_ross_cyber_skeleton.jpg" alt="Precision Craftsmanship" class="promise-img-main" />
          <img src="/images/watch_armani_exchange_gold_chrono.jpg" alt="Premium Materials" class="promise-img-secondary" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { categories, testimonials, products as defaultProducts } from '../data/products'
import { store } from '../store'

const filterTabs = ['All', 'Men', 'Women', 'Classic', 'Smart', 'Couple']
const activeTab = ref('All')

const totalCount = computed(() => store.products?.length || defaultProducts.length)

const displayCategories = computed(() => {
  const list = store.products?.length ? store.products : defaultProducts
  const base = [
    { id: 'Men', label: "Men's Luxury", icon: '🏆' },
    { id: 'Women', label: "Women's Collection", icon: '💎' },
    { id: 'Classic', label: 'Classic & Automatic', icon: '⌚' },
    { id: 'Smart', label: 'Smart Watches', icon: '📱' },
    { id: 'Couple', label: 'Couples Sets', icon: '💑' },
    { id: 'Sport', label: 'Sport Chrono', icon: '🏅' },
  ]
  return base.map(cat => {
    let count = list.filter(p => p.category === cat.id).length
    if (cat.id === 'Sport' && count === 0) {
      count = list.filter(p => p.category === 'Sport' || p.type?.toLowerCase().includes('chrono') || p.type?.toLowerCase().includes('sport')).length
    }
    return {
      ...cat,
      count: `${count} ${count === 1 ? 'Timepiece' : 'Timepieces'}`
    }
  })
})

const filteredProducts = computed(() => {
  const list = store.products?.length ? store.products : defaultProducts
  if (activeTab.value === 'All') return list
  return list.filter(p => p.category === activeTab.value)
})
</script>

<style scoped>
/* Hero */
.hero {
  min-height: calc(100vh - 72px);
  position: relative;
  display: flex;
  align-items: center;
  padding: 6.5rem 2rem 3rem;
  overflow: visible;
}
.hero-bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(1.05);
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,252,245,0.92) 50%, rgba(255,248,230,0.4) 100%);
}
.hero-container {
  position: relative;
  z-index: 2;
  max-width: 1420px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 320px minmax(340px, 1fr) 360px;
  gap: 2.5rem;
  align-items: center;
}

/* Left Banners */
.hero-left-banners {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  width: 100%;
  opacity: 1 !important;
  visibility: visible !important;
}
.side-banner {
  background: #ffffff;
  border: 1.5px solid rgba(201, 168, 76, 0.4);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(201, 168, 76, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.side-banner:hover {
  transform: translateY(-4px);
  border-color: #C9A84C;
  box-shadow: 0 20px 48px rgba(201, 168, 76, 0.25);
}
.side-banner-featured .sb-img-wrap {
  position: relative;
  height: 155px;
  overflow: hidden;
}
.side-banner-featured .sb-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.side-banner:hover .sb-img-wrap img {
  transform: scale(1.06);
}
.sb-gradient-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%);
}
.sb-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #C9A84C;
  color: #1a1a1a;
  font-family: 'Jost', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 2;
}
.sb-content {
  padding: 1rem 1.15rem;
}
.sb-sub {
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 0.25rem;
}
.sb-content h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.3rem;
  line-height: 1.2;
}
.sb-offer {
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #C9A84C;
  margin: 0 0 0.75rem;
}
.sb-offer span {
  color: #888;
  font-weight: 400;
  font-size: 0.78rem;
}
.sb-link {
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: #1a1a1a;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s, transform 0.2s;
}
.sb-link:hover {
  color: #C9A84C;
  transform: translateX(3px);
}

/* Secondary Banner */
.side-banner-secondary {
  padding: 0.85rem 1rem;
}
.sb-mini-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.sb-thumb {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #ebd9b8;
}
.sb-mini-info {
  flex: 1;
  min-width: 0;
}
.sb-mini-tag {
  font-family: 'Jost', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  color: #C9A84C;
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: 0.15rem;
}
.sb-mini-info h5 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sb-mini-info p {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  color: #777;
  margin: 0;
}
.sb-arrow {
  color: #C9A84C;
  font-size: 1.1rem;
  transition: transform 0.25s;
}
.side-banner-secondary:hover .sb-arrow {
  transform: translateX(4px);
}

/* Trust Bar */
.hero-trust-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  padding: 0.65rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(201, 168, 76, 0.2);
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  color: #555;
}
.htb-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.htb-dot {
  color: #C9A84C;
  font-size: 0.8rem;
}

/* Center Content */
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 580px;
}
.hero-tag {
  display: inline-block;
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #C9A84C;
  background: rgba(201,168,76,0.08);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(201,168,76,0.3);
  margin-bottom: 1.5rem;
}
.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 5.5vw, 5rem);
  font-weight: 600;
  line-height: 1.08;
  color: #1a1a1a;
  margin: 0 0 1.5rem;
}
.hero-title em {
  font-style: italic;
  color: #C9A84C;
}
.hero-subtitle {
  font-family: 'Jost', sans-serif;
  font-size: 1.05rem;
  line-height: 1.75;
  color: #5a5048;
  margin: 0 0 2.5rem;
  font-weight: 300;
}
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem; }
.btn-primary {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  padding: 0.9rem 2rem;
  border-radius: 12px;
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: all 0.3s ease;
  box-shadow: 0 6px 24px rgba(201,168,76,0.3);
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201,168,76,0.4); }
.btn-outline {
  display: inline-flex;
  align-items: center;
  background: transparent;
  color: #1a1a1a;
  padding: 0.9rem 2rem;
  border-radius: 12px;
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  border: 1.5px solid #1a1a1a;
  transition: all 0.25s;
}
.btn-outline:hover { background: #1a1a1a; color: #fff; }
.hero-stats { display: flex; align-items: center; gap: 1.5rem; }
.stat strong {
  display: block;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1;
}
.stat span {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.stat-divider { width: 1px; height: 36px; background: #e0d5c0; }
.hero-watch {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}
.hero-watch-img {
  width: min(420px, 45vw);
  height: min(420px, 45vw);
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 30px 80px rgba(0,0,0,0.12), 0 0 0 16px rgba(201,168,76,0.08);
}
.hero-watch-card {
  position: absolute;
  bottom: 20px; left: -20px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  border: 1px solid #e8d9b0;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  min-width: 170px;
}
.card-badge {
  font-family: 'Jost', sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  color: #C9A84C;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 0.25rem;
}
.hero-watch-card h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem;
}
.card-price {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #C9A84C;
  margin: 0 0 0.5rem;
}
.card-link {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #555;
  text-decoration: none;
  transition: color 0.2s;
}
.card-link:hover { color: #C9A84C; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
.animate-float { animation: float 6s ease-in-out infinite; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
.animate-up { animation: fadeUp 0.7s ease both; }
.scroll-hint {
  position: absolute;
  bottom: 2rem; left: 50%;
  transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  z-index: 2;
}
.scroll-line {
  width: 1.5px; height: 48px;
  background: linear-gradient(to bottom, #C9A84C, transparent);
  animation: scroll-hint 1.8s ease-in-out infinite;
}
@keyframes scroll-hint { 0%, 100% { transform: scaleY(1); opacity: 1; } 50% { transform: scaleY(0.5); opacity: 0.4; } }
.scroll-hint span {
  font-family: 'Jost', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: #aaa;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Sections */
.categories-section, .products-section, .testimonials-section, .promise-section {
  padding: 5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
.testimonials-section { max-width: 100%; background: #faf8f4; padding: 5rem 2rem; }
.promise-section { max-width: 100%; background: #fff; padding: 5rem 2rem; }
.section-header { text-align: center; margin-bottom: 3rem; }
.section-pre {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #C9A84C;
  display: block;
  margin-bottom: 0.6rem;
}
.section-header h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 3.5vw, 2.8rem);
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.75rem;
}
.section-header p {
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  color: #777;
  max-width: 500px;
  margin: 0 auto;
  font-weight: 300;
}

/* Categories */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}
.category-card {
  background: #fff;
  border: 1px solid #f0e8d8;
  border-radius: 16px;
  padding: 1.75rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.category-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(201,168,76,0.05), rgba(201,168,76,0));
  opacity: 0;
  transition: opacity 0.3s;
}
.category-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(201,168,76,0.12); border-color: #e0cfa0; }
.category-card:hover::before { opacity: 1; }
.cat-icon { font-size: 2rem; margin-bottom: 0.75rem; }
.category-card h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.2rem;
}
.category-card p {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #999;
  margin: 0 0 0.75rem;
}
.cat-arrow {
  font-size: 1rem;
  color: #C9A84C;
  opacity: 0;
  transition: all 0.25s;
}
.category-card:hover .cat-arrow { opacity: 1; }

/* Product Tabs */
.filter-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
.filter-tab {
  background: #f5f0e8;
  border: 1px solid transparent;
  padding: 0.55rem 1.25rem;
  border-radius: 30px;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #666;
  cursor: pointer;
  transition: all 0.25s;
}
.filter-tab:hover { border-color: #C9A84C; color: #C9A84C; }
.filter-tab.active { background: #C9A84C; color: #fff; border-color: #C9A84C; }
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.section-cta { text-align: center; margin-top: 2.5rem; }

/* Promo Banner */
.promo-banner { padding: 0 2rem 5rem; max-width: 1400px; margin: 0 auto; }
.promo-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.promo-item {
  border-radius: 20px;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  min-height: 260px;
  display: flex;
  align-items: center;
}
.promo-gold { background: linear-gradient(135deg, #C9A84C 0%, #8B6914 100%); }
.promo-dark { background: #1a1a1a; }
.promo-content { position: relative; z-index: 2; }
.promo-tag {
  font-family: 'Jost', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
  display: block;
  margin-bottom: 0.5rem;
}
.promo-item h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.5rem;
}
.promo-item p {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  margin: 0 0 1.5rem;
  font-weight: 300;
}
.promo-btn {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  color: #fff;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.3);
  transition: all 0.25s;
  backdrop-filter: blur(4px);
}
.promo-btn:hover { background: rgba(255,255,255,0.25); }
.promo-btn-light { background: #fff; color: #1a1a1a; }
.promo-btn-light:hover { background: #C9A84C; color: #fff; border-color: #C9A84C; }
.promo-badge {
  position: absolute;
  right: 2rem; top: 50%;
  transform: translateY(-50%);
  font-family: 'Cormorant Garamond', serif;
  font-size: 4rem;
  font-weight: 700;
  color: rgba(255,255,255,0.12);
  line-height: 1;
}
.promo-img {
  position: absolute;
  right: 0; bottom: 0;
  height: 100%;
  width: 50%;
  object-fit: cover;
  opacity: 0.4;
  mask-image: linear-gradient(to right, transparent, rgba(0,0,0,0.8));
}

/* Testimonials */
.testimonials-grid {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.testimonial-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid #e8dfc8;
  transition: all 0.3s ease;
}
.testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(201,168,76,0.1); }
.stars-row { display: flex; gap: 2px; margin-bottom: 1rem; }
.t-star { color: #ddd; font-size: 0.95rem; }
.t-star.filled { color: #f59e0b; }
.t-text {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  line-height: 1.75;
  color: #555;
  margin: 0 0 1.25rem;
  font-weight: 300;
  font-style: italic;
}
.t-footer { display: flex; align-items: center; gap: 0.75rem; }
.t-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.t-footer strong {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a;
  display: block;
}
.t-footer p {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  color: #999;
  margin: 0;
}

/* Promise */
.promise-inner {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}
.promise-text .section-pre { text-align: left; }
.promise-text h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem;
  text-align: left;
}
.promise-text > p {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 2rem;
  font-weight: 300;
}
.promise-features { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
.pf-item { display: flex; align-items: center; gap: 1rem; }
.pf-item > span { font-size: 1.5rem; flex-shrink: 0; }
.pf-item strong {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  display: block;
}
.pf-item p { font-family: 'Jost', sans-serif; font-size: 0.8rem; color: #888; margin: 0; }
.promise-images { position: relative; height: 500px; }
.promise-img-main {
  position: absolute;
  top: 0; right: 0;
  width: 78%;
  height: 78%;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.12);
}
.promise-img-secondary {
  position: absolute;
  bottom: 0; left: 0;
  width: 55%;
  height: 52%;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.1);
  border: 4px solid #fff;
}

@media (max-width: 1280px) {
  .hero-container { grid-template-columns: 290px 1fr 320px; gap: 1.5rem; }
  .hero-watch-img { width: 320px; height: 320px; }
  .categories-grid { grid-template-columns: repeat(3, 1fr); }
  .products-grid { grid-template-columns: repeat(3, 1fr); }
  .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 1024px) {
  .hero-container { grid-template-columns: 300px 1fr; gap: 2rem; }
  .hero-watch { display: none; }
  .hero-left-banners { width: 100%; }
}
@media (max-width: 768px) {
  .hero { padding: 5.5rem 1rem 2.5rem; }
  .hero-container { grid-template-columns: 1fr; text-align: center; gap: 2rem; }
  .hero-left-banners { max-width: 420px; margin: 0 auto; }
  .hero-actions { justify-content: center; }
  .hero-stats { justify-content: center; flex-wrap: wrap; }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .promo-inner { grid-template-columns: 1fr; }
  .promise-inner { grid-template-columns: 1fr; }
  .promise-images { display: none; }
}
@media (max-width: 640px) {
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .products-grid { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
}
</style>
