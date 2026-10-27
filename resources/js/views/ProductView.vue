<template>
  <div class="product-page" v-if="product" id="product-detail-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <div class="bc-inner">
        <router-link to="/">Home</router-link>
        <span>›</span>
        <router-link to="/shop">Watches</router-link>
        <span>›</span>
        <router-link :to="`/shop?category=${product.category}`">{{ product.category }}</router-link>
        <span>›</span>
        <span class="bc-current">{{ product.name }}</span>
      </div>
    </div>

    <div class="product-layout">
      <!-- Left: Images -->
      <div class="product-images">
        <div class="main-image-wrap">
          <img :src="product.image" :alt="product.name" class="main-image" />
          <span class="image-badge" v-if="product.badge">{{ product.badge }}</span>
        </div>
        <div class="thumb-row">
          <div class="thumb active">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="thumb" v-for="i in 3" :key="i">
            <img :src="product.image" :alt="`View ${i + 1}`" />
          </div>
        </div>
      </div>

      <!-- Right: Details -->
      <div class="product-info">
        <div class="product-badges-row">
          <span class="cat-tag">{{ product.category }}</span>
          <span class="type-tag">{{ product.type }}</span>
        </div>

        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-brand-name">by {{ product.brand }}</p>

        <!-- Rating -->
        <div class="rating-row">
          <div class="stars-display">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(product.rating) }">★</span>
          </div>
          <span class="rating-val">{{ product.rating }}</span>
          <span class="review-link">({{ product.reviews }} reviews)</span>
        </div>

        <!-- Price -->
        <div class="price-section">
          <template v-if="!store.hidePrice && product.price > 0">
            <span class="current-price">₹{{ product.price.toLocaleString() }}</span>
            <span class="original-price" v-if="product.originalPrice">₹{{ product.originalPrice.toLocaleString() }}</span>
            <span class="save-badge" v-if="product.discount">Save {{ product.discount }}%</span>
          </template>
          <template v-else>
            <div class="price-request-card">
              <span class="pr-icon">✨</span>
              <div class="pr-content">
                <strong>Price on Request</strong>
                <p>Official pricing being finalized. Contact us or add to cart to reserve.</p>
              </div>
            </div>
          </template>
        </div>
        <p class="tax-info" v-if="!store.hidePrice && product.price > 0">Inclusive of all taxes. Free shipping on this item.</p>
        <p class="tax-info" v-else>Complimentary insured shipping & certificate of authenticity included.</p>

        <!-- Colors -->
        <div class="option-group">
          <h4>Case Color</h4>
          <div class="colors-row">
            <span
              v-for="(color, i) in product.colors"
              :key="color"
              class="color-swatch"
              :class="{ active: selectedColor === i }"
              :style="{ background: color }"
              @click="selectedColor = i"
            ></span>
          </div>
        </div>

        <!-- Specs -->
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">Strap</span>
            <span class="spec-value">{{ product.strap }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Case Size</span>
            <span class="spec-value">{{ product.caseDiameter }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Movement</span>
            <span class="spec-value">{{ product.movement }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Availability</span>
            <span class="spec-value in-stock" v-if="product.inStock">✓ In Stock</span>
          </div>
        </div>

        <!-- Description -->
        <div class="product-description">
          <p>{{ product.description }}</p>
        </div>

        <!-- Features -->
        <div class="features-list">
          <h4>Key Features</h4>
          <div class="features-grid">
            <div class="feature-item" v-for="f in product.features" :key="f">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ f }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="action-buttons">
          <button class="add-cart-btn" @click="addToCart" :disabled="addedFlash" :id="`detail-add-cart-btn-${product.id}`">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {{ addedFlash ? '✓ Added to Cart!' : 'Add to Cart' }}
          </button>
          <button
            class="wishlist-action-btn"
            :class="{ wishlisted: isWishlisted }"
            @click="toggleWishlist"
            :id="`detail-wishlist-btn-${product.id}`"
            :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="related-section">
      <div class="section-header">
        <span class="section-pre">You May Also Like</span>
        <h2>Related Timepieces</h2>
      </div>
      <div class="related-grid">
        <ProductCard v-for="p in relatedProducts" :key="p.id" :product="p" />
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div class="not-found" v-else>
    <h2>Watch Not Found</h2>
    <router-link to="/shop" class="add-cart-btn">Back to Shop</router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { store } from '../store'
import { products as defaultProducts } from '../data/products'

const route = useRoute()
const selectedColor = ref(0)
const addedFlash = ref(false)

const product = computed(() => {
  const id = Number(route.params.id)
  return store.getProductById(id) || defaultProducts.find(p => p.id === id)
})
const isWishlisted = computed(() => product.value ? store.isWishlisted(product.value.id) : false)

const relatedProducts = computed(() => {
  if (!product.value) return []
  const all = store.products?.length ? store.products : defaultProducts
  return all.filter(p => p.category === product.value.category && p.id !== product.value.id).slice(0, 4)
})

const addToCart = () => {
  if (product.value) {
    store.addToCart(product.value)
    addedFlash.value = true
    setTimeout(() => { addedFlash.value = false }, 2000)
  }
}
const toggleWishlist = () => {
  if (product.value) store.toggleWishlist(product.value)
}
</script>

<style scoped>
.product-page { padding-top: 72px; }
.breadcrumb { background: #faf8f4; border-bottom: 1px solid #ede5d8; padding: 0.85rem 2rem; }
.bc-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #aaa;
}
.bc-inner a { color: #888; text-decoration: none; transition: color 0.2s; }
.bc-inner a:hover { color: #C9A84C; }
.bc-current { color: #333; }
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  align-items: start;
}
.product-images { position: sticky; top: 90px; }
.main-image-wrap {
  position: relative;
  aspect-ratio: 1;
  background: #faf8f4;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.main-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.main-image-wrap:hover .main-image { transform: scale(1.04); }
.image-badge {
  position: absolute;
  top: 16px; left: 16px;
  background: #C9A84C;
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.thumb-row { display: flex; gap: 0.75rem; }
.thumb {
  width: 70px; height: 70px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;
  flex-shrink: 0;
}
.thumb.active { border-color: #C9A84C; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.product-info { padding: 0.5rem 0; }
.product-badges-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.cat-tag, .type-tag {
  font-family: 'Jost', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.cat-tag { background: #f5f0e8; color: #C9A84C; border: 1px solid #e0cfa0; }
.type-tag { background: #f0f0f0; color: #666; }
.product-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.35rem;
  line-height: 1.15;
}
.product-brand-name {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  color: #999;
  margin: 0 0 1.25rem;
}
.rating-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
.stars-display { display: flex; gap: 2px; }
.star { color: #ddd; }
.star.filled { color: #f59e0b; }
.rating-val { font-family: 'Jost', sans-serif; font-size: 0.9rem; font-weight: 600; color: #333; }
.review-link { font-family: 'Jost', sans-serif; font-size: 0.85rem; color: #999; }
.price-section { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem; flex-wrap: wrap; }
.current-price {
  font-family: 'Jost', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
}
.original-price {
  font-family: 'Jost', sans-serif;
  font-size: 1.1rem;
  color: #bbb;
  text-decoration: line-through;
}
.save-badge {
  background: #fff3cd;
  color: #856404;
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  border: 1px solid #ffc107;
}
.price-request-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.12) 0%, rgba(201, 168, 76, 0.04) 100%);
  border: 1px solid rgba(201, 168, 76, 0.35);
  border-radius: 12px;
  padding: 0.85rem 1.15rem;
  margin-bottom: 0.5rem;
}
.price-request-card .pr-icon {
  font-size: 1.5rem;
}
.price-request-card .pr-content strong {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 1.15rem;
  color: #8c7028;
  letter-spacing: 0.04em;
}
.price-request-card .pr-content p {
  margin: 0.2rem 0 0;
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  color: #666;
}
.tax-info {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #aaa;
  margin: 0 0 1.5rem;
}
.option-group { margin-bottom: 1.5rem; }
.option-group h4 {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 0.6rem;
}
.colors-row { display: flex; gap: 0.6rem; }
.color-swatch {
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  box-shadow: 0 0 0 1.5px #ddd;
  transition: all 0.2s;
}
.color-swatch.active { box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #C9A84C; }
.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  background: #faf8f4;
  border: 1px solid #ede5d8;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}
.spec-item { display: flex; flex-direction: column; gap: 0.2rem; }
.spec-label {
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.spec-value {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  color: #333;
  font-weight: 500;
}
.in-stock { color: #27ae60; }
.product-description {
  font-family: 'Jost', sans-serif;
  font-size: 0.92rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 1.5rem;
  font-weight: 300;
}
.features-list { margin-bottom: 2rem; }
.features-list h4 {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 0.75rem;
}
.features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #555;
}
.action-buttons { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
.add-cart-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.25s;
  text-decoration: none;
}
.add-cart-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }
.add-cart-btn:disabled { opacity: 0.7; cursor: default; }
.wishlist-action-btn {
  width: 52px; height: 52px;
  border: 1.5px solid #e0d5c0;
  background: #faf8f4;
  border-radius: 12px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #999;
  transition: all 0.2s;
  flex-shrink: 0;
}
.wishlist-action-btn:hover { border-color: #e74c3c; color: #e74c3c; }
.wishlist-action-btn.wishlisted { border-color: #e74c3c; color: #e74c3c; background: #fff5f5; }
.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #eeeeee;
}
.di-item { display: flex; align-items: center; gap: 0.75rem; }
.di-item > span { font-size: 1.1rem; flex-shrink: 0; }
.di-item p {
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #555;
  margin: 0;
  line-height: 1.4;
}
.di-item strong { color: #1a1a1a; }
.related-section { padding: 3rem 2rem 5rem; max-width: 1400px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 2.5rem; }
.section-pre {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #C9A84C;
  display: block;
  margin-bottom: 0.5rem;
}
.related-section h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.not-found {
  padding-top: 72px;
  text-align: center;
  padding: 8rem 2rem;
}
.not-found h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  margin: 0 0 1.5rem;
}
@media (max-width: 960px) {
  .product-layout { grid-template-columns: 1fr; gap: 2rem; }
  .product-images { position: static; }
  .related-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .features-grid { grid-template-columns: 1fr; }
  .related-grid { grid-template-columns: 1fr; }
}
</style>
