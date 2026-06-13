<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Participant extends Model
{
    protected $fillable = [
        'event_id', 'nama', 'email', 'posisi', 'penghargaan',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }
}
