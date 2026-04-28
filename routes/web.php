<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Home → Redirect to login or dashboard ─────────────────
Route::get('/', function () {
    return redirect()->route('login');
});

// ── Authenticated Routes ──────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    // Events
    Route::get('/events', fn() => Inertia::render('Events/Index'))->name('events.index');
    Route::get('/events/create', fn() => Inertia::render('Events/Create'))->name('events.create');

    // Templates
    Route::get('/templates', fn() => Inertia::render('Templates/Index'))->name('templates.index');
    Route::get('/templates/create', fn() => Inertia::render('Templates/Create'))->name('templates.create');

    // Participants
    Route::get('/participants', fn() => Inertia::render('Participants/Index'))->name('participants.index');
    Route::get('/participants/import', fn() => Inertia::render('Participants/Import'))->name('participants.import');

    // Certificates
    Route::get('/certificates', fn() => Inertia::render('Certificates/Index'))->name('certificates.index');
    Route::get('/certificates/generate', fn() => Inertia::render('Certificates/Generate'))->name('certificates.generate');
    Route::get('/certificates/preview', fn() => Inertia::render('Certificates/Preview'))->name('certificates.preview');
});

// ── Public Routes ─────────────────────────────────────────
Route::get('/verify', fn() => Inertia::render('Verification/Show'))->name('verification.show');

// ── Profile (Breeze) ──────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
