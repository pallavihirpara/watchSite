<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'category',
        'type',
        'price',
        'original_price',
        'discount',
        'rating',
        'reviews',
        'image',
        'badge',
        'colors',
        'description',
        'features',
        'strap',
        'case_diameter',
        'movement',
        'in_stock',
    ];

    protected $casts = [
        'price' => 'float',
        'original_price' => 'float',
        'discount' => 'integer',
        'rating' => 'float',
        'reviews' => 'integer',
        'colors' => 'array',
        'features' => 'array',
        'in_stock' => 'boolean',
    ];
}
