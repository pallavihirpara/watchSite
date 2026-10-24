<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Favorite;
use App\Models\Product;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/ping', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});

// 1. Check if email exists
Route::post('/auth/check-email', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'error' => 'Please provide a valid email.'], 422);
    }

    $user = User::where('email', strtolower(trim($request->email)))->first();

    return response()->json([
        'success' => true,
        'exists' => (bool)$user,
        'name' => $user ? $user->name : null,
    ]);
});

// 2. Register user
Route::post('/auth/register', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'phone' => 'nullable|string|max:20',
        'password' => 'required|string|min:6',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'error' => $validator->errors()->first(),
        ], 422);
    }

    $user = User::create([
        'name' => trim($request->name),
        'email' => strtolower(trim($request->email)),
        'phone' => $request->phone ? trim($request->phone) : null,
        'password' => Hash::make($request->password),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Account created successfully',
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
        ],
    ]);
});

// 3. Login user
Route::post('/auth/login', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'error' => 'Email and password are required.'], 422);
    }

    $user = User::where('email', strtolower(trim($request->email)))->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'success' => false,
            'error' => 'Invalid email or password.',
        ], 401);
    }

    return response()->json([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'is_admin' => (bool)$user->is_admin,
            'role' => $user->role ?? 'customer',
        ],
    ]);
});

// 3b. Admin Specific Login
Route::post('/admin/login', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'error' => 'Email and password are required.'], 422);
    }

    $user = User::where('email', strtolower(trim($request->email)))->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'success' => false,
            'error' => 'Invalid admin credentials. Please verify your email and password.',
        ], 401);
    }

    if (!$user->is_admin && $user->role !== 'admin') {
        return response()->json([
            'success' => false,
            'error' => 'Access Denied: This account does not have administrator privileges.',
        ], 403);
    }

    return response()->json([
        'success' => true,
        'message' => 'Admin authenticated successfully',
        'admin' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => 'admin',
            'is_admin' => true,
        ],
    ]);
});

// 4. Get favorites for a user
Route::get('/favorites', function (Request $request) {
    $userId = $request->query('user_id');

    if (!$userId) {
        return response()->json(['success' => false, 'error' => 'user_id is required.'], 400);
    }

    $favorites = Favorite::where('user_id', $userId)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json([
        'success' => true,
        'favorites' => $favorites,
    ]);
});

// 5. Toggle favorite (add if not exists, remove if exists)
Route::post('/favorites/toggle', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'user_id' => 'required|exists:users,id',
        'product' => 'required|array',
        'product.id' => 'required|integer',
        'product.name' => 'required|string',
        'product.price' => 'required|numeric',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'error' => $validator->errors()->first(),
        ], 422);
    }

    $userId = $request->user_id;
    $p = $request->product;
    $productId = $p['id'];

    $existing = Favorite::where('user_id', $userId)
        ->where('product_id', $productId)
        ->first();

    if ($existing) {
        $existing->delete();
        return response()->json([
            'success' => true,
            'status' => 'removed',
            'is_favorite' => false,
            'product_id' => $productId,
            'message' => 'Removed from favorites',
        ]);
    } else {
        $favorite = Favorite::create([
            'user_id' => $userId,
            'product_id' => $productId,
            'name' => $p['name'],
            'brand' => $p['brand'] ?? 'LUXORIA',
            'price' => $p['price'],
            'original_price' => $p['originalPrice'] ?? $p['original_price'] ?? null,
            'image' => $p['image'] ?? '',
            'category' => $p['category'] ?? null,
            'badge' => $p['badge'] ?? null,
            'rating' => $p['rating'] ?? 4.5,
            'reviews' => $p['reviews'] ?? 0,
            'colors' => $p['colors'] ?? [],
        ]);

        return response()->json([
            'success' => true,
            'status' => 'added',
            'is_favorite' => true,
            'product_id' => $productId,
            'favorite' => $favorite,
            'message' => 'Saved to favorites in database',
        ]);
    }
});

// 6. Delete single favorite by product_id
Route::delete('/favorites/{productId}', function (Request $request, $productId) {
    $userId = $request->query('user_id') ?? $request->input('user_id');

    if (!$userId) {
        return response()->json(['success' => false, 'error' => 'user_id is required.'], 400);
    }

    Favorite::where('user_id', $userId)
        ->where('product_id', $productId)
        ->delete();

    return response()->json([
        'success' => true,
        'message' => 'Favorite removed',
        'product_id' => (int)$productId,
    ]);
});

// 7. Sync local favorites to user's DB favorites
Route::post('/favorites/sync', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'user_id' => 'required|exists:users,id',
        'items' => 'required|array',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'error' => $validator->errors()->first()], 422);
    }

    $userId = $request->user_id;
    foreach ($request->items as $p) {
        if (!isset($p['id']) || !isset($p['name']) || !isset($p['price'])) continue;

        Favorite::firstOrCreate(
            ['user_id' => $userId, 'product_id' => $p['id']],
            [
                'name' => $p['name'],
                'brand' => $p['brand'] ?? 'LUXORIA',
                'price' => $p['price'],
                'original_price' => $p['originalPrice'] ?? $p['original_price'] ?? null,
                'image' => $p['image'] ?? '',
                'category' => $p['category'] ?? null,
                'badge' => $p['badge'] ?? null,
                'rating' => $p['rating'] ?? 4.5,
                'reviews' => $p['reviews'] ?? 0,
                'colors' => $p['colors'] ?? [],
            ]
        );
    }

    $allFavorites = Favorite::where('user_id', $userId)->get();

    return response()->json([
        'success' => true,
        'favorites' => $allFavorites,
    ]);
});

/*
|--------------------------------------------------------------------------
| Products & Image Upload (Admin Panel & Dynamic Store)
|--------------------------------------------------------------------------
*/

// Standalone Image Upload
Route::post('/upload-image', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'image' => 'required|file|mimes:jpeg,png,jpg,webp,svg,gif|max:8192',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'error' => $validator->errors()->first()], 422);
    }

    $file = $request->file('image');
    $filename = 'watch_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

    // Save to Laravel public/uploads
    $publicUploads = public_path('uploads');
    if (!file_exists($publicUploads)) {
        @mkdir($publicUploads, 0777, true);
    }
    $file->move($publicUploads, $filename);

    // Also mirror to watch-store/public/uploads so Vite dev server can serve immediately
    $watchStoreUploads = base_path('watch-store/public/uploads');
    if (!file_exists($watchStoreUploads)) {
        @mkdir($watchStoreUploads, 0777, true);
    }
    @copy($publicUploads . DIRECTORY_SEPARATOR . $filename, $watchStoreUploads . DIRECTORY_SEPARATOR . $filename);

    return response()->json([
        'success' => true,
        'url' => '/uploads/' . $filename,
        'filename' => $filename,
        'message' => 'Image uploaded successfully',
    ]);
});

// List all products (with optional category & search filter)
Route::get('/products', function (Request $request) {
    $query = Product::query();

    if ($request->filled('category') && $request->category !== 'All') {
        $query->where('category', $request->category);
    }

    if ($request->filled('search')) {
        $s = trim($request->search);
        $query->where(function ($q) use ($s) {
            $q->where('name', 'like', "%{$s}%")
              ->orWhere('brand', 'like', "%{$s}%")
              ->orWhere('category', 'like', "%{$s}%")
              ->orWhere('description', 'like', "%{$s}%");
        });
    }

    $products = $query->orderBy('id', 'desc')->get();

    return response()->json([
        'success' => true,
        'products' => $products,
        'count' => $products->count(),
    ]);
});

// Get single product
Route::get('/products/{id}', function ($id) {
    $product = Product::find($id);
    if (!$product) {
        return response()->json(['success' => false, 'error' => 'Product not found'], 404);
    }
    return response()->json(['success' => true, 'product' => $product]);
});

// Create product (accepts JSON or multipart/form-data with image upload)
Route::post('/products', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'category' => 'required|string|max:100',
        'price' => 'required|numeric|min:0',
        'original_price' => 'nullable|numeric|min:0',
        'discount' => 'nullable|integer|min:0|max:100',
        'image' => 'nullable',
        'image_file' => 'nullable|file|mimes:jpeg,png,jpg,webp,svg,gif|max:8192',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'error' => $validator->errors()->first()], 422);
    }

    $imageUrl = $request->input('image', '/images/watch_womens_gold.jpg');

    // Handle file upload if present
    if ($request->hasFile('image_file')) {
        $file = $request->file('image_file');
        $filename = 'watch_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $publicUploads = public_path('uploads');
        if (!file_exists($publicUploads)) @mkdir($publicUploads, 0777, true);
        $file->move($publicUploads, $filename);

        $watchStoreUploads = base_path('watch-store/public/uploads');
        if (!file_exists($watchStoreUploads)) @mkdir($watchStoreUploads, 0777, true);
        @copy($publicUploads . DIRECTORY_SEPARATOR . $filename, $watchStoreUploads . DIRECTORY_SEPARATOR . $filename);

        $imageUrl = '/uploads/' . $filename;
    }

    $colors = $request->input('colors');
    if (is_string($colors)) {
        $decoded = json_decode($colors, true);
        $colors = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $colors)));
    }

    $features = $request->input('features');
    if (is_string($features)) {
        $decoded = json_decode($features, true);
        $features = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $features)));
    }

    $product = Product::create([
        'name' => trim($request->name),
        'brand' => $request->input('brand', 'Radhe'),
        'category' => $request->category,
        'type' => $request->input('type', 'Classic'),
        'price' => (float)$request->price,
        'original_price' => $request->filled('original_price') ? (float)$request->original_price : null,
        'discount' => $request->filled('discount') ? (int)$request->discount : 0,
        'rating' => $request->filled('rating') ? (float)$request->rating : 4.8,
        'reviews' => $request->filled('reviews') ? (int)$request->reviews : 0,
        'image' => $imageUrl,
        'badge' => $request->input('badge', 'New'),
        'colors' => $colors ?? ['#C9A84C', '#1A1A1A'],
        'description' => $request->input('description', ''),
        'features' => $features ?? ['Swiss Movement', 'Sapphire Glass', 'Water Resistant'],
        'strap' => $request->input('strap', 'Stainless Steel'),
        'case_diameter' => $request->input('case_diameter', '40mm'),
        'movement' => $request->input('movement', 'Swiss Quartz'),
        'in_stock' => $request->boolean('in_stock', true),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Product created successfully',
        'product' => $product,
    ], 201);
});

// Update product
Route::post('/products/{id}', function (Request $request, $id) {
    $product = Product::find($id);
    if (!$product) {
        return response()->json(['success' => false, 'error' => 'Product not found'], 404);
    }

    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|required|string|max:255',
        'category' => 'sometimes|required|string|max:100',
        'price' => 'sometimes|required|numeric|min:0',
        'original_price' => 'nullable|numeric|min:0',
        'discount' => 'nullable|integer|min:0|max:100',
        'image_file' => 'nullable|file|mimes:jpeg,png,jpg,webp,svg,gif|max:8192',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'error' => $validator->errors()->first()], 422);
    }

    $data = $request->except(['image_file']);

    // Handle file upload if present
    if ($request->hasFile('image_file')) {
        $file = $request->file('image_file');
        $filename = 'watch_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $publicUploads = public_path('uploads');
        if (!file_exists($publicUploads)) @mkdir($publicUploads, 0777, true);
        $file->move($publicUploads, $filename);

        $watchStoreUploads = base_path('watch-store/public/uploads');
        if (!file_exists($watchStoreUploads)) @mkdir($watchStoreUploads, 0777, true);
        @copy($publicUploads . DIRECTORY_SEPARATOR . $filename, $watchStoreUploads . DIRECTORY_SEPARATOR . $filename);

        $data['image'] = '/uploads/' . $filename;
    }

    if (isset($data['colors']) && is_string($data['colors'])) {
        $decoded = json_decode($data['colors'], true);
        $data['colors'] = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $data['colors'])));
    }

    if (isset($data['features']) && is_string($data['features'])) {
        $decoded = json_decode($data['features'], true);
        $data['features'] = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $data['features'])));
    }

    if (isset($data['in_stock'])) {
        $data['in_stock'] = filter_var($data['in_stock'], FILTER_VALIDATE_BOOLEAN);
    }

    $product->update($data);

    return response()->json([
        'success' => true,
        'message' => 'Product updated successfully',
        'product' => $product->fresh(),
    ]);
});

// Delete product
Route::delete('/products/{id}', function ($id) {
    $product = Product::find($id);
    if (!$product) {
        return response()->json(['success' => false, 'error' => 'Product not found'], 404);
    }

    $product->delete();

    return response()->json([
        'success' => true,
        'message' => 'Product deleted successfully',
        'id' => (int)$id,
    ]);
});

