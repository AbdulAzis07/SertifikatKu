<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    protected $fillable = [
        'user_id', 'event_id', 'nama', 'orientasi',
        'background_path', 'deskripsi_format',
    ];

    // ── Relationships ────────────────────────────────────────
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function signers(): HasMany
    {
        return $this->hasMany(Signer::class)->orderBy('urutan');
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    // ── Accessor for background URL ──────────────────────────
    public function getBackgroundUrlAttribute(): ?string
    {
        return $this->background_path
            ? asset('storage/' . $this->background_path)
            : null;
    }
}
