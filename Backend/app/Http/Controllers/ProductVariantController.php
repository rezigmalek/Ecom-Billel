<?php

namespace App\Http\Controllers;

use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function index()
    {
        $variants = ProductVariant::with([
            'product',
            'optionValue1.option',
            'optionValue2.option',
        ])->get();

        return response()->json([
            'variants' => $variants,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],

            'option_value_1_id' => [
                'nullable',
                'exists:option_values,id',
            ],

            'option_value_2_id' => [
                'nullable',
                'exists:option_values,id',
                'different:option_value_1_id',
            ],

            'quantity' => ['required', 'integer', 'min:0'],

            'price' => ['required', 'numeric', 'min:0'],
        ]);

        $variant = ProductVariant::create($validated);

        return response()->json([
            'message' => 'Product variant created successfully',
            'variant' => $variant->load([
                'product',
                'optionValue1.option',
                'optionValue2.option',
            ]),
        ], 201);
    }

    public function show(ProductVariant $productVariant)
    {
        $productVariant->load([
            'product',
            'optionValue1.option',
            'optionValue2.option',
        ]);

        return response()->json([
            'variant' => $productVariant,
        ]);
    }

    public function update(
        Request $request,
        ProductVariant $productVariant
    ) {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],

            'option_value_1_id' => [
                'nullable',
                'exists:option_values,id',
            ],

            'option_value_2_id' => [
                'nullable',
                'exists:option_values,id',
                'different:option_value_1_id',
            ],

            'quantity' => ['required', 'integer', 'min:0'],

            'price' => ['required', 'numeric', 'min:0'],
        ]);

        $productVariant->update($validated);

        return response()->json([
            'message' => 'Product variant updated successfully',
            'variant' => $productVariant->load([
                'product',
                'optionValue1.option',
                'optionValue2.option',
            ]),
        ]);
    }

    public function destroy(ProductVariant $productVariant)
    {
        $productVariant->delete();

        return response()->json([
            'message' => 'Product variant deleted successfully',
        ]);
    }
}