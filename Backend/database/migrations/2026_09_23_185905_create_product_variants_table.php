<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();

            $table->foreignId('option_value_1_id')
                ->nullable()
                ->constrained('option_values')
                ->nullOnDelete();

            $table->foreignId('option_value_2_id')
                ->nullable()
                ->constrained('option_values')
                ->nullOnDelete();

            $table->unsignedInteger('quantity')->default(1);

            $table->decimal('price', 10, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};