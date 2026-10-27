<template>
  <div class="about-page" id="about-page">
    <!-- Hero Banner -->
    <header class="about-hero">
      <div class="about-hero-inner">
        <span class="hero-tag">Radhe Timepieces • Est. 1987</span>
        <h1>The Art of Timeless Precision</h1>
        <p class="hero-sub">
          Where classical Swiss horology meets modern aesthetic mastery. Discover the story, philosophy, and craftsmen behind Radhe Timepieces.
        </p>
      </div>
    </header>

    <!-- Navigation Pills -->
    <div class="about-nav-wrap">
      <div class="about-nav">
        <button
          v-for="s in sections"
          :key="s.id"
          class="nav-pill"
          :class="{ active: currentSection === s.id }"
          @click="currentSection = s.id"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <div class="about-container">
      <!-- 1. Heritage Story -->
      <section v-if="currentSection === 'story'" class="about-card">
        <div class="story-grid">
          <div class="story-text">
            <span class="sub-heading">OUR HERITAGE</span>
            <h2>Nearly Four Decades of Horological Distinction</h2>
            <p>
              Founded in 1987, Radhe Timepieces was born out of an uncompromising reverence for mechanical horology. What began as an intimate atelier in Mumbai dedicated to vintage chronograph restorations has evolved into an internationally acclaimed purveyor of fine timepieces.
            </p>
            <p>
              Every timepiece we curate or craft is imbued with an enduring promise: flawless mechanical integrity, hand-finished cases, and timeless silhouettes designed to be passed down through generations.
            </p>
            <div class="quote-box">
              <p>“A great watch does not merely count seconds; it preserves the memories and milestones of a lifetime.”</p>
              <span>— Founder & Master Horologist</span>
            </div>
          </div>
          <div class="story-stats">
            <div class="stat-card">
              <h3>1987</h3>
              <p>Year of Founding</p>
            </div>
            <div class="stat-card">
              <h3>100%</h3>
              <p>Swiss Precision Tested</p>
            </div>
            <div class="stat-card">
              <h3>24-Mo</h3>
              <p>International Warranty</p>
            </div>
            <div class="stat-card">
              <h3>50,000+</h3>
              <p>Discerning Clients Globally</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Master Craftsmen -->
      <section v-if="currentSection === 'craftsmen'" class="about-card">
        <div class="centered-head">
          <span class="sub-heading">ATELIER MASTERY</span>
          <h2>The Hands Behind The Complications</h2>
          <p>Our watchmakers train for over a decade to master the delicate art of micro-mechanical assembly.</p>
        </div>

        <div class="craft-grid">
          <div class="craft-card">
            <span class="craft-icon">🔬</span>
            <h4>Chronometer Tolerances</h4>
            <p>Each movement is regulated in 5 distinct positions across varied temperatures to achieve strict COSC chronometer grade tolerances.</p>
          </div>
          <div class="craft-card">
            <span class="craft-icon">✨</span>
            <h4>Côtes de Genève Finishing</h4>
            <p>Rotors and movement bridges are adorned with hand-applied circular graining and chamfered anglaged edges.</p>
          </div>
          <div class="craft-card">
            <span class="craft-icon">💎</span>
            <h4>Anti-Reflective Sapphire Crystals</h4>
            <p>Scratch-resistant synthetic sapphire crystals treated with dual anti-glare coatings offer diamond-grade clarity.</p>
          </div>
        </div>
      </section>

      <!-- 3. Sustainability -->
      <section v-if="currentSection === 'sustainability'" class="about-card">
        <div class="centered-head">
          <span class="sub-heading">ETHICAL HOROLOGY</span>
          <h2>Committed to Conscious Luxury</h2>
          <p>True luxury honours both humanity and the planet.</p>
        </div>

        <div class="sustain-grid">
          <div class="sustain-card">
            <h4>🌱 100% Recycled Precious Metals</h4>
            <p>All gold-tone and solid gold timepieces utilize certified recycled precious metals to reduce environmental mining footprint.</p>
          </div>
          <div class="sustain-card">
            <h4>📦 Biodegradable Packaging</h4>
            <p>Our bespoke gift packaging uses FSC-certified wood and non-toxic plant-based inks.</p>
          </div>
          <div class="sustain-card">
            <h4>⏳ Lifetime Repairability</h4>
            <p>We maintain an inventory of vintage movement spares ensuring our watches never end up in landfills.</p>
          </div>
        </div>
      </section>

      <!-- 4. Press & Media -->
      <section v-if="currentSection === 'press'" class="about-card">
        <div class="centered-head">
          <span class="sub-heading">IN THE SPOTLIGHT</span>
          <h2>Editorial & Media Features</h2>
          <p>Recognized by leading luxury, design, and horological publications.</p>
        </div>

        <div class="press-grid">
          <div class="press-quote">
            <p>“Radhe Timepieces redefines accessible luxury with uncompromising attention to movement accuracy and finishing.”</p>
            <strong>— GQ Luxury Review</strong>
          </div>
          <div class="press-quote">
            <p>“A masterclass in modern horology. Their Price on Request vintage curations are some of the finest in Asia.”</p>
            <strong>— Horology Today</strong>
          </div>
          <div class="press-quote">
            <p>“Classic aesthetics, bulletproof sapphire crystals, and exquisite dials that rival traditional Geneva houses.”</p>
            <strong>— Robb Report</strong>
          </div>
        </div>
      </section>

      <!-- 5. Careers -->
      <section v-if="currentSection === 'careers'" class="about-card">
        <div class="centered-head">
          <span class="sub-heading">JOIN OUR ATELIER</span>
          <h2>Craft the Future of Luxury Horology</h2>
          <p>We are always seeking passionate watchmakers, digital designers, and client concierge specialists.</p>
        </div>

        <div class="careers-list">
          <div class="career-item">
            <div>
              <h4>Senior Horologist / Movement Specialist</h4>
              <span>Full-time • Mumbai Flagship Atelier</span>
            </div>
            <a href="mailto:careers@radhetimepieces.com?subject=Horologist Application" class="apply-btn">Apply Now →</a>
          </div>
          <div class="career-item">
            <div>
              <h4>VIP Client Concierge Advisor</h4>
              <span>Full-time • Delhi & Mumbai Boutiques</span>
            </div>
            <a href="mailto:careers@radhetimepieces.com?subject=Concierge Advisor Application" class="apply-btn">Apply Now →</a>
          </div>
          <div class="career-item">
            <div>
              <h4>Digital Experience & UI Specialist</h4>
              <span>Full-time / Hybrid • Mumbai</span>
            </div>
            <a href="mailto:careers@radhetimepieces.com?subject=Digital Application" class="apply-btn">Apply Now →</a>
          </div>
        </div>
      </section>

      <!-- 6. Blog -->
      <section v-if="currentSection === 'blog'" class="about-card">
        <div class="centered-head">
          <span class="sub-heading">THE JOURNAL</span>
          <h2>Horological Insights & Collector Notes</h2>
          <p>Guides on movement complications, history of pilot watches, and styling notes.</p>
        </div>

        <div class="blog-grid">
          <article class="blog-card" @click="$router.push('/shop')">
            <div class="blog-meta">Horology 101 • 5 min read</div>
            <h4>Understanding Automatic vs Quartz Movements</h4>
            <p>Why mechanical sweeping seconds continue to enchant collectors in the digital era.</p>
            <span class="read-more">Read Article →</span>
          </article>
          <article class="blog-card" @click="$router.push('/shop')">
            <div class="blog-meta">Collector Guide • 4 min read</div>
            <h4>How to Care for Genuine Leather Straps</h4>
            <p>Protecting saddle leather from moisture and maintaining supple patina.</p>
            <span class="read-more">Read Article →</span>
          </article>
          <article class="blog-card" @click="$router.push('/shop')">
            <div class="blog-meta">Heritage • 6 min read</div>
            <h4>The Evolution of the Racing Chronograph</h4>
            <p>From trackside stopwatches to everyday style statements.</p>
            <span class="read-more">Read Article →</span>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentSection = ref('story')

const sections = [
  { id: 'story', label: 'Our Story' },
  { id: 'craftsmen', label: 'Our Craftsmen' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'press', label: 'Press & Media' },
  { id: 'careers', label: 'Careers' },
  { id: 'blog', label: 'The Journal' }
]

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (route.query.section) {
    currentSection.value = route.query.section
  }
})
</script>

<style scoped>
.about-page {
  background: #faf8f5;
  min-height: 100vh;
  padding-bottom: 5rem;
}

.about-hero {
  background: linear-gradient(135deg, #181818 0%, #29241b 100%);
  color: #fff;
  padding: 4.5rem 1.5rem 3.5rem;
  text-align: center;
  border-bottom: 2px solid #C9A84C;
}
.about-hero-inner {
  max-width: 820px;
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
.about-hero h1 {
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

/* Nav Pills */
.about-nav-wrap {
  max-width: 900px;
  margin: -1.8rem auto 2.5rem;
  padding: 0 1.5rem;
  position: relative;
  z-index: 3;
}
.about-nav {
  background: #ffffff;
  border: 1px solid #ebdcc4;
  border-radius: 16px;
  padding: 6px;
  display: flex;
  gap: 6px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.06);
  overflow-x: auto;
}
.nav-pill {
  flex: 1;
  min-width: 120px;
  padding: 0.8rem 1rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.nav-pill.active {
  background: #1a1a1a;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}
.nav-pill:hover:not(.active) {
  background: #fdfaf4;
  color: #C9A84C;
}

.about-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.about-card {
  background: #ffffff;
  border: 1px solid #ebdcc4;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 12px 36px rgba(0,0,0,0.04);
}

.sub-heading {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #C9A84C;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}
.centered-head {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 2.5rem;
}
.centered-head h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}
.centered-head p {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

/* Story Grid */
.story-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 3rem;
  align-items: center;
}
.story-text h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.25rem;
  line-height: 1.25;
}
.story-text p {
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.7;
  margin: 0 0 1rem;
}
.quote-box {
  background: #fcf9f2;
  border-left: 3px solid #C9A84C;
  padding: 1rem 1.25rem;
  margin-top: 1.5rem;
  border-radius: 0 10px 10px 0;
}
.quote-box p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-style: italic;
  color: #1a1a1a;
  margin: 0 0 0.4rem;
}
.quote-box span {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #8B6914;
  font-weight: 600;
  text-transform: uppercase;
}

.story-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.stat-card {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 14px;
  padding: 1.5rem 1rem;
  text-align: center;
}
.stat-card h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #C9A84C;
  margin: 0 0 0.25rem;
}
.stat-card p {
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

/* Craftsmen */
.craft-grid, .sustain-grid, .press-grid, .blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.craft-card, .sustain-card {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 14px;
  padding: 1.75rem 1.25rem;
  text-align: center;
}
.craft-icon { font-size: 2rem; margin-bottom: 0.6rem; display: block; }
.craft-card h4, .sustain-card h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #1a1a1a;
}
.craft-card p, .sustain-card p {
  font-family: 'Jost', sans-serif;
  font-size: 0.86rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Press */
.press-quote {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 14px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.press-quote p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-style: italic;
  color: #1a1a1a;
  line-height: 1.5;
  margin: 0 0 1rem;
}
.press-quote strong {
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #C9A84C;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Careers */
.careers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}
.career-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 12px;
  padding: 1.25rem 1.75rem;
}
.career-item h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.2rem;
}
.career-item span {
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #777;
}
.apply-btn {
  background: #1a1a1a;
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}
.apply-btn:hover { background: #C9A84C; }

/* Blog */
.blog-card {
  background: #faf7f0;
  border: 1px solid #ebdcc4;
  border-radius: 14px;
  padding: 1.75rem;
  cursor: pointer;
  transition: all 0.25s ease;
}
.blog-card:hover {
  transform: translateY(-4px);
  border-color: #C9A84C;
  box-shadow: 0 8px 24px rgba(201,168,76,0.15);
}
.blog-meta {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  color: #C9A84C;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}
.blog-card h4 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}
.blog-card p {
  font-family: 'Jost', sans-serif;
  font-size: 0.86rem;
  color: #666;
  line-height: 1.5;
  margin: 0 0 1rem;
}
.read-more {
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #8B6914;
  font-weight: 600;
}

@media (max-width: 800px) {
  .story-grid { grid-template-columns: 1fr; }
  .craft-grid, .sustain-grid, .press-grid, .blog-grid { grid-template-columns: 1fr; }
  .career-item { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
  .about-card { padding: 2rem 1.5rem; }
}
</style>
