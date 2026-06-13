<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('signers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->cascadeOnDelete();
            $table->string('nama');
            $table->string('jabatan');
            $table->string('signature_path', 500)->nullable();
            $table->tinyInteger('urutan')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('signers');
    }
};
