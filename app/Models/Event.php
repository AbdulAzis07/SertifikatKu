<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'user_id', 'nama', 'penyelenggara', 'lokasi',
        'tanggal_mulai', 'tanggal_selesai', 'deskripsi',
        'kategori', 'status',
    ];

    protected $casts = [
        'tanggal_mulai'    => 'date',
        'tanggal_selesai'  => 'date',
    ];

    // ── Auto-compute status based on dates ──────────────────
    protected static function booted(): void
    {
        static::saving(function (Event $event) {
            $today = Carbon::today();
            if ($event->tanggal_mulai->gt($today)) {
                $event->status = 'upcoming';
            } elseif ($event->tanggal_selesai && $event->tanggal_selesai->lt($today)) {
                $event->status = 'completed';
            } else {
                $event->status = 'ongoing';
            }
        });
    }

    // ── Relationships ────────────────────────────────────────
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function templates(): HasMany
    {
        return $this->hasMany(Template::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }

    // ── Kode singkat event untuk nomor sertifikat ───────────
    public function getKodeAttribute(): string
    {
        return strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $this->nama), 0, 4));
    }
}
