<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cart_id')
                ->constrained('carts')
                ->restrictOnDelete();

            $table->string('full_name');

            $table->enum('delivery_type', [
                'stop_desk',
                'home_delivery',
            ]);

            $table->string('wilaya');
            $table->string('address')->nullable();
            $table->string('phone');

            $table->enum('status', [
                'pending_confirmation',
                'confirmed',
                'shipped',
                'delivered',
                'cancelled',
                'returned',
            ])->default('pending_confirmation');

            $table->decimal('total_products', 10, 2)->default(0);
            $table->decimal('shipping_price', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};