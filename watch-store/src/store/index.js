import { reactive } from 'vue'
import { products as fallbackProducts } from '../data/products'

const getSavedWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('luxoria_wishlist') || '[]')
  } catch { return [] }
}

const saveLocalWishlist = (items) => {
  try {
    localStorage.setItem('luxoria_wishlist', JSON.stringify(items))
  } catch (e) {
    console.error('Failed to save wishlist locally', e)
  }
}

const getSavedCart = () => {
  try {
    const items = JSON.parse(localStorage.getItem('luxoria_cart') || '[]')
    return Array.isArray(items) ? items.map(i => {
      let price = Number(i.price) || 0
      if (price <= 0) {
        const prod = fallbackProducts.find(p => Number(p.id) === Number(i.id))
        if (prod && Number(prod.price) > 0) price = Number(prod.price)
      }
      return {
        ...i,
        id: Number(i.id),
        qty: Math.max(1, parseInt(i.qty, 10) || 1),
        price: price
      }
    }) : []
  } catch { return [] }
}

const saveLocalCart = (items) => {
  try {
    localStorage.setItem('luxoria_cart', JSON.stringify(items))
    const userId = getCurrentUserId()
    if (userId) {
      localStorage.setItem(`luxoria_cart_${userId}`, JSON.stringify(items))
    }
  } catch (e) {
    console.error('Failed to save cart locally', e)
  }
}

const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('luxoria_current_user') || 'null')
    return user?.id || null
  } catch {
    return null
  }
}

const normalizeProduct = (p) => ({
  id: Number(p.id),
  name: p.name,
  brand: p.brand || 'Radhe',
  category: p.category,
  type: p.type || 'Classic',
  price: Number(p.price) || 0,
  originalPrice: p.original_price ? Number(p.original_price) : (p.originalPrice ? Number(p.originalPrice) : null),
  original_price: p.original_price ? Number(p.original_price) : (p.originalPrice ? Number(p.originalPrice) : null),
  discount: p.discount ? Number(p.discount) : 0,
  rating: p.rating ? Number(p.rating) : 4.8,
  reviews: p.reviews ? Number(p.reviews) : 0,
  image: p.image || '/images/watch_womens_gold.jpg',
  badge: p.badge || '',
  colors: Array.isArray(p.colors) ? p.colors : (typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : ['#C9A84C']),
  description: p.description || '',
  features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features || '[]') : []),
  strap: p.strap || 'Leather',
  caseDiameter: p.case_diameter || p.caseDiameter || '40mm',
  case_diameter: p.case_diameter || p.caseDiameter || '40mm',
  movement: p.movement || 'Swiss Quartz',
  inStock: p.in_stock !== undefined ? Boolean(p.in_stock) : (p.inStock !== undefined ? Boolean(p.inStock) : true),
  in_stock: p.in_stock !== undefined ? Boolean(p.in_stock) : (p.inStock !== undefined ? Boolean(p.inStock) : true)
})

export const store = reactive({
  products: fallbackProducts.map(normalizeProduct),
  productsLoaded: false,
  productsLoading: false,
  cart: getSavedCart(),
  wishlist: getSavedWishlist(),
  cartOpen: false,
  wishlistOpen: false,
  hidePrice: false, // Active pricing enabled
  toastMessage: '',
  toastType: 'info', // 'success', 'info', 'error'
  toastTimer: null,

  showToast(message, type = 'success') {
    if (this.toastTimer) clearTimeout(this.toastTimer)
    this.toastMessage = message
    this.toastType = type
    this.toastTimer = setTimeout(() => {
      this.toastMessage = ''
    }, 2800)
  },

  addToCart(product) {
    const pId = Number(product.id)
    const existing = this.cart.find(item => Number(item.id) === pId)
    if (existing) {
      existing.qty = (parseInt(existing.qty, 10) || 1) + 1
    } else {
      this.cart.push({ ...product, id: pId, qty: 1 })
    }
    saveLocalCart(this.cart)
    this.showToast(`Added ${product.name} to cart!`)
  },

  removeFromCart(id) {
    const numId = Number(id)
    this.cart = this.cart.filter(item => Number(item.id) !== numId)
    saveLocalCart(this.cart)
  },

  updateQty(id, qty) {
    const numId = Number(id)
    const newQty = parseInt(qty, 10)
    const item = this.cart.find(i => Number(i.id) === numId)
    if (item) {
      if (isNaN(newQty) || newQty <= 0) this.removeFromCart(numId)
      else item.qty = newQty
    }
    saveLocalCart(this.cart)
  },

  // Assign local storage cart items to the logged in user
  assignCartToUser(userId) {
    if (!userId) return
    // Ensure we have the latest cart items from localStorage if current is empty
    if (!this.cart || this.cart.length === 0) {
      this.cart = getSavedCart()
    }
    // Check if user had a previous user-specific cart saved in localStorage
    try {
      const userSpecific = JSON.parse(localStorage.getItem(`luxoria_cart_${userId}`) || '[]')
      if (Array.isArray(userSpecific) && userSpecific.length > 0) {
        for (const item of userSpecific) {
          const exists = this.cart.find(c => Number(c.id) === Number(item.id))
          if (!exists) {
            this.cart.push({ ...item, user_id: userId })
          }
        }
      }
    } catch (e) {
      console.warn('Could not merge user-specific cart:', e)
    }

    // Assign user_id to all cart items and repair any zero prices
    this.cart = this.cart.map(item => {
      let price = Number(item.price) || 0
      if (price <= 0) {
        const prod = fallbackProducts.find(p => Number(p.id) === Number(item.id))
        if (prod && Number(prod.price) > 0) price = Number(prod.price)
      }
      return {
        ...item,
        price,
        user_id: userId
      }
    })
    saveLocalCart(this.cart)
  },

  clearCart() {
    this.cart = []
    saveLocalCart(this.cart)
  },

  // Toggle wishlist / favorite (both frontend state and MySQL DB)
  async toggleWishlist(product) {
    const userId = getCurrentUserId()
    const idx = this.wishlist.findIndex(i => (i.id === product.id || i.product_id === product.id))
    const wasWishlisted = idx > -1

    if (!userId) {
      // User is not logged in: show login popup / signup form
      import('./auth').then(({ authStore }) => {
        authStore.openAuthModal(
          null,
          'Please sign in or create an account to save your favorite watches',
          product,
          'login'
        )
      })
      this.showToast('Please sign in to save favorites', 'info')
      return
    }

    if (wasWishlisted) {
      // Remove locally
      this.wishlist.splice(idx, 1)
      saveLocalWishlist(this.wishlist)
      this.showToast('Removed from favorites', 'info')

      // Sync removal to DB if user is logged in
      if (userId) {
        try {
          await fetch(`/api/favorites/${product.id}?user_id=${userId}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
          })
        } catch (err) {
          console.warn('Could not sync removal to DB:', err)
        }
      }
    } else {
      // Add locally
      const itemToAdd = {
        ...product,
        product_id: product.id,
      }
      this.wishlist.push(itemToAdd)
      saveLocalWishlist(this.wishlist)

      // Sync addition to MySQL DB
      if (userId) {
        this.showToast('❤️ Saved to favorites in database!', 'success')
        try {
          const res = await fetch('/api/favorites/toggle', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              user_id: userId,
              product: {
                id: product.id,
                name: product.name,
                brand: product.brand || 'LUXORIA',
                price: product.price,
                originalPrice: product.originalPrice || product.original_price,
                image: product.image,
                category: product.category,
                badge: product.badge,
                rating: product.rating,
                reviews: product.reviews,
                colors: product.colors || []
              }
            })
          })
          if (res.ok) {
            const data = await res.json()
            if (data.status === 'removed') {
              // in case of mismatch
              this.wishlist = this.wishlist.filter(i => (i.id !== product.id && i.product_id !== product.id))
              saveLocalWishlist(this.wishlist)
            }
          }
        } catch (err) {
          console.warn('Saved locally; could not reach DB:', err)
        }
      } else {
        this.showToast('❤️ Added to favorites! Sign in to sync across devices.', 'info')
      }
    }
  },

  isWishlisted(id) {
    return this.wishlist.some(i => i.id === id || i.product_id === id)
  },

  // Load user favorites from MySQL database
  async loadFavoritesFromDB(userId) {
    if (!userId) return
    try {
      const res = await fetch(`/api/favorites?user_id=${userId}`, {
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.favorites)) {
          // Map DB favorites to store format
          const mapped = data.favorites.map(f => ({
            id: f.product_id,
            product_id: f.product_id,
            name: f.name,
            brand: f.brand,
            price: Number(f.price),
            originalPrice: f.original_price ? Number(f.original_price) : null,
            image: f.image,
            category: f.category,
            badge: f.badge,
            rating: Number(f.rating),
            reviews: f.reviews,
            colors: f.colors || []
          }))
          this.wishlist = mapped
          saveLocalWishlist(this.wishlist)
        }
      }
    } catch (err) {
      console.warn('Could not load favorites from DB:', err)
    }
  },

  // Sync guest wishlist to MySQL DB upon login or signup
  async syncLocalWishlistToDB(userId) {
    if (!userId) return
    if (!this.wishlist.length) {
      await this.loadFavoritesFromDB(userId)
      return
    }

    try {
      const payload = this.wishlist.map(item => ({
        id: item.id || item.product_id,
        name: item.name,
        brand: item.brand || 'LUXORIA',
        price: item.price,
        originalPrice: item.originalPrice || item.original_price,
        image: item.image,
        category: item.category,
        badge: item.badge,
        rating: item.rating,
        reviews: item.reviews,
        colors: item.colors || []
      }))

      const res = await fetch('/api/favorites/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          items: payload
        })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.favorites)) {
          this.wishlist = data.favorites.map(f => ({
            id: f.product_id,
            product_id: f.product_id,
            name: f.name,
            brand: f.brand,
            price: Number(f.price),
            originalPrice: f.original_price ? Number(f.original_price) : null,
            image: f.image,
            category: f.category,
            badge: f.badge,
            rating: Number(f.rating),
            reviews: f.reviews,
            colors: f.colors || []
          }))
          saveLocalWishlist(this.wishlist)
        }
      }
    } catch (err) {
      console.warn('Could not sync local favorites to DB:', err)
    }
  },

  async fetchProducts() {
    this.productsLoading = true
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          this.products = data.products.map(normalizeProduct)
          this.productsLoaded = true
        }
      }
    } catch (err) {
      console.warn('Could not fetch products from API, falling back to local list:', err)
    } finally {
      this.productsLoading = false
    }
  },

  getProductById(id) {
    const num = Number(id)
    return this.products.find(p => Number(p.id) === num) || null
  },

  get cartTotal() {
    return this.cart.reduce((sum, i) => sum + (Number(i.price) || 0) * (parseInt(i.qty, 10) || 1), 0)
  },
  get cartCount() {
    return this.cart.reduce((sum, i) => sum + (parseInt(i.qty, 10) || 1), 0)
  }
})
