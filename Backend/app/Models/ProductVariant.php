<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'option_value_1_id',
        'option_value_2_id',
        'quantity',
        'price',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function optionValue1(): BelongsTo
    {
        return $this->belongsTo(
            OptionValue::class,
            'option_value_1_id'
        );
    }

    public function optionValue2(): BelongsTo
    {
        return $this->belongsTo(
            OptionValue::class,
            'option_value_2_id'
        );
    }
}