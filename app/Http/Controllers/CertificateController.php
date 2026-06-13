<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\Template;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CertificateController extends Controller
{
    // ── Daftar Sertifikat ────────────────────────────────────
    public function index(Request $request): Response
    {
        $certificates = Certificate::with(['participant.event', 'template'])
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'certificate_number' => $c->nomor_sertifikat,
                'participant' => $c->participant->nama,
                'event' => $c->participant->event->nama,
                'issued_at' => $c->tanggal_terbit->format('Y-m-d'),
                'status' => $c->status,
                'pdf_url' => $c->pdf_url,
                'qr_url' => $c->qr_url,
            ]);

        return Inertia::render('Certificates/Index', [
            'certificates' => $certificates,
        ]);
    }

    // ── Detail Sertifikat (JSON untuk modal) ─────────────────
    public function show(Certificate $certificate): JsonResponse
    {
        return response()->json([
            'certificate' => $certificate->load(['participant.event', 'template.signers']),
        ]);
    }

    // ── Halaman Generate ─────────────────────────────────────
    public function generatePage(): Response
    {
        return Inertia::render('Certificates/Generate', [
            'events'    => Event::with('participants')->get(['id', 'nama', 'penyelenggara']),
            'templates' => Template::with('signers')->get(['id', 'nama', 'orientasi']),
        ]);
    }

    // ── Generate Massal ──────────────────────────────────────
    public function generate(Request $request): RedirectResponse
    {
        $request->validate([
            'event_id'    => 'required|exists:events,id',
            'template_id' => 'required|exists:templates,id',
        ]);

        $event    = Event::findOrFail($request->event_id);
        $template = Template::with('signers')->findOrFail($request->template_id);

        // Peserta yang belum punya sertifikat untuk template ini
        $participants = $event->participants()
            ->whereDoesntHave('certificates', fn($q) => $q->where('template_id', $template->id))
            ->get();

        if ($participants->isEmpty()) {
            return back()->with('info', 'Semua peserta sudah memiliki sertifikat untuk template ini.');
        }

        // Hitung counter terakhir
        $kode  = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $event->nama), 0, 4));
        $year  = Carbon::now()->year;
        $lastCount = Certificate::where('nomor_sertifikat', 'like', "CERT/{$kode}/{$year}/%")
            ->count();

        $created = 0;

        DB::transaction(function () use ($participants, $template, $kode, $year, &$lastCount, &$created) {
            foreach ($template->signers as $s) {
                $s->signature_base64 = $s->signature_path && Storage::disk('public')->exists($s->signature_path)
                    ? base64_encode(Storage::disk('public')->get($s->signature_path))
                    : null;
            }

            foreach ($participants as $participant) {
                $lastCount++;
                $nomor = "CERT/{$kode}/{$year}/" . str_pad($lastCount, 3, '0', STR_PAD_LEFT);

                // 1. Generate QR Code
                $qrUrl     = route('verify.check', ['code' => $nomor]);
                $qrContent = QrCode::format('png')->size(200)->generate($qrUrl);
                $qrPath    = "qrcodes/{$nomor}.png";
                Storage::disk('public')->put($qrPath, $qrContent);

                // 2. Generate PDF via Dompdf
                $descriptionText = $this->buildDescription($template, $participant);
                $pdfData = [
                    'certificate'     => [
                        'nomor'       => $nomor,
                        'tanggal'     => Carbon::now()->isoFormat('D MMMM Y'),
                    ],
                    'participant'     => $participant,
                    'event'           => $participant->event,
                    'template'        => $template,
                    'signers'         => $template->signers,
                    'description'     => $descriptionText,
                    'qr_base64'       => base64_encode($qrContent),
                    'background_base64' => $template->background_path
                        ? base64_encode(Storage::disk('public')->get($template->background_path))
                        : null,
                ];

                $orientation = $template->orientasi === 'landscape' ? 'landscape' : 'portrait';
                $pdf = Pdf::loadView('certificates.template', $pdfData)
                    ->setPaper('a4', $orientation);

                $pdfPath = "certificates/{$nomor}.pdf";
                Storage::disk('public')->put($pdfPath, $pdf->output());

                // 3. Simpan ke DB
                Certificate::create([
                    'participant_id'   => $participant->id,
                    'template_id'      => $template->id,
                    'nomor_sertifikat' => $nomor,
                    'qr_code_path'     => $qrPath,
                    'pdf_path'         => $pdfPath,
                    'status'           => 'valid',
                    'tanggal_terbit'   => Carbon::today(),
                ]);

                $created++;
            }
        });

        ActivityLog::log('generate_certificate', "Generate {$created} sertifikat untuk event: {$kode}/{$year}");

        return redirect()->route('certificates.index')
            ->with('success', "Berhasil membuat {$created} sertifikat.");
    }

    // ── Halaman Preview ──────────────────────────────────────
    public function previewPage(): Response
    {
        $templates = Template::with('signers')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'nama' => $t->nama,
                'orientasi' => $t->orientasi,
                'deskripsi_format' => $t->deskripsi_format,
                'background_url' => $t->background_url,
                'signers' => $t->signers->map(fn($s) => [
                    'id' => $s->id,
                    'nama' => $s->nama,
                    'jabatan' => $s->jabatan,
                    'signature_url' => $s->signature_url,
                ]),
            ]);

        return Inertia::render('Certificates/Preview', [
            'templates' => $templates,
            'sample'    => [
                'nama_peserta' => 'Budi Santoso',
                'event_nama'   => 'Workshop Laravel 2026',
                'nomor'        => 'CERT/WORK/2026/001',
            ],
        ]);
    }

    // ── Download PDF ─────────────────────────────────────────
    public function download(Certificate $certificate): StreamedResponse
    {
        if (! $certificate->pdf_path || ! Storage::disk('public')->exists($certificate->pdf_path)) {
            abort(404, 'File PDF tidak ditemukan.');
        }

        return Storage::disk('public')->download(
            $certificate->pdf_path,
            $certificate->nomor_sertifikat . '.pdf'
        );
    }

    // ── Revoke Sertifikat ────────────────────────────────────
    public function revoke(Certificate $certificate): RedirectResponse
    {
        $certificate->update(['status' => 'dicabut']);

        ActivityLog::log('revoke_certificate', "Mencabut sertifikat: {$certificate->nomor_sertifikat}");

        return back()->with('success', 'Sertifikat berhasil dicabut.');
    }

    // ── Kirim Email Sertifikat ───────────────────────────────
    public function sendEmail(Request $request): RedirectResponse
    {
        $request->validate([
            'certificate_ids'   => 'required|array|min:1',
            'certificate_ids.*' => 'exists:certificates,id',
        ]);

        $certificates = Certificate::with(['participant', 'template'])
            ->whereIn('id', $request->certificate_ids)
            ->where('status', 'valid')
            ->get();

        foreach ($certificates as $certificate) {
            \App\Jobs\SendCertificateEmail::dispatch($certificate);
        }

        ActivityLog::log('send_email', "Mengirim {$certificates->count()} sertifikat via email.");

        return back()->with('success', "Email sedang dikirim ke {$certificates->count()} peserta.");
    }

    // ── Helper: Build Description ─────────────────────────────
    private function buildDescription(Template $template, $participant): string
    {
        $event = $participant->event;
        $format = $template->deskripsi_format
            ?? 'Diberikan kepada {nama} atas partisipasinya sebagai {posisi} dalam {event}.';

        return str_replace(
            ['{nama}', '{posisi}', '{event}', '{penghargaan}'],
            [$participant->nama, $participant->posisi, $event->nama, $participant->penghargaan ?? ''],
            $format
        );
    }
}
