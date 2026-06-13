<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Certificate;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $events = Event::with('templates')
            ->withCount('participants')
            ->latest()
            ->get()
            ->map(fn($e) => [
                'id'          => $e->id,
                'title'       => $e->nama,
                'description' => $e->deskripsi,
                'event_date'  => $e->tanggal_mulai->format('Y-m-d'),
                'organizer'   => $e->penyelenggara,
                'location'    => $e->lokasi,
                'status'      => $e->status,
                'participants'=> $e->participants_count,
                'template'    => $e->templates->first()?->nama,
                'kategori'    => $e->kategori,
                'tanggal_selesai' => $e->tanggal_selesai ? $e->tanggal_selesai->format('Y-m-d') : null,
            ]);

        return Inertia::render('Events/Index', [
            'events'  => $events,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Events/Create', [
            'templates' => Template::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nama'            => 'required|string|max:255',
            'penyelenggara'   => 'required|string|max:255',
            'lokasi'          => 'nullable|string|max:255',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'deskripsi'       => 'nullable|string',
            'kategori'        => 'required|in:seminar,workshop,pelatihan,konferensi,lainnya',
        ]);

        $event = auth()->user()->events()->create($data);

        ActivityLog::log('create_event', "Membuat event baru: {$event->nama}");

        return redirect()->route('events.index')->with('success', 'Event berhasil dibuat.');
    }

    public function show(Event $event): Response
    {
        return Inertia::render('Events/Show', [
            'event'             => $event->load('participants', 'templates.signers'),
            'participant_count' => $event->participants()->count(),
            'certificate_count' => Certificate::whereHas(
                'participant', fn($q) => $q->where('event_id', $event->id)
            )->count(),
            'templates'         => $event->templates()->with('signers')->get(),
        ]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $data = $request->validate([
            'nama'            => 'required|string|max:255',
            'penyelenggara'   => 'required|string|max:255',
            'lokasi'          => 'nullable|string|max:255',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'deskripsi'       => 'nullable|string',
            'kategori'        => 'required|in:seminar,workshop,pelatihan,konferensi,lainnya',
        ]);

        $event->update($data);

        ActivityLog::log('update_event', "Memperbarui event: {$event->nama}");

        return redirect()->route('events.index')->with('success', 'Event berhasil diperbarui.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        // Cek apakah ada sertifikat aktif
        $hasActiveCerts = Certificate::whereHas(
            'participant', fn($q) => $q->where('event_id', $event->id)
        )->where('status', 'valid')->exists();

        if ($hasActiveCerts) {
            return back()->with('error', 'Event tidak dapat dihapus karena masih memiliki sertifikat aktif.');
        }

        $nama = $event->nama;
        $event->delete();

        ActivityLog::log('delete_event', "Menghapus event: {$nama}");

        return redirect()->route('events.index')->with('success', 'Event berhasil dihapus.');
    }
}
