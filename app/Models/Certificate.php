<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    protected $fillable = [
        'participant_id', 'template_id', 'nomor_sertifikat',
        'qr_code_path', 'pdf_path', 'status',
        'tanggal_terbit', 'dikirim_at',
    ];

    protected $casts = [
        'tanggal_terbit' => 'date',
        'dikirim_at'     => 'datetime',
    ];

    // ── Relationships ────────────────────────────────────────
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    // ── Scope: certificates per month for chart ──────────────
    public static function perMonth(): array
    {
        $results = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $results[] = [
                'month' => $month->format('M'),
                'certificates' => static::whereYear('tanggal_terbit', $month->year)
                    ->whereMonth('tanggal_terbit', $month->month)
                    ->count(),
            ];
        }
        return $results;
    }

    // ── Accessors ────────────────────────────────────────────
    public function getPdfUrlAttribute(): ?string
    {
        return $this->pdf_path ? asset('storage/' . $this->pdf_path) : null;
    }

    public function getQrUrlAttribute(): ?string
    {
        return $this->qr_code_path ? asset('storage/' . $this->qr_code_path) : null;
    }
}
