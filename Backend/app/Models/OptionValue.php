<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OptionValue extends Model
{
    protected $fillable = [
        'option_id',
        'name',
    ];

    public function option(): BelongsTo
    {
        return $this->belongsTo(Option::class);
    }
}