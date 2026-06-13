<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Signer extends Model
{
    protected $fillable = [
        'template_id', 'nama', 'jabatan',
        'signature_path', 'urutan',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function getSignatureUrlAttribute(): ?string
    {
        return $this->signature_path
            ? asset('storage/' . $this->signature_path)
            : null;
    }
}
