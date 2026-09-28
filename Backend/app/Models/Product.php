<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'title',
        'description',
        'main_image',
        'price',
        'old_price',
        'quantity',
        'option_1_id',
        'option_2_id',
    ];

    public function option1(): BelongsTo
    {
        return $this->belongsTo(Option::class, 'option_1_id');
    }

    public function option2(): BelongsTo
    {
        return $this->belongsTo(Option::class, 'option_2_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
}