<template>
  <teleport to="body">
    <transition name="fade">
      <div class="auth-overlay" v-if="authStore.showAuthModal" @click.self="authStore.closeAuthModal()"></div>
    </transition>

    <transition name="modal-pop">
      <div class="auth-modal" v-if="authStore.showAuthModal" role="dialog" aria-modal="true" id="auth-modal">

        <!-- Step 1: Enter Email -->
        <div v-if="step === 'email'">
          <div class="modal-header">
            <div class="modal-logo">
              <img src="/radhe-timepieces-logo.svg" alt="Radhe Timepieces" class="modal-logo-img" />
            </div>
            <button class="modal-close" @click="authStore.closeAuthModal()" id="auth-modal-close" aria-label="Close">×</button>
          </div>
          <h2>Welcome</h2>
          <p class="modal-sub">Enter your email to continue to checkout</p>

          <form @submit.prevent="checkEmail" id="email-check-form">
            <div class="form-group">
              <label for="auth-email">Email Address</label>
              <input
                type="email"
                id="auth-email"
                v-model="emailInput"
                placeholder="you@example.com"
                required
                autocomplete="email"
                ref="emailRef"
              />
            </div>
            <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>
            <button type="submit" class="btn-gold" id="auth-email-continue-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Checking...' : 'Continue →' }}
            </button>
          </form>

          <p class="modal-note">🔒 Your information is safe with us</p>
        </div>

        <!-- Step 2a: Login -->
        <div v-if="step === 'login'">
          <div class="modal-header">
            <button class="back-btn" @click="step = 'email'" id="auth-back-btn">← Back</button>
            <button class="modal-close" @click="authStore.closeAuthModal()" aria-label="Close">×</button>
          </div>
          <div class="user-greeting">
            <div class="user-avatar">{{ emailInput[0].toUpperCase() }}</div>
            <div>
              <h2>Welcome back!</h2>
              <p class="modal-sub">{{ emailInput }}</p>
            </div>
          </div>

          <form @submit.prevent="doLogin" id="login-form">
            <div class="form-group">
              <label for="login-password">Password</label>
              <div class="input-eye">
                <input
                  :type="showPwd ? 'text' : 'password'"
                  id="login-password"
                  v-model="passwordInput"
                  placeholder="Your password"
                  required
                  autocomplete="current-password"
                />
                <button type="button" class="eye-btn" @click="showPwd = !showPwd" id="login-show-pwd" aria-label="Toggle password">
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
            <a href="#" class="forgot-link" id="auth-forgot-link">Forgot password?</a>
            <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>
            <button type="submit" class="btn-gold" id="login-submit-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Signing in...' : 'Sign In & Checkout →' }}
            </button>
          </form>
        </div>

        <!-- Step 2b: Sign Up -->
        <div v-if="step === 'signup'">
          <div class="modal-header">
            <button class="back-btn" @click="step = 'email'" id="signup-back-btn">← Back</button>
            <button class="modal-close" @click="authStore.closeAuthModal()" aria-label="Close">×</button>
          </div>
          <h2>Create Account</h2>
          <p class="modal-sub">New to Luxoria? Join us — it's free!</p>

          <form @submit.prevent="doSignup" id="signup-form">
            <div class="form-row">
              <div class="form-group">
                <label for="signup-name">Full Name</label>
                <input type="text" id="signup-name" v-model="signupData.name" placeholder="Jane Doe" required />
              </div>
              <div class="form-group">
                <label for="signup-phone">Phone (optional)</label>
                <input type="tel" id="signup-phone" v-model="signupData.phone" placeholder="+91 98765 43210" />
              </div>
            </div>
            <div class="form-group">
              <label for="signup-email-display">Email Address</label>
              <input type="email" id="signup-email-display" :value="emailInput" disabled class="input-disabled" />
            </div>
            <div class="form-group">
              <label for="signup-password">Create Password</label>
              <div class="input-eye">
                <input
                  :type="showPwd ? 'text' : 'password'"
                  id="signup-password"
                  v-model="signupData.password"
                  placeholder="Min. 6 characters"
                  required
                  minlength="6"
                />
                <button type="button" class="eye-btn" @click="showPwd = !showPwd" id="signup-show-pwd" aria-label="Toggle password">
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>
            <div class="form-group">
              <label for="signup-confirm">Confirm Password</label>
              <input
                :type="showPwd ? 'text' : 'password'"
                id="signup-confirm"
                v-model="signupData.confirm"
                placeholder="Re-enter password"
                required
              />
            </div>
            <p class="error-msg" v-if="errorMsg">{{ errorMsg }}</p>
            <button type="submit" class="btn-gold" id="signup-submit-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Creating account...' : 'Create Account & Checkout →' }}
            </button>
          </form>
          <p class="terms-note">By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
        </div>

        <!-- Step 3: Success -->
        <div v-if="step === 'success'" class="success-step">
          <div class="success-icon">✓</div>
          <h2>{{ isNewUser ? 'Account Created!' : 'Signed In!' }}</h2>
          <p>Welcome{{ authStore.currentUser?.name ? ', ' + authStore.currentUser.name : '' }}! Taking you to checkout…</p>
          <div class="progress-bar"><div class="progress-fill"></div></div>
        </div>

      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../store/auth'

const router = useRouter()
const step = ref('email')
const emailInput = ref('')
const passwordInput = ref('')
const showPwd = ref(false)
const errorMsg = ref('')
const loading = ref(false)
const isNewUser = ref(false)
const emailRef = ref(null)
const signupData = ref({ name: '', phone: '', password: '', confirm: '' })

// Reset modal state when opened
const resetModal = () => {
  step.value = 'email'
  emailInput.value = ''
  passwordInput.value = ''
  errorMsg.value = ''
  loading.value = false
  showPwd.value = false
  isNewUser.value = false
  signupData.value = { name: '', phone: '', password: '', confirm: '' }
  nextTick(() => emailRef.value?.focus())
}

// Watch for modal open
import { watch } from 'vue'
watch(() => authStore.showAuthModal, (val) => {
  if (val) resetModal()
})

const checkEmail = async () => {
  errorMsg.value = ''
  loading.value = true
  try {
    const user = await authStore.emailExists(emailInput.value)
    loading.value = false
    if (user) {
      step.value = 'login'
    } else {
      step.value = 'signup'
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = 'Could not verify email. Please try again.'
  }
}

const doLogin = async () => {
  errorMsg.value = ''
  loading.value = true
  try {
    const result = await authStore.login(emailInput.value, passwordInput.value)
    loading.value = false
    if (result.success) {
      isNewUser.value = false
      step.value = 'success'
      setTimeout(() => {
        authStore.closeAuthModal()
        router.push(authStore.authRedirectTo)
      }, 1400)
    } else {
      errorMsg.value = result.error || 'Login failed.'
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = 'Sign in request failed. Please check your credentials.'
  }
}

const doSignup = async () => {
  errorMsg.value = ''
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
      email: emailInput.value,
      phone: signupData.value.phone,
      password: signupData.value.password
    })
    loading.value = false
    if (result.success) {
      isNewUser.value = true
      step.value = 'success'
      setTimeout(() => {
        authStore.closeAuthModal()
        router.push(authStore.authRedirectTo)
      }, 1400)
    } else {
      errorMsg.value = result.error || 'Signup failed.'
    }
  } catch (err) {
    loading.value = false
    errorMsg.value = 'Account registration failed. Please try again.'
  }
}
</script>

<style scoped>
.auth-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 12, 8, 0.6);
  z-index: 2000;
  backdrop-filter: blur(4px);
}
.auth-modal {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  width: min(480px, calc(100vw - 2rem));
  z-index: 2100;
  box-shadow: 0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(201,168,76,0.15);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.modal-logo {
  display: flex;
  align-items: center;
}
.modal-logo-img {
  height: 44px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
}
.modal-close {
  background: #f5f0e8;
  border: none;
  width: 32px; height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #555;
  transition: all 0.2s;
  line-height: 1;
}
.modal-close:hover { background: #1a1a1a; color: #fff; }
.back-btn {
  background: none;
  border: none;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #888;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.back-btn:hover { color: #C9A84C; }
.auth-modal h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.4rem;
}
.modal-sub {
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  color: #888;
  margin: 0 0 1.75rem;
  font-weight: 300;
}
.user-greeting {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
}
.user-avatar {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  font-family: 'Jost', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-greeting h2 { margin-bottom: 0.15rem; }
.user-greeting .modal-sub { margin: 0; }
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
  padding: 0.75rem 1rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.95rem;
  color: #1a1a1a;
  background: #faf8f4;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input:focus {
  border-color: #C9A84C;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
}
.input-disabled { opacity: 0.6; cursor: not-allowed; }
.input-eye { position: relative; }
.input-eye input { padding-right: 3rem; }
.eye-btn {
  position: absolute;
  right: 0.75rem; top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
}
.forgot-link {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.82rem;
  color: #C9A84C;
  text-align: right;
  margin: -0.5rem 0 1rem;
  text-decoration: none;
}
.forgot-link:hover { text-decoration: underline; }
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
.btn-gold:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.35); }
.btn-gold:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.modal-note {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #aaa;
  text-align: center;
  margin-top: 1.25rem;
}
.terms-note {
  font-family: 'Jost', sans-serif;
  font-size: 0.78rem;
  color: #aaa;
  text-align: center;
  margin-top: 1rem;
}
.terms-note a { color: #C9A84C; text-decoration: none; }
.terms-note a:hover { text-decoration: underline; }
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
.success-step p { font-family: 'Jost', sans-serif; font-size: 0.9rem; color: #888; margin: 0 0 1.5rem; }
.progress-bar { background: #f0e8d8; border-radius: 4px; height: 4px; overflow: hidden; }
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #C9A84C, #8B6914);
  border-radius: 4px;
  animation: progress 1.8s linear forwards;
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
  .auth-modal { padding: 1.75rem 1.5rem; }
}
</style>
