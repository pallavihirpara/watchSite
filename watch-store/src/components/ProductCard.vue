<template>
  <div class="product-card" :class="{ wishlisted: isWishlisted }" @click="goToProduct">
    <div class="card-image-wrap">
      <img :src="product.image" :alt="product.name" class="product-img" loading="lazy" />
      <span class="product-badge" v-if="product.badge" :class="badgeClass">{{ product.badge }}</span>
      <span class="discount-tag" v-if="!store.hidePrice && product.discount">-{{ product.discount }}%</span>
      <div class="card-actions">
        <button
          class="action-btn wishlist-btn"
          :class="{ active: isWishlisted }"
          @click.stop="toggleWishlist"
          :id="`wishlist-btn-${product.id}`"
          :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button
          class="action-btn cart-quick-btn"
          @click.stop="addToCart"
          :id="`add-cart-btn-${product.id}`"
          aria-label="Add to cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="card-body">
      <p class="product-brand">{{ product.brand }}</p>
      <h3 class="product-name">{{ product.name }}</h3>

      <div class="product-rating">
        <div class="stars">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(product.rating) }">★</span>
        </div>
        <span class="rating-count">({{ product.reviews }})</span>
      </div>

      <div class="product-colors">
        <span
          v-for="color in product.colors.slice(0,3)"
          :key="color"
          class="color-dot"
          :style="{ background: color }"
        ></span>
      </div>

      <div class="product-price">
        <template v-if="!store.hidePrice && product.price > 0">
          <span class="price-current">₹{{ product.price.toLocaleString() }}</span>
          <span class="price-original" v-if="product.originalPrice">₹{{ product.originalPrice.toLocaleString() }}</span>
        </template>
        <template v-else>
          <span class="price-request">✨ Price on Request</span>
        </template>
      </div>

      <button class="add-to-cart-btn" @click.stop="addToCart" :id="`add-cart-main-btn-${product.id}`">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Add to Cart
      </button>
    </div>

    <!-- Added to cart flash -->
    <transition name="flash">
      <div class="added-flash" v-if="addedFlash">✓ Added to Cart</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

const props = defineProps({ product: { type: Object, required: true } })
const router = useRouter()
const addedFlash = ref(false)

const isWishlisted = computed(() => store.isWishlisted(props.product.id))

const badgeClass = computed(() => {
  const map = { Bestseller: 'badge-gold', New: 'badge-blue', Trending: 'badge-pink', Limited: 'badge-red', 'Tech Pick': 'badge-blue', 'Gift Set': 'badge-purple', Heritage: 'badge-brown', Elegant: 'badge-silver' }
  return map[props.product.badge] || 'badge-gold'
})

const toggleWishlist = () => store.toggleWishlist(props.product)
const goToProduct = () => router.push(`/product/${props.product.id}`)
const addToCart = () => {
  store.addToCart(props.product)
  addedFlash.value = true
  setTimeout(() => { addedFlash.value = false }, 1800)
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0e8d8;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(201,168,76,0.15), 0 8px 24px rgba(0,0,0,0.08);
  border-color: #e8d9b0;
}
.card-image-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  background: #faf8f4;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
}
.product-card:hover .product-img { transform: scale(1.07); }
.product-badge {
  position: absolute;
  top: 12px; left: 12px;
  font-family: 'Jost', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.badge-gold { background: #C9A84C; color: #fff; }
.badge-blue { background: #3B82F6; color: #fff; }
.badge-pink { background: #F4A7B9; color: #8B2252; }
.badge-red { background: #ef4444; color: #fff; }
.badge-purple { background: #9333ea; color: #fff; }
.badge-brown { background: #8B6914; color: #fff; }
.badge-silver { background: #8E8E93; color: #fff; }
.discount-tag {
  position: absolute;
  top: 12px; right: 12px;
  background: #fff3cd;
  color: #856404;
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 8px;
  border: 1px solid #ffc107;
}
.card-actions {
  position: absolute;
  bottom: 12px; right: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}
.product-card:hover .card-actions { opacity: 1; transform: translateX(0); }
.action-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.9);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #555;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.action-btn:hover { background: #fff; color: #C9A84C; transform: scale(1.1); }
.wishlist-btn.active { color: #e74c3c; }
.wishlist-btn.active:hover { color: #c0392b; }
.card-body { padding: 1rem 1.1rem 1.25rem; }
.product-brand {
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  color: #C9A84C;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 0.25rem;
}
.product-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}
.product-rating {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
}
.stars { display: flex; gap: 1px; }
.star { font-size: 0.8rem; color: #ddd; }
.star.filled { color: #f59e0b; }
.rating-count {
  font-family: 'Jost', sans-serif;
  font-size: 0.75rem;
  color: #888;
}
.product-colors {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}
.color-dot {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #ddd;
  cursor: pointer;
  transition: transform 0.2s;
}
.color-dot:hover { transform: scale(1.2); }
.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}
.price-current {
  font-family: 'Jost', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1a1a;
}
.price-original {
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #aaa;
  text-decoration: line-through;
}
.price-request {
  font-family: 'Jost', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: #C9A84C;
  letter-spacing: 0.04em;
  background: rgba(201, 168, 76, 0.08);
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  border: 1px dashed rgba(201, 168, 76, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.add-to-cart-btn {
  width: 100%;
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 0.7rem;
  border-radius: 10px;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  letter-spacing: 0.05em;
  transition: all 0.25s ease;
}
.add-to-cart-btn:hover {
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(201,168,76,0.3);
}
.added-flash {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.75rem;
  text-align: center;
}
.flash-enter-active, .flash-leave-active { transition: all 0.3s ease; }
.flash-enter-from { transform: translateY(100%); opacity: 0; }
.flash-leave-to { opacity: 0; }
</style>
