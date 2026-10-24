import { reactive } from 'vue'
import { store } from './index'

// Fallback local storage simulated DB
const getUsersDB = () => {
  try {
    return JSON.parse(localStorage.getItem('luxoria_users') || '[]')
  } catch { return [] }
}
const saveUsersDB = (users) => {
  try {
    localStorage.setItem('luxoria_users', JSON.stringify(users))
  } catch (e) {
    console.error('Failed to save users locally', e)
  }
}

export const authStore = reactive({
  currentUser: null,
  showAuthModal: false,
  authRedirectTo: '/checkout',

  init() {
    try {
      const saved = localStorage.getItem('luxoria_current_user')
      if (saved) {
        this.currentUser = JSON.parse(saved)
        // Read user's favorites from MySQL DB
        store.loadFavoritesFromDB(this.currentUser.id)
      }
    } catch {
      this.currentUser = null
    }
  },

  // Check if email exists in database
  async emailExists(email) {
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.exists) {
          return { email, name: data.name }
        }
        return null
      }
    } catch (err) {
      console.warn('API check-email failed, checking local DB:', err)
    }

    // Local fallback
    const users = getUsersDB()
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
  },

  // Login with email + password (reads & validates against MySQL DB)
  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        this.currentUser = data.user
        localStorage.setItem('luxoria_current_user', JSON.stringify(data.user))
        // Load user favorites from DB and sync any items added as guest
        await store.syncLocalWishlistToDB(data.user.id)
        return { success: true, user: data.user }
      } else if (!res.ok && data.error) {
        return { success: false, error: data.error }
      }
    } catch (err) {
      console.warn('API login failed, checking local DB:', err)
    }

    // Local fallback
    const users = getUsersDB()
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) return { success: false, error: 'Invalid email or password.' }
    const { password: _p, ...safeUser } = user
    this.currentUser = safeUser
    localStorage.setItem('luxoria_current_user', JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  },

  // Register new user (saves into MySQL DB + auto-login + syncs favorites)
  async register(data) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email.trim(),
          phone: data.phone || '',
          password: data.password
        })
      })
      const respData = await res.json()
      if (res.ok && respData.success) {
        this.currentUser = respData.user
        localStorage.setItem('luxoria_current_user', JSON.stringify(respData.user))
        // Sync any favorites into the newly created user's DB account
        await store.syncLocalWishlistToDB(respData.user.id)
        return { success: true, user: respData.user }
      } else if (!res.ok && respData.error) {
        return { success: false, error: respData.error }
      }
    } catch (err) {
      console.warn('API register failed, using local DB:', err)
    }

    // Local fallback
    const users = getUsersDB()
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'This email is already registered.' }
    }
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      password: data.password,
      createdAt: new Date().toISOString()
    }
    users.push(newUser)
    saveUsersDB(users)
    const { password: _p, ...safeUser } = newUser
    this.currentUser = safeUser
    localStorage.setItem('luxoria_current_user', JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  },

  logout() {
    this.currentUser = null
    localStorage.removeItem('luxoria_current_user')
    // Keep or reset wishlist
    store.wishlist = []
    localStorage.removeItem('luxoria_wishlist')
  },

  openAuthModal(redirectTo = '/checkout') {
    this.authRedirectTo = redirectTo
    this.showAuthModal = true
  },

  closeAuthModal() {
    this.showAuthModal = false
  }
})
