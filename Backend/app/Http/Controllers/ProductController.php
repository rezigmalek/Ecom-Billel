<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with([
            'option1',
            'option2',
            'variants.optionValue1',
            'variants.optionValue2',
            'images',
        ])->get();

        return response()->json([
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'main_image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'price' => ['required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],

            'option_1_id' => [
                'nullable',
                'exists:options,id',
            ],

            'option_2_id' => [
                'nullable',
                'exists:options,id',
                'different:option_1_id',
            ],
        ]);

        $path = $request->file('main_image')->store('products', 'public');

        $product = Product::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'main_image' => $path,
            'price' => $validated['price'],
            'old_price' => $validated['old_price'] ?? null,
            'option_1_id' => $validated['option_1_id'] ?? null,
            'option_2_id' => $validated['option_2_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    public function show(Product $product)
    {
        $product->load([
            'option1',
            'option2',
            'variants.optionValue1',
            'variants.optionValue2',
            'images',
        ]);

        return response()->json([
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'main_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'price' => ['required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:0'],

            'option_1_id' => [
                'nullable',
                'exists:options,id',
            ],

            'option_2_id' => [
                'nullable',
                'exists:options,id',
                'different:option_1_id',
            ],
        ]);

        if ($request->hasFile('main_image')) {
            if ($product->main_image) {
                Storage::disk('public')->delete($product->main_image);
            }

            $validated['main_image'] = $request
                ->file('main_image')
                ->store('products', 'public');
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        if ($product->main_image) {
            Storage::disk('public')->delete($product->main_image);
        }

        // Supprimer également les images supplémentaires
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
