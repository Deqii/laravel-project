<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Cart::with('product')
            ->where('user_id', auth()->id())
            ->get();

        $total = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $product = Product::findOrFail($request->product_id);

        $cartItem = Cart::firstOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $product->id,
            ],
            ['quantity' => 0]
        );

        $cartItem->increment('quantity');

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang.');
    }

    public function destroy($id)
    {
        $cartItem = Cart::where('user_id', auth()->id())
            ->where('id', $id)
            ->first();

        if ($cartItem) {
            $cartItem->delete();
            return back()->with('success', 'Produk dihapus dari keranjang.');
        }

        return back()->with('error', 'Item tidak ditemukan.');
    }

   
    public function count()
    {
        $count = Cart::where('user_id', auth()->id())->sum('quantity');

        return response()->json(['count' => $count]);
    }
}
