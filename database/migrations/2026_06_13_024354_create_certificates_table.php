<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('template_id')->constrained()->restrictOnDelete();
            $table->string('nomor_sertifikat', 100)->unique();
            $table->string('qr_code_path', 500)->nullable();
            $table->string('pdf_path', 500)->nullable();
            $table->enum('status', ['valid', 'dicabut'])->default('valid');
            $table->date('tanggal_terbit');
            $table->timestamp('dikirim_at')->nullable();
            $table->timestamps();

            $table->index('nomor_sertifikat');
            $table->index('participant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
