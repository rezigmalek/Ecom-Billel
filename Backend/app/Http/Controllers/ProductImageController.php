<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function index()
    {
        $images = ProductImage::with('product')->get();

        return response()->json([
            'images' => $images,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $path = $request->file('image')->store('products', 'public');

        $image = ProductImage::create([
            'product_id' => $validated['product_id'],
            'image_url' => $path,
        ]);

        return response()->json([
            'message' => 'Product image created successfully',
            'image' => $image,
        ], 201);
    }

    public function show(ProductImage $productImage)
    {
        return response()->json([
            'image' => $productImage,
        ]);
    }

    public function update(Request $request, ProductImage $productImage)
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        // Supprimer l'ancienne image
        if ($productImage->image_url) {
            Storage::disk('public')->delete($productImage->image_url);
        }

        // Stocker la nouvelle image
        $path = $request->file('image')->store('products', 'public');

        $productImage->update([
            'image_url' => $path,
        ]);

        return response()->json([
            'message' => 'Product image updated successfully',
            'image' => $productImage,
        ]);
    }

    public function destroy(ProductImage $productImage)
    {
        if ($productImage->image_url) {
            Storage::disk('public')->delete($productImage->image_url);
        }

        $productImage->delete();

        return response()->json([
            'message' => 'Product image deleted successfully',
        ]);
    }
}