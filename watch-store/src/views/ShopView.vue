<template>
  <div class="shop-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-content">
        <h1>{{ pageTitle }}</h1>
        <p>{{ filteredProducts.length }} timepieces</p>
      </div>
    </div>

    <div class="shop-layout">
      <!-- Filters Sidebar -->
      <aside class="filters-sidebar" :class="{ open: filterOpen }">
        <div class="filter-close" @click="filterOpen = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </div>

        <div class="filter-group">
          <h3>Category</h3>
          <div class="filter-options">
            <label v-for="cat in categoryOptions" :key="cat.id" class="filter-option" :for="`cat-${cat.id}`">
              <input type="radio" :id="`cat-${cat.id}`" :value="cat.id" v-model="selectedCategory" />
              <span>{{ cat.label }}</span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h3>Watch Type</h3>
          <div class="filter-options">
            <label v-for="type in typeOptions" :key="type" class="filter-option" :for="`type-${type}`">
              <input type="radio" :id="`type-${type}`" :value="type" v-model="selectedType" />
              <span>{{ type }}</span>
            </label>
          </div>
        </div>

        <div class="filter-group" v-if="!store.hidePrice">
          <h3>Price Range</h3>
          <div class="price-range">
            <input type="range" v-model="maxPrice" :min="5000" :max="40000" :step="1000" class="range-slider" id="price-range-slider" />
            <div class="price-labels">
              <span>₹5,000</span>
              <span>Up to ₹{{ maxPrice.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <h3>Rating</h3>
          <div class="filter-options">
            <label v-for="r in [4.5, 4, 3.5]" :key="r" class="filter-option" :for="`rating-${r}`">
              <input type="radio" :id="`rating-${r}`" :value="r" v-model="minRating" />
              <span>{{ r }}+ ⭐</span>
            </label>
          </div>
        </div>

        <button class="reset-btn" @click="resetFilters" id="reset-filters-btn">Reset All Filters</button>
      </aside>

      <!-- Main Content -->
      <main class="shop-main">
        <!-- Toolbar -->
        <div class="shop-toolbar">
          <button class="filter-toggle-btn" @click="filterOpen = !filterOpen" id="filter-toggle-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters
          </button>
          <p class="results-count">{{ filteredProducts.length }} results</p>
          <div class="sort-wrap">
            <label for="sort-select">Sort by:</label>
            <select v-model="sortBy" id="sort-select" class="sort-select">
              <option value="featured">Featured</option>
              <option value="price-asc" v-if="!store.hidePrice">Price: Low to High</option>
              <option value="price-desc" v-if="!store.hidePrice">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="discount" v-if="!store.hidePrice">Biggest Discount</option>
            </select>
          </div>
        </div>

        <!-- Active Filters -->
        <div class="active-filters" v-if="hasActiveFilters">
          <span v-if="selectedCategory !== 'all'" class="af-chip">
            {{ selectedCategory }}
            <button @click="selectedCategory = 'all'" aria-label="Remove filter">×</button>
          </span>
          <span v-if="selectedType !== 'all'" class="af-chip">
            {{ selectedType }}
            <button @click="selectedType = 'all'" aria-label="Remove filter">×</button>
          </span>
          <span v-if="!store.hidePrice && maxPrice < 40000" class="af-chip">
            Up to ₹{{ maxPrice.toLocaleString() }}
            <button @click="maxPrice = 40000" aria-label="Remove filter">×</button>
          </span>
        </div>

        <!-- Product Grid -->
        <div class="products-grid" v-if="filteredProducts.length > 0">
          <ProductCard v-for="p in sortedProducts" :key="p.id" :product="p" />
        </div>

        <!-- Empty State -->
        <div class="empty-results" v-else>
          <div class="empty-icon">🔍</div>
          <h3>No watches found</h3>
          <p>Try adjusting your filters</p>
          <button class="btn-primary" @click="resetFilters" id="empty-reset-btn">Reset Filters</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { products as defaultProducts } from '../data/products'
import { store } from '../store'

const route = useRoute()
const selectedCategory = ref('all')
const selectedType = ref('all')
const maxPrice = ref(40000)
const minRating = ref(0)
const sortBy = ref('featured')
const filterOpen = ref(false)

const categoryOptions = [
  { id: 'all', label: 'All Watches' },
  { id: 'Men', label: "Men's" },
  { id: 'Women', label: "Women's" },
  { id: 'Classic', label: 'Classic' },
  { id: 'Smart', label: 'Smart' },
  { id: 'Couple', label: 'Couples' },
  { id: 'Sport', label: 'Sport' }
]
const typeOptions = ['all', 'Classic', 'Chronograph', 'Skeleton', 'Automatic', 'Sport', 'Smartwatch']

const pageTitle = computed(() => {
  if (selectedCategory.value !== 'all') return `${selectedCategory.value}'s Watches`
  return 'All Watches'
})

const hasActiveFilters = computed(() =>
  selectedCategory.value !== 'all' || selectedType.value !== 'all' || (!store.hidePrice && maxPrice.value < 40000)
)

const allProducts = computed(() => store.products?.length ? store.products : defaultProducts)

const filteredProducts = computed(() => allProducts.value.filter(p => {
  if (selectedCategory.value !== 'all' && p.category !== selectedCategory.value) return false
  if (selectedType.value !== 'all' && p.type !== selectedType.value) return false
  if (!store.hidePrice && p.price > maxPrice.value) return false
  if (p.rating < minRating.value) return false
  return true
}))

const sortedProducts = computed(() => {
  const arr = [...filteredProducts.value]
  switch (sortBy.value) {
    case 'price-asc': return arr.sort((a, b) => a.price - b.price)
    case 'price-desc': return arr.sort((a, b) => b.price - a.price)
    case 'rating': return arr.sort((a, b) => b.rating - a.rating)
    case 'discount': return arr.sort((a, b) => b.discount - a.discount)
    default: return arr
  }
})

const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedType.value = 'all'
  maxPrice.value = 40000
  minRating.value = 0
}

onMounted(() => {
  if (route.query.category) selectedCategory.value = route.query.category
  if (route.query.type) selectedType.value = route.query.type
})

watch(() => route.query.category, (val) => {
  if (val) selectedCategory.value = val
  else selectedCategory.value = 'all'
})
</script>

<style scoped>
.shop-page { padding-top: 72px; min-height: 100vh; }
.page-header {
  background: linear-gradient(135deg, #faf8f4 0%, #f5ede0 100%);
  padding: 3rem 2rem;
  border-bottom: 1px solid #ede5d8;
}
.page-header-content { max-width: 1400px; margin: 0 auto; }
.page-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.4rem;
}
.page-header p {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  color: #999;
  margin: 0;
}
.shop-layout {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  gap: 2.5rem;
  align-items: flex-start;
}
.filters-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 90px;
}
.filter-close { display: none; }
.filter-group { margin-bottom: 2rem; }
.filter-group h3 {
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: #999;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0 0 0.85rem;
}
.filter-options { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
}
.filter-option input { accent-color: #C9A84C; }
.filter-option span {
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  color: #555;
}
.filter-option:hover span { color: #C9A84C; }
.price-range { display: flex; flex-direction: column; gap: 0.75rem; }
.range-slider {
  width: 100%;
  accent-color: #C9A84C;
  cursor: pointer;
}
.price-labels {
  display: flex;
  justify-content: space-between;
  font-family: 'Jost', sans-serif;
  font-size: 0.8rem;
  color: #888;
}
.reset-btn {
  width: 100%;
  background: #f5f0e8;
  border: 1px solid #e0d5c0;
  color: #666;
  padding: 0.7rem;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}
.reset-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.shop-main { flex: 1; min-width: 0; }
.shop-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.filter-toggle-btn {
  display: none;
  align-items: center;
  gap: 0.4rem;
  background: #f5f0e8;
  border: 1px solid #e0d5c0;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #444;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-toggle-btn:hover { border-color: #C9A84C; color: #C9A84C; }
.results-count {
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #888;
  flex: 1;
  margin: 0;
}
.sort-wrap { display: flex; align-items: center; gap: 0.5rem; }
.sort-wrap label {
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #888;
  white-space: nowrap;
}
.sort-select {
  border: 1px solid #e0d5c0;
  background: #faf8f4;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #444;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.sort-select:focus { border-color: #C9A84C; }
.active-filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.af-chip {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: #C9A84C;
  color: #fff;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
}
.af-chip button {
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  transition: color 0.2s;
}
.af-chip button:hover { color: #fff; }
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.empty-results {
  text-align: center;
  padding: 5rem 2rem;
  color: #888;
}
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-results h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 0.5rem;
}
.empty-results p {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
}
.btn-primary {
  display: inline-flex;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  padding: 0.8rem 1.75rem;
  border-radius: 10px;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

@media (max-width: 1024px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .shop-layout { padding: 1.5rem; gap: 0; }
  .filters-sidebar {
    position: fixed;
    top: 0; left: -100%;
    width: 280px;
    height: 100vh;
    background: #fff;
    z-index: 1300;
    padding: 2rem 1.5rem;
    overflow-y: auto;
    transition: left 0.3s ease;
    box-shadow: 4px 0 24px rgba(0,0,0,0.1);
  }
  .filters-sidebar.open { left: 0; }
  .filter-close { display: flex; justify-content: flex-end; margin-bottom: 1rem; cursor: pointer; }
  .filter-toggle-btn { display: flex; }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: 1fr; }
}
</style>
