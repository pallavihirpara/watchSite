<template>
  <teleport to="body">
    <transition name="fade">
      <div class="auth-overlay" v-if="authStore.showAuthModal" @click.self="authStore.closeAuthModal()"></div>
    </transition>

    <transition name="modal-pop">
      <div class="auth-modal" v-if="authStore.showAuthModal" role="dialog" aria-modal="true" id="auth-modal">

        <!-- Top Bar with Centered Branding Logo and Close Button -->
        <div class="modal-top">
          <div class="modal-logo-center">
            <img src="/radhe-timepieces-logo.svg" alt="Radhe Timepieces" class="modal-logo-img" />
          </div>
          <button class="modal-close" @click="authStore.closeAuthModal()" id="auth-modal-close" aria-label="Close">×</button>
        </div>

        <!-- Mode Toggle Tabs (Sign In / Create Account) -->
        <div class="auth-tabs" v-if="step !== 'success'">
          <button
            type="button"
            class="auth-tab"
            :class="{ active: mode === 'login' }"
            @click="setMode('login')"
            id="tab-btn-login"
          >
            Sign In
          </button>
          <button
            type="button"
            class="auth-tab"
            :class="{ active: mode === 'signup' }"
            @click="setMode('signup')"
            id="tab-btn-signup"
          >
            Create Account
          </button>
        </div>

        <!-- Step 1: Login Form -->
        <div v-if="step === 'form' && mode === 'login'">
          <h2 class="modal-title">Welcome</h2>
          <p class="modal-sub">{{ authStore.authSubtitle || 'Enter your email & password to continue' }}</p>

          <form @submit.prevent="doLogin" id="login-form">
            <div class="form-group">
              <label for="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                v-model="loginEmail"
                placeholder="Enter your email"
                required
                autocomplete="email"
                ref="emailRef"
              />
            </div>

            <div class="form-group">
              <label for="login-password">Password</label>
              <div class="input-eye">
                <input
                  :type="showLoginPwd ? 'text' : 'password'"
                  id="login-password"
                  v-model="loginPassword"
                  placeholder="Enter your password"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="eye-btn"
                  @click="showLoginPwd = !showLoginPwd"
                  id="login-show-pwd"
                  :aria-label="showLoginPwd ? 'Hide password' : 'Show password'"
                >
                  <svg v-if="!showLoginPwd" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                </button>
              </div>
            </div>

            <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>

            <button type="submit" class="btn-gold" id="login-submit-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Signing in...' : 'Sign In →' }}
            </button>
          </form>

          <p class="modal-switch-text">
            Don't have an account?
            <button type="button" class="link-btn" @click="setMode('signup')">Create Account</button>
          </p>
          <p class="modal-note">🔒 Your information is safe with us</p>
        </div>

        <!-- Step 2: Signup Form (With Centered Branding Logo) -->
        <div v-if="step === 'form' && mode === 'signup'">
          <h2 class="modal-title">Create Account</h2>
          <p class="modal-sub">{{ authStore.authSubtitle || 'Sign up to save favorites and track your orders' }}</p>

          <form @submit.prevent="doSignup" id="signup-form">
            <div class="form-row">
              <div class="form-group">
                <label for="signup-name">Full Name</label>
                <input
                  type="text"
                  id="signup-name"
                  v-model="signupData.name"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div class="form-group">
                <label for="signup-phone">Phone (optional)</label>
                <input
                  type="tel"
                  id="signup-phone"
                  v-model="signupData.phone"
                  placeholder="Enter your phone number (optional)"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                v-model="signupData.email"
                placeholder="Enter your email"
                required
                autocomplete="email"
              />
            </div>

            <!-- Create Password Field with Proper SVG Eye Icon -->
            <div class="form-group">
              <label for="signup-password">Create Password</label>
              <div class="input-eye">
                <input
                  :type="showSignupPwd ? 'text' : 'password'"
                  id="signup-password"
                  v-model="signupData.password"
                  placeholder="Enter your password"
                  required
                  minlength="6"
                />
                <button
                  type="button"
                  class="eye-btn"
                  @click="showSignupPwd = !showSignupPwd"
                  id="signup-show-pwd"
                  :aria-label="showSignupPwd ? 'Hide password' : 'Show password'"
                >
                  <svg v-if="!showSignupPwd" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirm Password Field with Proper SVG Eye Icon -->
            <div class="form-group">
              <label for="signup-confirm">Confirm Password</label>
              <div class="input-eye">
                <input
                  :type="showSignupConfirmPwd ? 'text' : 'password'"
                  id="signup-confirm"
                  v-model="signupData.confirm"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  class="eye-btn"
                  @click="showSignupConfirmPwd = !showSignupConfirmPwd"
                  id="signup-show-confirm-pwd"
                  :aria-label="showSignupConfirmPwd ? 'Hide password' : 'Show password'"
                >
                  <svg v-if="!showSignupConfirmPwd" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" y1="2" x2="22" y2="22"/>
                  </svg>
                </button>
              </div>
            </div>

            <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>

            <button type="submit" class="btn-gold" id="signup-submit-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Creating account...' : 'Create Account →' }}
            </button>
          </form>

          <p class="modal-switch-text">
            Already have an account?
            <button type="button" class="link-btn" @click="setMode('login')">Sign In</button>
          </p>

          <!-- Real connected Terms and Privacy links -->
          <p class="terms-note">
            By signing up, you agree to our
            <router-link to="/terms" @click="authStore.closeAuthModal()">Terms of Service</router-link>
            and
            <router-link to="/privacy" @click="authStore.closeAuthModal()">Privacy Policy</router-link>.
          </p>
        </div>

        <!-- Step 3: Success Screen -->
        <div v-if="step === 'success'" class="success-step">
          <div class="success-icon">✓</div>
          <h2>{{ isNewUser ? 'Account Created!' : 'Signed In!' }}</h2>
          <p>Welcome{{ authStore.currentUser?.name ? ', ' + authStore.currentUser.name : '' }}!</p>
          <p class="success-sub">Syncing your favorites and preferences…</p>
          <div class="progress-bar"><div class="progress-fill"></div></div>
        </div>

      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../store/auth'

const router = useRouter()
const step = ref('form') // 'form' | 'success'
const mode = ref('login') // 'login' | 'signup'

const loginEmail = ref('')
const loginPassword = ref('')
const showLoginPwd = ref(false)
const showSignupPwd = ref(false)
const showSignupConfirmPwd = ref(false)

const errorMsg = ref('')
const loading = ref(false)
const isNewUser = ref(false)
const emailRef = ref(null)

const signupData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm: ''
})

const setMode = (newMode) => {
  mode.value = newMode
  errorMsg.value = ''
  if (newMode === 'signup' && loginEmail.value && !signupData.value.email) {
    signupData.value.email = loginEmail.value
  } else if (newMode === 'login' && signupData.value.email && !loginEmail.value) {
    loginEmail.value = signupData.value.email
  }
}

// Reset modal state when opened
const resetModal = () => {
  step.value = 'form'
  mode.value = authStore.initialMode || 'login'
  loginEmail.value = ''
  loginPassword.value = ''
  showLoginPwd.value = false
  showSignupPwd.value = false
  showSignupConfirmPwd.value = false
  errorMsg.value = ''
  loading.value = false
  isNewUser.value = false
  signupData.value = { name: '', email: '', phone: '', password: '', confirm: '' }
  nextTick(() => emailRef.value?.focus())
}

watch(() => authStore.showAuthModal, (val) => {
  if (val) resetModal()
})

const doLogin = async () => {
  errorMsg.value = ''
  if (!loginEmail.value.trim() || !loginPassword.value) {
    errorMsg.value = 'Please enter both your email and password.'
    return
  }
  loading.value = true
  try {
    const result = await authStore.login(loginEmail.value, loginPassword.value)
    loading.value = false
    if (result.success) {
      isNewUser.value = false
      step.value = 'success'
      setTimeout(() => {
        authStore.closeAuthModal()
        if (authStore.authRedirectTo && authStore.authRedirectTo !== window.location.pathname) {
          router.push(authStore.authRedirectTo)
        }
      }, 1200)
    } else {
      errorMsg.value = result.error || 'Invalid email or password.'
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = 'Sign in request failed. Please check your credentials.'
  }
}

const doSignup = async () => {
  errorMsg.value = ''
  if (!signupData.value.name.trim()) {
    errorMsg.value = 'Please enter your full name.'
    return
  }
  if (!signupData.value.email.trim()) {
    errorMsg.value = 'Please enter your email address.'
    return
  }
  if (signupData.value.password !== signupData.value.confirm) {
    errorMsg.value = 'Passwords do not match.'
    return
  }
  if (signupData.value.password.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.'
    return
  }
  loading.value = true
  try {
    const result = await authStore.register({
      name: signupData.value.name,
      email: signupData.value.email,
      phone: signupData.value.phone,
      password: signupData.value.password
    })
    loading.value = false
    if (result.success) {
      isNewUser.value = true
      step.value = 'success'
      setTimeout(() => {
        authStore.closeAuthModal()
        if (authStore.authRedirectTo && authStore.authRedirectTo !== window.location.pathname) {
          router.push(authStore.authRedirectTo)
        }
      }, 1200)
    } else {
      errorMsg.value = result.error || 'Account creation failed.'
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = 'Could not create account. Please try again.'
  }
}
</script>

<style scoped>
.auth-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
}
.auth-modal {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem 2.25rem 2.25rem;
  width: min(480px, calc(100vw - 2rem));
  z-index: 2100;
  box-shadow: 0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(201,168,76,0.15);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

/* Modal Top: Centered Logo and Close Button */
.modal-top {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-top: 0.25rem;
}
.modal-logo-center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.modal-logo-img {
  height: 52px;
  width: auto;
  max-width: 170px;
  object-fit: contain;
  display: block;
}
.modal-close {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #f5f0e8;
  border: none;
  width: 34px; height: 34px;
  border-radius: 50%;
  font-size: 1.35rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #555;
  transition: all 0.2s;
  line-height: 1;
}
.modal-close:hover { background: #1a1a1a; color: #fff; }

/* Tabs for switching between Sign In and Create Account */
.auth-tabs {
  display: flex;
  background: #f7f3ea;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #ede4d2;
}
.auth-tab {
  flex: 1;
  padding: 0.65rem 0.5rem;
  border: none;
  background: transparent;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #777;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}
.auth-tab.active {
  background: #ffffff;
  color: #1a1a1a;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.auth-tab:hover:not(.active) {
  color: #C9A84C;
}

.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.85rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.35rem;
  text-align: center;
}
.modal-sub {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  color: #888;
  margin: 0 0 1.5rem;
  font-weight: 300;
  text-align: center;
}

.form-group { margin-bottom: 1.1rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.form-group label {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #666;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}
.form-group input {
  width: 100%;
  border: 1.5px solid #e0d5c0;
  border-radius: 10px;
  padding: 0.75rem 2.8rem 0.75rem 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: #faf8f4;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:not([type="password"]):not(#signup-password):not(#signup-confirm):not(#login-password) {
  padding-right: 1rem;
}
.form-group input:focus {
  border-color: #C9A84C;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
}
.input-eye { position: relative; width: 100%; }
.input-eye input { width: 100%; padding-right: 2.8rem; }
.eye-btn {
  position: absolute;
  right: 0.75rem; top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}
.eye-btn:hover {
  color: #C9A84C;
  background: rgba(201,168,76,0.1);
}
.eye-btn svg { display: block; }

.error-msg {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  color: #c53030;
  font-family: 'Jost', sans-serif;
  font-size: 0.83rem;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.btn-gold {
  width: 100%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  border: none;
  padding: 0.95rem;
  border-radius: 12px;
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 0.25s;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  margin-top: 0.5rem;
}
.btn-gold:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201,168,76,0.35);
}
.btn-gold:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

.modal-switch-text {
  font-family: 'Jost', sans-serif;
  font-size: 0.86rem;
  color: #777;
  text-align: center;
  margin-top: 1.25rem;
}
.link-btn {
  background: none;
  border: none;
  color: #C9A84C;
  font-family: 'Jost', sans-serif;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  margin-left: 0.25rem;
}
.link-btn:hover { color: #8B6914; }

.modal-note {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #aaa;
  text-align: center;
  margin-top: 0.75rem;
}
.terms-note {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #aaa;
  text-align: center;
  margin-top: 1rem;
}
.terms-note a { color: #C9A84C; text-decoration: underline; }
.terms-note a:hover { color: #8B6914; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Success Step */
.success-step { text-align: center; padding: 2rem 0; }
.success-icon {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  border-radius: 50%;
  font-size: 2rem;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem;
  animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.success-step h2 { font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 600; color: #1a1a1a; margin: 0 0 0.5rem; }
.success-step p { font-family: 'Jost', sans-serif; font-size: 0.95rem; color: #333; margin: 0 0 0.5rem; font-weight: 500; }
.success-sub { font-size: 0.85rem !important; color: #888 !important; margin-bottom: 1.5rem !important; font-weight: 300 !important; }
.progress-bar { background: #f0e8d8; border-radius: 4px; height: 4px; overflow: hidden; }
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #C9A84C, #8B6914);
  border-radius: 4px;
  animation: progress 1.5s linear forwards;
}
@keyframes progress { from { width: 0; } to { width: 100%; } }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-pop-enter-active { transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.modal-pop-leave-active { transition: all 0.2s ease; }
.modal-pop-enter-from { opacity: 0; transform: translate(-50%, -48%) scale(0.92); }
.modal-pop-leave-to { opacity: 0; transform: translate(-50%, -52%) scale(0.96); }

@media (max-width: 500px) {
  .form-row { grid-template-columns: 1fr; }
  .auth-modal { padding: 1.75rem 1.25rem; }
}
</style>
