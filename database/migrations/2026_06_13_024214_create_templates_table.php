<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('event_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nama');
            $table->enum('orientasi', ['landscape', 'portrait'])->default('landscape');
            $table->string('background_path', 500)->nullable();
            $table->text('deskripsi_format')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
