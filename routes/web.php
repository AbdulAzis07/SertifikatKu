<?php

use App\Http\Controllers\CertificateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\VerifyController;
use Illuminate\Support\Facades\Route;

// ── Home → Redirect ke login ──────────────────────────────
Route::get('/', fn() => redirect()->route('login'));

// ── Authenticated Routes ──────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Events
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');

    // Templates
    Route::get('/templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::get('/templates/create', [TemplateController::class, 'create'])->name('templates.create');
    Route::post('/templates', [TemplateController::class, 'store'])->name('templates.store');
    Route::put('/templates/{template}', [TemplateController::class, 'update'])->name('templates.update');
    Route::delete('/templates/{template}', [TemplateController::class, 'destroy'])->name('templates.destroy');

    // Participants — import harus sebelum {participant} agar tidak konflik
    Route::get('/participants/import', [ParticipantController::class, 'importPage'])->name('participants.import');
    Route::post('/participants/import', [ParticipantController::class, 'import'])->name('participants.import.store');
    Route::get('/participants/import/template', [ParticipantController::class, 'downloadTemplate'])->name('participants.template');
    Route::get('/participants', [ParticipantController::class, 'index'])->name('participants.index');
    Route::post('/participants', [ParticipantController::class, 'store'])->name('participants.store');
    Route::put('/participants/{participant}', [ParticipantController::class, 'update'])->name('participants.update');
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy'])->name('participants.destroy');

    // Certificates — static routes sebelum {certificate}
    Route::get('/certificates/generate', [CertificateController::class, 'generatePage'])->name('certificates.generate');
    Route::post('/certificates/generate', [CertificateController::class, 'generate'])->name('certificates.generate.store');
    Route::get('/certificates/preview', [CertificateController::class, 'previewPage'])->name('certificates.preview');
    Route::post('/certificates/send-email', [CertificateController::class, 'sendEmail'])->name('certificates.send-email');
    Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates.index');
    Route::get('/certificates/{certificate}', [CertificateController::class, 'show'])->name('certificates.show');
    Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download'])->name('certificates.download');
    Route::post('/certificates/{certificate}/revoke', [CertificateController::class, 'revoke'])->name('certificates.revoke');

    // Profile (Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ── Public Routes ─────────────────────────────────────────
Route::get('/verify', [VerifyController::class, 'index'])->name('verify.index');
Route::get('/verify/{code}', [VerifyController::class, 'check'])
    ->middleware('throttle:60,1')
    ->name('verify.check');

require __DIR__.'/auth.php';
