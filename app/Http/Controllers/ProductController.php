<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(){
    $products = Product::select('id', 'name', 'price', 'description', 'image')
        ->get()
        ->map(function ($product) {
            $product->image_url = $product->image 
                ? asset("storage/{$product->image}") 
                : asset('images/no-image.png');
            return $product;
        });

    return inertia('Products/Index', compact('products'));
    }


    public function create() {
        return Inertia::render('Products/Create', );
    }

    public function store(Request $request){
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $validated['image'] = $request->file('image')->store('products', 'public');
    }

    Product::create($validated);

    return redirect()->route('products.index')->with('message', 'Product created successfully.');
    }


    public function edit(Product $product) {
        return Inertia::render('Products/Edit', compact('product'));
    }

    public function update(Request $request, Product $product){
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('image')) {
        // Hapus gambar lama jika ada
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        // Simpan gambar baru
        $validated['image'] = $request->file('image')->store('products', 'public');
    }

    $product->update($validated);

    return redirect()->route('products.index')->with('message', 'Product updated successfully.');
    }

    

    public function destroy(Product $product) {
        $product->delete();
        return redirect()->route('products.index')->with('message','Product deleted successfully.');
    }

    public function welcome(Request $request){
    $search = $request->input('search');

    $products = Product::when($search, function ($query, $search) {
        $query->where('name', 'like', '%' . $search . '%');
    })
    ->get()
    ->map(function ($product) {
        $product->image_url = $product->image
            ? asset('storage/' . $product->image)
            : asset('images/no-image.png');
        return $product;
    });

    return inertia('welcome', [
        'products' => $products,
        'filters' => [
            'search' => $search
        ],
    ]);
    }


    // public function welcome(){
    // $products = Product::all()->map(function ($product) {
    //     $product->image_url = $product->image
    //         ? asset('storage/' . $product->image)
    //         : asset('images/no-image.png');
    //     return $product;
    // });

    // return inertia('welcome', [
    //     'products' => $products
    // ]);
    // }

}
