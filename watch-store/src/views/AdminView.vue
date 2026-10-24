<template>
  <div class="admin-page">
    <!-- If NOT logged in as Admin: show dedicated Luxury Admin Login Card -->
    <div v-if="!adminAuth.isLoggedIn.value" class="admin-login-wrapper">
      <div class="admin-login-card">
        <div class="alc-header">
          <img src="/radhe-timepieces-logo.svg" alt="Radhe Timepieces" class="alc-logo" />
          <div class="alc-badge">Staff & Management Access</div>
          <h2 class="alc-title">Administrator Portal</h2>
          <p class="alc-subtitle">Enter your verified administrative credentials to access store management and product tools.</p>
        </div>

        <form @submit.prevent="submitAdminLogin" class="alc-form">
          <div v-if="adminLoginError" class="alc-error-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ adminLoginError }}</span>
          </div>

          <div class="alc-group">
            <label class="alc-label" for="admin-login-email">Admin Email Address</label>
            <div class="alc-input-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input
                id="admin-login-email"
                v-model="adminEmail"
                type="email"
                placeholder="admin@radhe.com"
                required
                autocomplete="username"
                class="alc-input"
              />
            </div>
          </div>

          <div class="alc-group">
            <label class="alc-label" for="admin-login-password">Password</label>
            <div class="alc-input-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                id="admin-login-password"
                v-model="adminPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                autocomplete="current-password"
                class="alc-input"
              />
              <button type="button" class="alc-pwd-toggle" @click="showPassword = !showPassword" aria-label="Toggle password visibility">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <!-- Quick Fill Demo Admin Credentials Button -->
          <button type="button" class="alc-quickfill-btn" @click="fillAdminCredentials">
            <span>✨ Fill Default Admin Credentials</span>
            <small>(admin@radhe.com / admin123)</small>
          </button>

          <button type="submit" class="alc-submit-btn" :disabled="adminLoggingIn" id="admin-submit-login-btn">
            <span v-if="adminLoggingIn" class="alc-spinner"></span>
            <span>{{ adminLoggingIn ? 'Authenticating Admin...' : 'Sign In to Management Studio' }}</span>
          </button>
        </form>

        <div class="alc-footer">
          <router-link to="/" class="alc-back-link">← Return to Storefront</router-link>
        </div>
      </div>
    </div>

    <!-- If logged in as Admin: show full Admin Studio -->
    <div v-else class="admin-container">
      <!-- Admin Header -->
      <header class="admin-header">
        <div class="header-titles">
          <div class="header-badge-row">
            <span class="header-badge">Admin Studio</span>
            <span class="admin-user-pill">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {{ adminAuth.admin.value?.name || 'Administrator' }} ({{ adminAuth.admin.value?.email }})
            </span>
          </div>
          <h1 class="page-title">Watch Catalog Management</h1>
          <p class="page-subtitle">
            Upload product images directly to the server, manage prices, stock, and update your dynamic storefront in real-time.
          </p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" @click="toggleUploaderModal" id="admin-open-uploader-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Images
          </button>
          <button class="btn-primary" @click="openCreateModal" id="admin-add-watch-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add New Watch
          </button>
          <button class="btn-refresh" @click="refreshProducts" :disabled="loading" title="Refresh products from database" id="admin-refresh-btn">
            <svg :class="{ spinning: loading }" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          </button>
          <button class="btn-logout" @click="handleAdminLogout" title="Sign Out of Admin" id="admin-logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </header>

      <!-- Customer Storefront Pricing Status Banner -->
      <section class="price-status-banner">
        <div class="psb-left">
          <span class="psb-icon">🔒</span>
          <div>
            <h4>Customer Storefront Pricing: <strong :class="store.hidePrice ? 'psb-hidden' : 'psb-visible'">{{ store.hidePrice ? 'HIDDEN (Price on Request Mode Active)' : 'VISIBLE' }}</strong></h4>
            <p>Prices are currently hidden across customer views. When you set the original MRP and selling prices tomorrow, you can reveal prices instantly with one click!</p>
          </div>
        </div>
        <div class="psb-right">
          <button type="button" class="toggle-pricing-btn" @click="store.hidePrice = !store.hidePrice">
            {{ store.hidePrice ? '👁️ Preview Customer Pricing' : '🔒 Hide Storefront Pricing' }}
          </button>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrap gold">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Timepieces</span>
            <span class="stat-value">{{ products.length }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap emerald">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">In Stock</span>
            <span class="stat-value">{{ inStockCount }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Categories</span>
            <span class="stat-value">{{ uniqueCategories.length }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Avg. Price</span>
            <span class="stat-value">₹{{ averagePrice.toLocaleString() }}</span>
          </div>
        </div>
      </section>

      <!-- Quick Backend Upload Banner Card -->
      <section class="backend-banner-card">
        <div class="bbc-content">
          <div class="bbc-badge">💡 Dynamic Image Upload</div>
          <h3 class="bbc-title">Upload any watch image directly from your computer</h3>
          <p class="bbc-desc">
            Images are uploaded through Laravel backend API <code>/api/upload-image</code>, stored in <code>public/uploads</code>, and synced directly to the Vite frontend for immediate display without manual copying!
          </p>
        </div>
        <div class="bbc-action">
          <label class="btn-gold-upload" id="admin-quick-upload-label">
            <input type="file" accept="image/*" @change="handleQuickUpload" style="display: none;" />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {{ quickUploading ? 'Uploading...' : 'Quick Upload Image' }}
          </label>
        </div>
      </section>

      <!-- Recent Uploads Strip -->
      <section class="recent-uploads-strip" v-if="uploadedUrls.length > 0">
        <div class="rus-header">
          <span class="rus-title">Uploaded in this session (click to copy URL):</span>
        </div>
        <div class="rus-list">
          <div
            v-for="(url, idx) in uploadedUrls"
            :key="idx"
            class="rus-chip"
            @click="copyUrl(url)"
            :title="'Click to copy: ' + url"
          >
            <img :src="url" alt="Uploaded" class="rus-thumb" />
            <span class="rus-url">{{ url }}</span>
            <span class="rus-copy-icon">📋</span>
          </div>
        </div>
      </section>

      <!-- Table Section -->
      <section class="table-card">
        <!-- Controls Bar -->
        <div class="table-controls">
          <!-- Search -->
          <div class="search-input-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              v-model="searchQuery"
              placeholder="Filter by name, brand, or SKU..."
              class="table-search"
              id="admin-table-search"
            />
            <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
          </div>

          <!-- Category Filter Tabs -->
          <div class="category-pills">
            <button
              v-for="cat in filterCategories"
              :key="cat"
              class="cat-pill"
              :class="{ active: selectedCategory === cat }"
              @click="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Products Table -->
        <div class="table-responsive">
          <table class="products-table">
            <thead>
              <tr>
                <th style="width: 80px;">Image</th>
                <th>Watch Name & Brand</th>
                <th>Category</th>
                <th>Price & MRP</th>
                <th>Badge</th>
                <th>Stock</th>
                <th style="text-align: right; width: 140px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading && products.length === 0">
                <td colspan="7" class="empty-state">
                  <div class="loader-spinner"></div>
                  <p>Loading catalog from database...</p>
                </td>
              </tr>
              <tr v-else-if="filteredProducts.length === 0">
                <td colspan="7" class="empty-state">
                  <p>No watches found matching your filter criteria.</p>
                  <button class="btn-text" @click="resetFilters">Reset Filters</button>
                </td>
              </tr>
              <tr v-for="item in filteredProducts" :key="item.id" class="product-row">
                <!-- Thumbnail -->
                <td>
                  <div class="thumb-wrap" @click="previewImage(item.image)">
                    <img :src="item.image" :alt="item.name" class="table-thumb" />
                  </div>
                </td>
                <!-- Name & Brand -->
                <td>
                  <div class="cell-name-brand">
                    <router-link :to="`/product/${item.id}`" class="item-name" target="_blank" title="View product page">
                      {{ item.name }}
                      <span class="ext-link">↗</span>
                    </router-link>
                    <span class="item-brand">{{ item.brand || 'Radhe Timepieces' }} • {{ item.type || 'Classic' }}</span>
                  </div>
                </td>
                <!-- Category -->
                <td>
                  <span class="category-badge">{{ item.category }}</span>
                </td>
                <!-- Price & MRP -->
                <td>
                  <div class="cell-price">
                    <span v-if="Number(item.price) > 0" class="current-price">₹{{ Number(item.price).toLocaleString() }}</span>
                    <span v-else class="pending-price-tag">⏳ Price Pending</span>
                    <span v-if="item.original_price || item.originalPrice" class="original-price">
                      ₹{{ Number(item.original_price || item.originalPrice).toLocaleString() }}
                    </span>
                    <span v-else-if="!Number(item.price)" class="text-muted" style="font-size: 0.72rem;">Set MRP tomorrow</span>
                    <span v-if="item.discount" class="discount-tag">-{{ item.discount }}%</span>
                  </div>
                </td>
                <!-- Badge -->
                <td>
                  <span v-if="item.badge" class="product-badge-tag">{{ item.badge }}</span>
                  <span v-else class="text-muted">—</span>
                </td>
                <!-- Stock Switch -->
                <td>
                  <button
                    class="stock-toggle-btn"
                    :class="{ 'in-stock': item.in_stock || item.inStock, 'out-of-stock': !(item.in_stock || item.inStock) }"
                    @click="toggleStock(item)"
                    :title="item.in_stock || item.inStock ? 'Click to mark Out of Stock' : 'Click to mark In Stock'"
                  >
                    <span class="toggle-dot"></span>
                    {{ (item.in_stock || item.inStock) ? 'In Stock' : 'Out of Stock' }}
                  </button>
                </td>
                <!-- Actions -->
                <td style="text-align: right;">
                  <div class="action-buttons">
                    <button class="btn-action edit" @click="openEditModal(item)" title="Edit Watch" id="admin-edit-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-action delete" @click="confirmDelete(item)" title="Delete Watch" id="admin-delete-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- ADD / EDIT MODAL -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
        <div class="modal-window">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">{{ isEditing ? 'Edit Timepiece' : 'Add New Timepiece' }}</h3>
              <p class="modal-subtitle">Configure watch specifications and upload high-res imagery</p>
            </div>
            <button class="modal-close-btn" @click="closeModal" id="admin-modal-close-btn">✕</button>
          </div>

          <form @submit.prevent="saveProduct" class="modal-body">
            <!-- Form Grid -->
            <div class="form-grid">
              <!-- Left Column: Image Uploader & Preview -->
              <div class="form-col-image">
                <label class="form-label">Product Imagery <span class="required">*</span></label>
                
                <div class="image-dropzone" :class="{ 'has-image': form.image || formImagePreview }">
                  <img
                    v-if="formImagePreview || form.image"
                    :src="formImagePreview || form.image"
                    alt="Preview"
                    class="dropzone-preview"
                  />
                  <div class="dropzone-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <p class="dropzone-text">Click or drag image file here</p>
                    <span class="dropzone-hint">PNG, JPG, WEBP or SVG up to 8MB</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    @change="onFileChange"
                    class="dropzone-file-input"
                    id="admin-form-file-input"
                  />
                </div>

                <!-- Or manual URL input -->
                <div class="form-group" style="margin-top: 1rem;">
                  <label class="form-label-sm">Or Direct Image URL / Path</label>
                  <input
                    v-model="form.image"
                    placeholder="/uploads/watch_sample.jpg or https://..."
                    class="form-input"
                    id="admin-form-image-url"
                  />
                </div>

                <div class="quick-sample-images">
                  <span class="qsi-label">Use existing asset:</span>
                  <div class="qsi-list">
                    <button
                      type="button"
                      v-for="(img, idx) in sampleAssets"
                      :key="idx"
                      class="qsi-btn"
                      @click="form.image = img; formImagePreview = ''"
                    >
                      <img :src="img" alt="sample" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Right Column: Specs & Details -->
              <div class="form-col-fields">
                <div class="form-row">
                  <div class="form-group flex-2">
                    <label class="form-label">Watch Name <span class="required">*</span></label>
                    <input
                      v-model="form.name"
                      placeholder="e.g. Royal Chronograph Gold"
                      class="form-input"
                      required
                      id="admin-form-name"
                    />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Brand</label>
                    <input
                      v-model="form.brand"
                      placeholder="Radhe"
                      class="form-input"
                      id="admin-form-brand"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label class="form-label">Category <span class="required">*</span></label>
                    <select v-model="form.category" class="form-select" required id="admin-form-category">
                      <option value="Women">Women's</option>
                      <option value="Men">Men's</option>
                      <option value="Smart">Smart</option>
                      <option value="Couple">Couples</option>
                      <option value="Sport">Sport</option>
                      <option value="Classic">Classic</option>
                    </select>
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Type</label>
                    <select v-model="form.type" class="form-select" id="admin-form-type">
                      <option value="Classic">Classic</option>
                      <option value="Chronograph">Chronograph</option>
                      <option value="Sport">Sport</option>
                      <option value="Smartwatch">Smartwatch</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Badge</label>
                    <input
                      v-model="form.badge"
                      placeholder="Bestseller, New, Trending..."
                      class="form-input"
                      id="admin-form-badge"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label class="form-label">Selling Price (₹) <span class="required">*</span></label>
                    <input
                      type="number"
                      v-model.number="form.price"
                      placeholder="18995"
                      class="form-input"
                      required
                      min="0"
                      @input="calculateDiscount"
                      id="admin-form-price"
                    />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Original MRP (₹)</label>
                    <input
                      type="number"
                      v-model.number="form.original_price"
                      placeholder="23999"
                      class="form-input"
                      min="0"
                      @input="calculateDiscount"
                      id="admin-form-mrp"
                    />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Discount (%)</label>
                    <input
                      type="number"
                      v-model.number="form.discount"
                      placeholder="20"
                      class="form-input"
                      min="0"
                      max="100"
                      id="admin-form-discount"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label class="form-label">Movement</label>
                    <input
                      v-model="form.movement"
                      placeholder="Swiss Quartz / Automatic"
                      class="form-input"
                      id="admin-form-movement"
                    />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Case Diameter</label>
                    <input
                      v-model="form.case_diameter"
                      placeholder="38mm / 42mm"
                      class="form-input"
                      id="admin-form-case"
                    />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Strap Material</label>
                    <input
                      v-model="form.strap"
                      placeholder="Gold Bracelet / Leather"
                      class="form-input"
                      id="admin-form-strap"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group flex-2">
                    <label class="form-label">Features (comma separated)</label>
                    <input
                      v-model="featuresString"
                      placeholder="Swiss Movement, Sapphire Crystal, 50m Water Resistant"
                      class="form-input"
                      id="admin-form-features"
                    />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">In Stock?</label>
                    <div class="stock-checkbox-wrap">
                      <input type="checkbox" id="form-instock" v-model="form.in_stock" class="custom-checkbox" />
                      <label for="form-instock" class="checkbox-label">Available in Stock</label>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    placeholder="Enter an inspiring, luxurious description of the timepiece craftsmanship..."
                    class="form-textarea"
                    id="admin-form-description"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="submitting" id="admin-submit-save-btn">
                <span v-if="submitting">Saving to Database...</span>
                <span v-else>{{ isEditing ? 'Save Changes' : 'Create Timepiece' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- STANDALONE IMAGE UPLOADER MODAL -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showUploaderModal" @click.self="showUploaderModal = false">
        <div class="modal-window modal-sm">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Backend Image Uploader</h3>
              <p class="modal-subtitle">Upload assets to <code>public/uploads</code> on server</p>
            </div>
            <button class="modal-close-btn" @click="showUploaderModal = false">✕</button>
          </div>

          <div class="modal-body">
            <div class="image-dropzone standalone" :class="{ uploading: standaloneUploading }">
              <input
                type="file"
                accept="image/*"
                multiple
                @change="handleBatchUpload"
                class="dropzone-file-input"
                id="admin-batch-file-input"
              />
              <div class="dropzone-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p class="dropzone-text">{{ standaloneUploading ? 'Uploading to server...' : 'Drag and drop watch images here' }}</p>
                <span class="dropzone-hint">Supports JPEG, PNG, WEBP, SVG</span>
              </div>
            </div>

            <div v-if="lastUploadedUrl" class="upload-success-box">
              <div class="usb-row">
                <img :src="lastUploadedUrl" alt="Last upload" class="usb-thumb" />
                <div class="usb-details">
                  <span class="usb-tag">✓ Ready to use</span>
                  <code class="usb-code">{{ lastUploadedUrl }}</code>
                </div>
              </div>
              <button class="btn-copy-url" @click="copyUrl(lastUploadedUrl)">
                Copy URL
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="showUploaderModal = false">Close</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- DELETE CONFIRMATION MODAL -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="productToDelete" @click.self="productToDelete = null">
        <div class="modal-window modal-sm">
          <div class="modal-header">
            <h3 class="modal-title">Delete Timepiece</h3>
            <button class="modal-close-btn" @click="productToDelete = null">✕</button>
          </div>
          <div class="modal-body delete-prompt">
            <div class="delete-icon">⚠️</div>
            <h4>Are you sure you want to delete this watch?</h4>
            <p>
              "<strong>{{ productToDelete.name }}</strong>" will be permanently removed from the MySQL database and store catalog.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="productToDelete = null">Cancel</button>
            <button class="btn-danger" @click="executeDelete" :disabled="deleting" id="admin-confirm-delete-btn">
              {{ deleting ? 'Deleting...' : 'Yes, Delete Watch' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { store } from '../store'
import { adminAuth } from '../store/adminAuth'

// Admin Login State
const adminEmail = ref('admin@radhe.com')
const adminPassword = ref('')
const showPassword = ref(false)
const adminLoggingIn = ref(false)
const adminLoginError = ref('')

const fillAdminCredentials = () => {
  adminEmail.value = 'admin@radhe.com'
  adminPassword.value = 'admin123'
}

const submitAdminLogin = async () => {
  adminLoggingIn.value = true
  adminLoginError.value = ''
  const result = await adminAuth.login(adminEmail.value, adminPassword.value)
  adminLoggingIn.value = false
  if (result.success) {
    store.showToast(`Welcome back, ${result.admin.name || 'Administrator'}!`, 'success')
    adminPassword.value = ''
    store.fetchProducts()
  } else {
    adminLoginError.value = result.error
  }
}

const handleAdminLogout = () => {
  adminAuth.logout()
  store.showToast('Logged out of Admin Studio', 'info')
}

const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const quickUploading = ref(false)
const standaloneUploading = ref(false)

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const showUploaderModal = ref(false)
const productToDelete = ref(null)

const searchQuery = ref('')
const selectedCategory = ref('All')
const uploadedUrls = ref([])
const lastUploadedUrl = ref('')

const formSelectedFile = ref(null)
const formImagePreview = ref('')
const featuresString = ref('')

const sampleAssets = [
  '/images/watch_bell_ross_cyber_skeleton.jpg',
  '/images/watch_armani_exchange_gold_chrono.jpg',
  '/images/watch_rolex_datejust_36_twotone.jpg',
  '/images/watch_fossil_townsman_gold_skeleton.jpg',
  '/images/watch_rolex_datejust_41_superlative.jpg',
  '/images/watch_fossil_neutra_black_skeleton.jpg',
  '/images/watch_casio_edifice_tough_solar.jpg',
  '/images/watch_casio_edifice_speed_chrono.jpg',
  '/images/watch_versace_hellenyium_twotone.jpg',
  '/images/watch_richard_mille_skeleton_gold.jpg',
  '/images/watch_womens_gold.jpg',
  '/images/watch_mens_silver.jpg',
  '/images/watch_womens_rose.jpg',
  '/images/watch_mens_black.jpg',
  '/images/watch_vintage_brown.jpg',
]

const form = reactive({
  name: '',
  brand: 'Radhe',
  category: 'Women',
  type: 'Classic',
  price: '',
  original_price: '',
  discount: 0,
  image: '/images/watch_womens_gold.jpg',
  badge: 'New',
  movement: 'Swiss Quartz',
  case_diameter: '36mm',
  strap: 'Gold Bracelet',
  description: '',
  in_stock: true,
})

const products = computed(() => store.products || [])

const filterCategories = ['All', 'Women', 'Men', 'Smart', 'Couple', 'Sport']

const uniqueCategories = computed(() => {
  const set = new Set(products.value.map(p => p.category).filter(Boolean))
  return Array.from(set)
})

const inStockCount = computed(() =>
  products.value.filter(p => (p.in_stock !== undefined ? p.in_stock : p.inStock)).length
)

const averagePrice = computed(() => {
  if (!products.value.length) return 0
  const sum = products.value.reduce((acc, p) => acc + (Number(p.price) || 0), 0)
  return Math.round(sum / products.value.length)
})

const filteredProducts = computed(() => {
  let list = products.value
  if (selectedCategory.value !== 'All') {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.type?.toLowerCase().includes(q)
    )
  }
  return list
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'All'
}

const refreshProducts = async () => {
  loading.value = true
  await store.fetchProducts()
  loading.value = false
  store.showToast('Catalog refreshed from database!', 'success')
}

onMounted(() => {
  store.fetchProducts()
})

const calculateDiscount = () => {
  if (form.original_price && form.price && form.original_price > form.price) {
    const disc = Math.round(((form.original_price - form.price) / form.original_price) * 100)
    form.discount = disc
  }
}

// Image handling
const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    formSelectedFile.value = file
    formImagePreview.value = URL.createObjectURL(file)
  }
}

const toggleUploaderModal = () => {
  showUploaderModal.value = !showUploaderModal.value
}

// Quick upload directly to /api/upload-image
const handleQuickUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  quickUploading.value = true
  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (res.ok && data.success) {
      uploadedUrls.value.unshift(data.url)
      lastUploadedUrl.value = data.url
      store.showToast(`Image uploaded to ${data.url}!`, 'success')
    } else {
      store.showToast(data.error || 'Upload failed', 'error')
    }
  } catch (err) {
    store.showToast('Network error during upload', 'error')
  } finally {
    quickUploading.value = false
    e.target.value = ''
  }
}

// Batch upload in modal
const handleBatchUpload = async (e) => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return

  standaloneUploading.value = true
  for (const file of files) {
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        uploadedUrls.value.unshift(data.url)
        lastUploadedUrl.value = data.url
      }
    } catch (err) {
      console.error(err)
    }
  }
  standaloneUploading.value = false
  store.showToast(`${files.length} image(s) uploaded successfully!`, 'success')
  e.target.value = ''
}

const copyUrl = (url) => {
  navigator.clipboard.writeText(url)
  store.showToast('Copied URL to clipboard: ' + url, 'info')
}

const previewImage = (url) => {
  window.open(url, '_blank')
}

// Toggle in-stock instant switch
const toggleStock = async (item) => {
  const current = item.in_stock !== undefined ? item.in_stock : item.inStock
  const nextVal = !current

  // Optimistic update in UI
  item.in_stock = nextVal
  item.inStock = nextVal

  try {
    const res = await fetch(`/api/products/${item.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ in_stock: nextVal })
    })
    if (!res.ok) {
      item.in_stock = current
      item.inStock = current
      store.showToast('Could not update stock status in DB', 'error')
    } else {
      store.showToast(`"${item.name}" is now ${nextVal ? 'In Stock' : 'Out of Stock'}`, 'success')
    }
  } catch (e) {
    item.in_stock = current
    item.inStock = current
    store.showToast('Network error', 'error')
  }
}

// Modal open/close
const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formSelectedFile.value = null
  formImagePreview.value = ''
  featuresString.value = 'Swiss Movement, Sapphire Crystal, 50m Water Resistant'

  Object.assign(form, {
    name: '',
    brand: 'Radhe',
    category: 'Women',
    type: 'Classic',
    price: '',
    original_price: '',
    discount: 0,
    image: '/images/watch_womens_gold.jpg',
    badge: 'New',
    movement: 'Swiss Quartz',
    case_diameter: '36mm',
    strap: 'Gold Bracelet',
    description: 'A sublime timepiece crafted with impeccable precision.',
    in_stock: true,
  })

  showModal.value = true
}

const openEditModal = (item) => {
  isEditing.value = true
  editingId.value = item.id
  formSelectedFile.value = null
  formImagePreview.value = ''

  const feat = Array.isArray(item.features) ? item.features.join(', ') : (item.features || '')
  featuresString.value = feat

  Object.assign(form, {
    name: item.name || '',
    brand: item.brand || 'Radhe',
    category: item.category || 'Women',
    type: item.type || 'Classic',
    price: item.price || '',
    original_price: item.original_price || item.originalPrice || '',
    discount: item.discount || 0,
    image: item.image || '/images/watch_womens_gold.jpg',
    badge: item.badge || '',
    movement: item.movement || 'Swiss Quartz',
    case_diameter: item.case_diameter || item.caseDiameter || '36mm',
    strap: item.strap || 'Leather',
    description: item.description || '',
    in_stock: item.in_stock !== undefined ? Boolean(item.in_stock) : (item.inStock !== undefined ? Boolean(item.inStock) : true),
  })

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Submit Create or Update
const saveProduct = async () => {
  submitting.value = true

  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('brand', form.brand || 'Radhe')
  formData.append('category', form.category)
  formData.append('type', form.type)
  formData.append('price', form.price)
  if (form.original_price) formData.append('original_price', form.original_price)
  if (form.discount !== undefined) formData.append('discount', form.discount)
  formData.append('badge', form.badge || '')
  formData.append('movement', form.movement || '')
  formData.append('case_diameter', form.case_diameter || '')
  formData.append('strap', form.strap || '')
  formData.append('description', form.description || '')
  formData.append('in_stock', form.in_stock ? '1' : '0')

  // Features list
  const feats = featuresString.value.split(',').map(s => s.trim()).filter(Boolean)
  formData.append('features', JSON.stringify(feats))

  // File upload or image URL
  if (formSelectedFile.value) {
    formData.append('image_file', formSelectedFile.value)
  } else if (form.image) {
    formData.append('image', form.image)
  }

  try {
    const endpoint = isEditing.value ? `/api/products/${editingId.value}` : '/api/products'
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })

    const data = await res.json()
    if (res.ok && data.success) {
      store.showToast(isEditing.value ? 'Timepiece updated successfully!' : '✨ New timepiece added to store!', 'success')
      await store.fetchProducts()
      closeModal()
    } else {
      store.showToast(data.error || 'Failed to save product', 'error')
    }
  } catch (err) {
    store.showToast('Network error while saving timepiece', 'error')
  } finally {
    submitting.value = false
  }
}

// Delete product
const confirmDelete = (item) => {
  productToDelete.value = item
}

const executeDelete = async () => {
  if (!productToDelete.value) return
  deleting.value = true

  try {
    const res = await fetch(`/api/products/${productToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      }
    })

    const data = await res.json()
    if (res.ok && data.success) {
      store.showToast(`Deleted "${productToDelete.value.name}"`, 'info')
      productToDelete.value = null
      await store.fetchProducts()
    } else {
      store.showToast(data.error || 'Failed to delete product', 'error')
    }
  } catch (err) {
    store.showToast('Network error during deletion', 'error')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.admin-page {
  padding-top: 86px;
  padding-bottom: 5rem;
  background: #fbf9f5;
  min-height: 100vh;
}

/* Luxury Admin Login Screen */
.admin-login-wrapper {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}

.admin-login-card {
  background: #ffffff;
  border: 1px solid #e8decb;
  border-radius: 20px;
  max-width: 460px;
  width: 100%;
  padding: 2.75rem 2.25rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(201, 168, 76, 0.15);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.admin-login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #C9A84C, #E8D5B0, #8B6914);
}

.alc-logo {
  height: 58px;
  width: auto;
  max-width: 180px;
  object-fit: contain;
  margin-bottom: 1.25rem;
}

.alc-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8B6914;
  background: #fbf6ec;
  border: 1px solid rgba(201, 168, 76, 0.35);
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  margin-bottom: 0.75rem;
}

.alc-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #1a1714;
  margin-bottom: 0.4rem;
}

.alc-subtitle {
  font-size: 0.88rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.75rem;
}

.alc-error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.84rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
  text-align: left;
}

.alc-form {
  text-align: left;
}

.alc-group {
  margin-bottom: 1.25rem;
}

.alc-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #444;
  margin-bottom: 0.45rem;
}

.alc-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.alc-input-wrap svg {
  position: absolute;
  left: 0.9rem;
  color: #999;
  pointer-events: none;
}

.alc-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.6rem;
  border: 1px solid #ded5c5;
  border-radius: 10px;
  font-size: 0.92rem;
  font-family: 'Jost', sans-serif;
  background: #faf7f2;
  color: #1a1714;
  transition: all 0.2s ease;
}

.alc-input:focus {
  outline: none;
  background: #fff;
  border-color: #C9A84C;
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.18);
}

.alc-pwd-toggle {
  position: absolute;
  right: 0.85rem;
  background: none;
  border: none;
  color: #888;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem;
}
.alc-pwd-toggle:hover { color: #C9A84C; }

.alc-quickfill-btn {
  width: 100%;
  background: #fbf8f2;
  border: 1px dashed #d8cca8;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  color: #8B6914;
  font-size: 0.82rem;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  cursor: pointer;
  margin-bottom: 1.25rem;
  transition: all 0.2s ease;
}
.alc-quickfill-btn:hover {
  background: #f5eedc;
  border-color: #C9A84C;
}
.alc-quickfill-btn small {
  font-size: 0.72rem;
  color: #998048;
}

.alc-submit-btn {
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.94rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(201, 168, 76, 0.35);
  transition: all 0.25s ease;
}
.alc-submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #d8b858, #9c7717);
  box-shadow: 0 10px 24px rgba(201, 168, 76, 0.45);
  transform: translateY(-1px);
}
.alc-submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.alc-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.alc-footer {
  margin-top: 1.5rem;
  text-align: center;
}
.alc-back-link {
  font-size: 0.85rem;
  color: #888;
  text-decoration: none;
  transition: color 0.2s ease;
}
.alc-back-link:hover {
  color: #C9A84C;
}

.header-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}
.admin-user-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.76rem;
  font-weight: 500;
  color: #555;
  background: #f0e9dc;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid #ded5c5;
}
.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: #fff;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 0.75rem 1.1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-logout:hover {
  background: #fef2f2;
  border-color: #dc2626;
  color: #991b1b;
}

.admin-container {
  max-width: 1420px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

/* Header */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #C9A84C;
  background: rgba(201, 168, 76, 0.12);
  border: 1px solid rgba(201, 168, 76, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  margin-bottom: 0.5rem;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.3rem;
  font-weight: 600;
  color: #1a1714;
  line-height: 1.15;
  margin-bottom: 0.35rem;
}

.page-subtitle {
  font-size: 0.94rem;
  color: #666;
  max-width: 680px;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #C9A84C, #8B6914);
  color: #fff;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 14px rgba(201, 168, 76, 0.35);
  transition: all 0.25s ease;
}
.btn-primary:hover {
  background: linear-gradient(135deg, #d8b858, #9c7717);
  box-shadow: 0 6px 20px rgba(201, 168, 76, 0.45);
  transform: translateY(-1px);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  color: #1a1714;
  border: 1px solid #e0d8cc;
  padding: 0.75rem 1.3rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.25s ease;
}
.btn-secondary:hover {
  background: #f7f3ec;
  border-color: #C9A84C;
  color: #8B6914;
}

.btn-refresh {
  background: #fff;
  color: #444;
  border: 1px solid #e0d8cc;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}
.btn-refresh:hover {
  border-color: #C9A84C;
  color: #C9A84C;
}
.btn-refresh svg.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Price Visibility Status Banner */
.price-status-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #fffcf4 0%, #faf5ea 100%);
  border: 1px solid #e8dbbe;
  border-left: 4px solid #C9A84C;
  border-radius: 12px;
  padding: 1.15rem 1.5rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.08);
  gap: 1.5rem;
  flex-wrap: wrap;
}
.psb-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.psb-icon {
  font-size: 1.8rem;
  line-height: 1;
}
.price-status-banner h4 {
  font-family: 'Jost', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1714;
  margin: 0 0 0.2rem;
}
.psb-hidden {
  color: #c97a14;
  background: rgba(201, 122, 20, 0.12);
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  font-size: 0.88rem;
}
.psb-visible {
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  font-size: 0.88rem;
}
.price-status-banner p {
  font-size: 0.84rem;
  color: #666;
  margin: 0;
}
.toggle-pricing-btn {
  background: #fff;
  border: 1px solid #C9A84C;
  color: #8B6914;
  font-family: 'Jost', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  padding: 0.65rem 1.15rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}
.toggle-pricing-btn:hover {
  background: #C9A84C;
  color: #fff;
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.3);
}

.pending-price-tag {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #b45309;
  background: #fef3c7;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  letter-spacing: 0.02em;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}
.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  border: 1px solid #ede7dc;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}
.stat-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon-wrap.gold { background: #fdf6e6; color: #C9A84C; }
.stat-icon-wrap.emerald { background: #eafaf1; color: #10b981; }
.stat-icon-wrap.blue { background: #eff6ff; color: #3b82f6; }
.stat-icon-wrap.purple { background: #faf5ff; color: #8b5cf6; }

.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-label {
  font-size: 0.78rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin-bottom: 0.2rem;
}
.stat-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1714;
  line-height: 1;
}

/* Backend Banner Card */
.backend-banner-card {
  background: linear-gradient(135deg, #1e1b17 0%, #2b251f 100%);
  border-radius: 14px;
  padding: 1.6rem 2rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  border: 1px solid rgba(201, 168, 76, 0.2);
}
.bbc-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #C9A84C;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}
.bbc-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.45rem;
  color: #fdfaf5;
  margin-bottom: 0.4rem;
}
.bbc-desc {
  font-size: 0.88rem;
  color: #bbb;
  max-width: 800px;
  line-height: 1.5;
}
.bbc-desc code {
  background: rgba(255,255,255,0.12);
  color: #C9A84C;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.82rem;
}
.btn-gold-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #C9A84C;
  color: #1a1714;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.85rem 1.6rem;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(201, 168, 76, 0.35);
}
.btn-gold-upload:hover {
  background: #e2be59;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(201, 168, 76, 0.45);
}

/* Recent Uploads Strip */
.recent-uploads-strip {
  background: #fff;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  border: 1px solid #ede7dc;
  margin-bottom: 1.75rem;
}
.rus-header {
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
}
.rus-list {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.rus-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f6f0;
  border: 1px solid #e4dcce;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}
.rus-chip:hover {
  background: #C9A84C;
  color: #fff;
  border-color: #C9A84C;
}
.rus-thumb {
  width: 22px;
  height: 22px;
  object-fit: cover;
  border-radius: 50%;
}
.rus-url {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Table Card */
.table-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #ede7dc;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  overflow: hidden;
}

.table-controls {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #ede7dc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 340px;
}
.search-input-wrap svg {
  position: absolute;
  left: 0.9rem;
  color: #999;
}
.table-search {
  width: 100%;
  padding: 0.65rem 2.2rem 0.65rem 2.5rem;
  border: 1px solid #e0d8cc;
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: 'Jost', sans-serif;
  background: #fbf9f5;
  transition: all 0.2s ease;
}
.table-search:focus {
  outline: none;
  background: #fff;
  border-color: #C9A84C;
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
}
.clear-btn {
  position: absolute;
  right: 0.8rem;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}

.category-pills {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.cat-pill {
  background: #fbf9f5;
  border: 1px solid #e0d8cc;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
}
.cat-pill:hover {
  background: #f3ece0;
  color: #1a1714;
}
.cat-pill.active {
  background: #1a1714;
  color: #fff;
  border-color: #1a1714;
}

/* Products Table */
.table-responsive {
  overflow-x: auto;
}
.products-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.products-table th {
  background: #faf7f2;
  font-size: 0.74rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #777;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #ede7dc;
}
.products-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f2ece1;
  vertical-align: middle;
}
.product-row:hover td {
  background: #fdfbf7;
}

/* Table cells */
.thumb-wrap {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  overflow: hidden;
  background: #f7f3ec;
  border: 1px solid #ede5d8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.table-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}
.thumb-wrap:hover .table-thumb {
  transform: scale(1.1);
}

.cell-name-brand {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.item-name {
  font-family: 'Jost', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1714;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.item-name:hover {
  color: #C9A84C;
}
.ext-link {
  font-size: 0.8rem;
  color: #999;
}
.item-brand {
  font-size: 0.78rem;
  color: #888;
}

.category-badge {
  display: inline-block;
  background: #f4ede0;
  color: #8B6914;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
}

.cell-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.current-price {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1714;
}
.original-price {
  font-size: 0.82rem;
  color: #999;
  text-decoration: line-through;
}
.discount-tag {
  font-size: 0.72rem;
  font-weight: 600;
  background: #fef2f2;
  color: #dc2626;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.product-badge-tag {
  display: inline-block;
  background: #faf5eb;
  border: 1px solid rgba(201, 168, 76, 0.4);
  color: #8B6914;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  font-size: 0.74rem;
  font-weight: 600;
}
.text-muted {
  color: #bbb;
}

/* Stock Toggle Button */
.stock-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}
.toggle-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.stock-toggle-btn.in-stock {
  background: #ecfdf5;
  color: #065f46;
  border-color: #a7f3d0;
}
.stock-toggle-btn.in-stock .toggle-dot {
  background: #10b981;
}
.stock-toggle-btn.out-of-stock {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}
.stock-toggle-btn.out-of-stock .toggle-dot {
  background: #ef4444;
}

/* Actions */
.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
}
.btn-action {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  border: 1px solid #e0d8cc;
  background: #fff;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-action.edit:hover {
  background: #fbf6ec;
  border-color: #C9A84C;
  color: #8B6914;
}
.btn-action.delete:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 3.5rem 1rem;
  color: #888;
}
.btn-text {
  background: none;
  border: none;
  color: #C9A84C;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 15, 12, 0.7);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-window {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.25);
  border: 1px solid #ede7dc;
  overflow: hidden;
}
.modal-window.modal-sm {
  max-width: 520px;
}

.modal-header {
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #ede7dc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  color: #1a1714;
  margin-bottom: 0.15rem;
}
.modal-subtitle {
  font-size: 0.82rem;
  color: #888;
}
.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #888;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
}
.modal-close-btn:hover {
  color: #1a1714;
  background: #f5f0e8;
}

.modal-body {
  padding: 1.75rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1.1rem 1.75rem;
  border-top: 1px solid #ede7dc;
  background: #faf7f2;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  background: #fff;
  border: 1px solid #dcd3c4;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-size: 0.88rem;
  color: #666;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #f7f3ec;
}
.btn-danger {
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-danger:hover {
  background: #b91c1c;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.75rem;
}
.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #444;
  margin-bottom: 0.45rem;
}
.form-label-sm {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #777;
  margin-bottom: 0.35rem;
}
.required {
  color: #dc2626;
}

.form-group {
  margin-bottom: 1rem;
}
.form-row {
  display: flex;
  gap: 0.85rem;
}
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid #dcd3c4;
  border-radius: 8px;
  font-family: 'Jost', sans-serif;
  font-size: 0.88rem;
  background: #fdfbf7;
  color: #1a1714;
  transition: all 0.2s ease;
}
.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  background: #fff;
  border-color: #C9A84C;
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
}

/* Image Dropzone */
.image-dropzone {
  position: relative;
  border: 2px dashed #dcd3c4;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  background: #faf7f2;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease;
}
.image-dropzone:hover {
  border-color: #C9A84C;
  background: #fdf9f0;
}
.dropzone-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
  width: 100%;
  height: 100%;
}
.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8B6914;
}
.dropzone-content svg {
  margin-bottom: 0.5rem;
  color: #C9A84C;
}
.dropzone-text {
  font-size: 0.85rem;
  font-weight: 500;
  color: #444;
  margin-bottom: 0.25rem;
}
.dropzone-hint {
  font-size: 0.72rem;
  color: #999;
}
.dropzone-preview {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #faf7f2;
  z-index: 1;
}

.quick-sample-images {
  margin-top: 1rem;
}
.qsi-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #888;
  display: block;
  margin-bottom: 0.35rem;
}
.qsi-list {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.qsi-btn {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #dcd3c4;
  background: #fff;
  padding: 1px;
  cursor: pointer;
  overflow: hidden;
}
.qsi-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.qsi-btn:hover {
  border-color: #C9A84C;
}

/* Checkbox */
.stock-checkbox-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.6rem;
}
.custom-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #C9A84C;
  cursor: pointer;
}
.checkbox-label {
  font-size: 0.88rem;
  color: #333;
  cursor: pointer;
}

/* Standalone Uploader Modal */
.image-dropzone.standalone {
  min-height: 180px;
}
.upload-success-box {
  margin-top: 1.25rem;
  background: #fdfaf5;
  border: 1px solid #e8dec8;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.usb-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.usb-thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0d8cc;
}
.usb-details {
  display: flex;
  flex-direction: column;
}
.usb-tag {
  font-size: 0.72rem;
  font-weight: 600;
  color: #059669;
}
.usb-code {
  font-size: 0.78rem;
  color: #444;
  background: #f0e9dc;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  margin-top: 0.2rem;
}
.btn-copy-url {
  background: #1a1714;
  color: #fff;
  border: none;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  cursor: pointer;
}
.btn-copy-url:hover {
  background: #C9A84C;
}

/* Delete Prompt */
.delete-prompt {
  text-align: center;
  padding: 2rem 1.5rem;
}
.delete-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}
.delete-prompt h4 {
  font-size: 1.2rem;
  color: #1a1714;
  margin-bottom: 0.5rem;
}
.delete-prompt p {
  font-size: 0.9rem;
  color: #666;
}

/* Loader */
.loader-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #eee;
  border-top-color: #C9A84C;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.75rem;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .backend-banner-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input-wrap {
    width: 100%;
  }
}
</style>
