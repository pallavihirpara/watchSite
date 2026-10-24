<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'name',
        'brand',
        'price',
        'original_price',
        'image',
        'category',
        'badge',
        'rating',
        'reviews',
        'colors',
    ];

    protected $casts = [
        'colors' => 'array',
        'price' => 'float',
        'original_price' => 'float',
        'rating' => 'float',
        'reviews' => 'integer',
        'product_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
