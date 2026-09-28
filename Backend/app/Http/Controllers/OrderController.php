<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display all orders.
     */
    public function index()
    {
        $orders = Order::with([
            'items.product',
            'items.productVariant',
            'cart',
        ])
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }

    /**
     * Display a specific order.
     */
    public function show(Order $order)
    {
        $order->load([
            'items.product',
            'items.productVariant',
            'cart',
        ]);

        return response()->json([
            'order' => $order,
        ]);
    }

    /**
     * Update the order status.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:pending_confirmation,confirmed,shipped,delivered,cancelled,returned',
            ],
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        $order->load([
            'items.product',
            'items.productVariant',
            'cart',
        ]);

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order,
        ]);
    }

    /**
     * Delete an order.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
        ]);
    }
}