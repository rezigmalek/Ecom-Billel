<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->text('description')->nullable();

            $table->string('main_image')->nullable();

            $table->unsignedInteger('quantity')->default(0);

            $table->decimal('price', 10, 2);
            $table->decimal('old_price', 10, 2)->nullable();

            // A product can have 0, 1 or 2 options
            $table->foreignId('option_1_id')
                ->nullable()
                ->constrained('options')
                ->nullOnDelete();

            $table->foreignId('option_2_id')
                ->nullable()
                ->constrained('options')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};