<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cookie;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $token = $request->cookie('cart_token');

        $cart = null;

        if ($token) {
            $cart = Cart::where('cart_token', $token)
                ->where('status', 'active')
                ->with([
                    'items.product',
                    'items.productVariant',
                ])
                ->first();
        }

        if (!$cart) {
            $cart = Cart::create([
                'cart_token' => Str::uuid()->toString(),
                'status' => 'active',
                'total_price' => 0,
            ]);
        }

        return response()
            ->json([
                'message' => 'Cart retrieved successfully',
                'cart' => $cart,
            ])
            ->cookie(
                'cart_token',
                $cart->cart_token,
                60 * 24 * 30
            );
    }


    public function addItem(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'product_variant_id' => [
                'nullable',
                'exists:product_variants,id',
            ],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $token = $request->cookie('cart_token');

        $cart = Cart::where('cart_token', $token)
            ->where('status', 'active')
            ->first();

        if (!$cart) {
            $cart = Cart::create([
                'cart_token' => Str::uuid()->toString(),
                'status' => 'active',
                'total_price' => 0,
            ]);
        }

        $product = Product::findOrFail($validated['product_id']);

        $variant = null;

        if (!empty($validated['product_variant_id'])) {
            $variant = ProductVariant::where('id', $validated['product_variant_id'])
                ->where('product_id', $product->id)
                ->first();

            if (!$variant) {
                return response()->json([
                    'message' => 'The selected variant does not belong to this product.',
                ], 422);
            }
        }

        // Determine the current price and available stock.
        $unitPrice = $variant
            ? $variant->price
            : $product->price;

        $availableQuantity = $variant
            ? $variant->quantity
            : $product->quantity;

        // Find the existing cart item for this product/variant.
        $cartItem = $cart->items()
            ->where('product_id', $product->id)
            ->where('product_variant_id', $variant?->id)
            ->first();

        // Calculate the final quantity after adding the requested quantity.
        $currentQuantity = $cartItem?->quantity ?? 0;

        $newQuantity = $currentQuantity + $validated['quantity'];

        // Check stock before modifying the cart.
        if ($newQuantity > $availableQuantity) {
            return response()->json([
                'message' => 'Insufficient stock.',
                'available_quantity' => $availableQuantity,
                'requested_quantity' => $newQuantity,
            ], 422);
        }

        // Create or update the cart item.
        if ($cartItem) {
            $cartItem->update([
                'quantity' => $newQuantity,
                'unit_price' => $unitPrice,
            ]);
        } else {
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => $validated['quantity'],
                'unit_price' => $unitPrice,
            ]);
        }

        // Recalculate cart total.
        $cart->update([
            'total_price' => $cart->items()
                ->sum(DB::raw('quantity * unit_price')),
        ]);

        $cart->load([
            'items.product',
            'items.productVariant',
        ]);

        return response()
            ->json([
                'message' => 'Product added to cart successfully',
                'cart' => $cart,
            ])
            ->cookie(
                'cart_token',
                $cart->cart_token,
                60 * 24 * 30
            );
    }



    public function updateItem(Request $request, int $cartItemId)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $token = $request->cookie('cart_token');

        $cart = Cart::where('cart_token', $token)
            ->where('status', 'active')
            ->first();

        if (!$cart) {
            return response()->json([
                'message' => 'Active cart not found.',
            ], 404);
        }

        $cartItem = $cart->items()
            ->where('id', $cartItemId)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'message' => 'Cart item not found.',
            ], 404);
        }

        $cartItem->update([
            'quantity' => $validated['quantity'],
        ]);

        $cart->update([
            'total_price' => $cart->items()
                ->sum(DB::raw('quantity * unit_price')),
        ]);

        $cart->load([
            'items.product',
            'items.productVariant',
        ]);

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart' => $cart,
        ]);
    }

    public function removeItem(Request $request, int $cartItemId)
    {
        $token = $request->cookie('cart_token');

        $cart = Cart::where('cart_token', $token)
            ->where('status', 'active')
            ->first();

        if (!$cart) {
            return response()->json([
                'message' => 'Active cart not found.',
            ], 404);
        }

        $cartItem = $cart->items()
            ->where('id', $cartItemId)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'message' => 'Cart item not found.',
            ], 404);
        }

        $cartItem->delete();

        $cart->update([
            'total_price' => $cart->items()
                ->sum(DB::raw('quantity * unit_price')),
        ]);

        $cart->load([
            'items.product',
            'items.productVariant',
        ]);

        return response()->json([
            'message' => 'Cart item removed successfully',
            'cart' => $cart,
        ]);
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'delivery_type' => ['required', 'in:stop_desk,home_delivery'],
            'wilaya' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
        ]);

        $token = $request->cookie('cart_token');

        $cart = Cart::where('cart_token', $token)
            ->where('status', 'active')
            ->with([
                'items.product',
                'items.productVariant',
            ])
            ->first();

        if (!$cart) {
            return response()->json([
                'message' => 'Active cart not found.',
            ], 404);
        }

        if ($cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Cannot checkout an empty cart.',
            ], 422);
        }


        return DB::transaction(function () use (
            $cart,
            $validated
        ) {
            /*
    |--------------------------------------------------------------------------
    | Check stock without lock actually products/variants
    |--------------------------------------------------------------------------
    */

            foreach ($cart->items as $cartItem) {

                if ($cartItem->product_variant_id) {

                    $variant = ProductVariant::find(
                        $cartItem->product_variant_id
                    );

                    if (!$variant) {
                        return response()->json([
                            'message' => 'Product variant not found.',
                        ], 404);
                    }

                    if ($cartItem->quantity > $variant->quantity) {
                        return response()->json([
                            'message' => 'Insufficient stock.',
                            'product_id' => $cartItem->product_id,
                            'product_variant_id' => $variant->id,
                            'requested_quantity' => $cartItem->quantity,
                            'available_quantity' => $variant->quantity,
                        ], 422);
                    }
                } else {

                    $product = Product::find(
                        $cartItem->product_id
                    );

                    if (!$product) {
                        return response()->json([
                            'message' => 'Product not found.',
                        ], 404);
                    }

                    if ($cartItem->quantity > $product->quantity) {
                        return response()->json([
                            'message' => 'Insufficient stock.',
                            'product_id' => $product->id,
                            'requested_quantity' => $cartItem->quantity,
                            'available_quantity' => $product->quantity,
                        ], 422);
                    }
                }
            }

            /*
    |--------------------------------------------------------------------------
    | Calculate totals
    |--------------------------------------------------------------------------
    */

            $totalProducts = $cart->items->sum(function ($item) {
                return $item->quantity * $item->unit_price;
            });

            $shippingPrice = 0;

            $totalPrice = $totalProducts + $shippingPrice;

            /*
    |--------------------------------------------------------------------------
    | Create order
    |--------------------------------------------------------------------------
    */

            $order = Order::create([
                'cart_id' => $cart->id,
                'full_name' => $validated['full_name'],
                'delivery_type' => $validated['delivery_type'],
                'wilaya' => $validated['wilaya'],
                'address' => $validated['address'] ?? null,
                'phone' => $validated['phone'],
                'status' => 'pending_confirmation',
                'total_products' => $totalProducts,
                'shipping_price' => $shippingPrice,
                'total_price' => $totalPrice,
            ]);

            /*
    |--------------------------------------------------------------------------
    | Create order items
    |--------------------------------------------------------------------------
    */

            foreach ($cart->items as $cartItem) {

                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'product_variant_id' => $cartItem->product_variant_id,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                ]);
            }

            /*
    |--------------------------------------------------------------------------
    | Decrease stock
    |--------------------------------------------------------------------------
    */

            foreach ($cart->items as $cartItem) {

                if ($cartItem->product_variant_id) {

                    $variant = ProductVariant::find(
                        $cartItem->product_variant_id
                    );

                    $variant->decrement(
                        'quantity',
                        $cartItem->quantity
                    );
                } else {

                    $product = Product::find(
                        $cartItem->product_id
                    );

                    $product->decrement(
                        'quantity',
                        $cartItem->quantity
                    );
                }
            }

            /*
    |--------------------------------------------------------------------------
    | Mark old cart as ordered
    |--------------------------------------------------------------------------
    */

            $cart->update([
                'status' => 'ordered',
            ]);

            /*
    |--------------------------------------------------------------------------
    | Create new active cart
    |--------------------------------------------------------------------------
    */

            $newCart = Cart::create([
                'cart_token' => Str::uuid()->toString(),
                'status' => 'active',
                'total_price' => 0,
            ]);

            /*
    |--------------------------------------------------------------------------
    | Return order and new cart
    |--------------------------------------------------------------------------
    */

            return response()
                ->json([
                    'message' => 'Order created successfully',

                    'order' => $order->load([
                        'items.product',
                        'items.productVariant',
                    ]),

                    'cart' => $newCart,
                ])
                ->cookie(
                    'cart_token',
                    $newCart->cart_token,
                    60 * 24 * 30
                );
        });
    }
}
