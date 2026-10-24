import { reactive, computed } from 'vue'

const getStoredAdmin = () => {
  try {
    const raw = localStorage.getItem('radhe_admin_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const state = reactive({
  admin: getStoredAdmin(),
  loading: false,
  error: null,
})

export const adminAuth = {
  state,
  admin: computed(() => state.admin),
  isLoggedIn: computed(() => Boolean(state.admin && state.admin.is_admin)),

  async login(email, password) {
    state.loading = true
    state.error = null

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        state.admin = data.admin
        localStorage.setItem('radhe_admin_user', JSON.stringify(data.admin))
        state.loading = false
        return { success: true, admin: data.admin }
      } else {
        const errorMsg = data.error || 'Admin authentication failed.'
        state.error = errorMsg
        state.loading = false
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      const msg = 'Network error: Unable to reach administration server.'
      state.error = msg
      state.loading = false
      return { success: false, error: msg }
    }
  },

  logout() {
    state.admin = null
    state.error = null
    localStorage.removeItem('radhe_admin_user')
  },
}
