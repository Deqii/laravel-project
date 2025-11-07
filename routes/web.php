<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//  Public Routes
Route::get('/', [ProductController::class, 'welcome'])->name('home');

//  Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Product Management (CRUD)
    Route::resource('products', ProductController::class);

    // Cart Routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Cart Count
    Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

    // Checkout Routes
    Route::get('/checkout', function () {
        $cartItems = \App\Models\Cart::with('product')
            ->where('user_id', auth()->id())
            ->get();

        $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'total' => $total,
        ]);
    })->name('checkout.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
