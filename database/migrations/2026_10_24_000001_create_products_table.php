<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand')->default('Radhe');
            $table->string('category')->default('Women');
            $table->string('type')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->unsignedInteger('discount')->default(0);
            $table->decimal('rating', 3, 1)->default(4.8);
            $table->unsignedInteger('reviews')->default(0);
            $table->string('image')->nullable();
            $table->string('badge')->nullable();
            $table->json('colors')->nullable();
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->string('strap')->nullable();
            $table->string('case_diameter')->nullable();
            $table->string('movement')->nullable();
            $table->boolean('in_stock')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
