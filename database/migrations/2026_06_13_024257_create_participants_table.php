<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->string('nama');
            $table->string('email');
            $table->enum('posisi', ['peserta', 'pemateri', 'moderator', 'panitia', 'juri'])->default('peserta');
            $table->string('penghargaan')->nullable();
            $table->timestamps();

            $table->index(['event_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
