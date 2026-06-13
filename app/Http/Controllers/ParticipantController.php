<?php

namespace App\Http\Controllers;

use App\Imports\ParticipantImport;
use App\Models\ActivityLog;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ParticipantController extends Controller
{
    public function index(Request $request): Response
    {
        $participants = Participant::with(['event', 'certificates'])
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'name'        => $p->nama,
                'email'       => $p->email,
                'phone'       => null,
                'position'    => ucfirst($p->posisi),
                'award'       => $p->penghargaan,
                'event'       => $p->event->nama,
                'event_id'    => $p->event_id,
                'certificate' => $p->certificates->first()?->nomor_sertifikat,
            ]);

        return Inertia::render('Participants/Index', [
            'participants' => $participants,
            'events'       => Event::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'event_id'    => 'required|exists:events,id',
            'nama'        => 'required|string|max:255',
            'email'       => 'required|email|max:255',
            'posisi'      => 'required|in:peserta,pemateri,moderator,panitia,juri',
            'penghargaan' => 'nullable|string|max:255',
        ]);

        // Cek duplikat email dalam event yang sama
        $exists = Participant::where('event_id', $data['event_id'])
            ->where('email', $data['email'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['email' => 'Email sudah terdaftar di event ini.']);
        }

        Participant::create($data);

        return back()->with('success', 'Peserta berhasil ditambahkan.');
    }

    public function update(Request $request, Participant $participant): RedirectResponse
    {
        $data = $request->validate([
            'event_id'    => 'required|exists:events,id',
            'nama'        => 'required|string|max:255',
            'email'       => 'required|email|max:255',
            'posisi'      => 'required|in:peserta,pemateri,moderator,panitia,juri',
            'penghargaan' => 'nullable|string|max:255',
        ]);

        $participant->update($data);

        return back()->with('success', 'Peserta berhasil diperbarui.');
    }

    public function destroy(Participant $participant): RedirectResponse
    {
        $participant->delete();

        return back()->with('success', 'Peserta berhasil dihapus.');
    }

    public function importPage(): Response
    {
        return Inertia::render('Participants/Import', [
            'events' => Event::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file'     => 'required|file|mimes:xlsx,xls|max:10240',
            'event_id' => 'required|exists:events,id',
        ]);

        $import = new ParticipantImport($request->event_id);
        Excel::import($import, $request->file('file'));

        $imported = $import->getImportedCount();
        $skipped  = $import->getSkippedCount();
        $failures = $import->getFailures();

        ActivityLog::log('import_participants', "Import {$imported} peserta ke event ID {$request->event_id}, {$skipped} di-skip.");

        return redirect()->route('participants.index')
            ->with('success', "Berhasil import {$imported} peserta. {$skipped} baris di-skip.")
            ->with('import_failures', $failures);
    }

    public function downloadTemplate(): HttpResponse
    {
        $headers = ['Nama', 'Email', 'Posisi', 'Penghargaan'];

        $callback = function () use ($headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="template-peserta.csv"',
        ]);
    }
}
