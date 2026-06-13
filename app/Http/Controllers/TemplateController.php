<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Event;
use App\Models\Signer;
use App\Models\Template;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function index(Request $request): Response
    {
        $templates = Template::with('signers', 'event')
            ->latest()
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->nama,
                'orientation' => $t->orientasi,
                'description' => $t->deskripsi_format,
                'background_path' => $t->background_path,
                'background_url' => $t->background_url,
                'signers' => $t->signers->map(fn($s) => [
                    'id' => $s->id,
                    'name' => $s->nama,
                    'title' => $s->jabatan,
                    'signature_path' => $s->signature_path,
                ]),
                'events_count' => $t->event ? 1 : 0,
                'color' => $t->orientasi === 'landscape' ? 'from-blue-600 to-indigo-700' : 'from-amber-600 to-orange-700',
                'created_at' => $t->created_at->format('Y-m-d'),
            ]);

        return Inertia::render('Templates/Index', [
            'templates' => $templates,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Templates/Create', [
            'events' => Event::orderBy('nama')->get(['id', 'nama', 'penyelenggara']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nama'              => 'required|string|max:255',
            'orientasi'         => 'required|in:landscape,portrait',
            'event_id'          => 'nullable|exists:events,id',
            'deskripsi_format'  => 'nullable|string',
            'background'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'signers'           => 'required|array|min:1|max:4',
            'signers.*.nama'    => 'required|string|max:255',
            'signers.*.jabatan' => 'required|string|max:255',
            'signers.*.signature' => 'nullable|image|mimes:png|max:2048',
        ]);

        $backgroundPath = null;
        if ($request->hasFile('background')) {
            $backgroundPath = $request->file('background')->store('templates', 'public');
        }

        $template = auth()->user()->templates()->create([
            'nama'             => $data['nama'],
            'orientasi'        => $data['orientasi'],
            'event_id'         => $data['event_id'] ?? null,
            'deskripsi_format' => $data['deskripsi_format'] ?? null,
            'background_path'  => $backgroundPath,
        ]);

        foreach ($data['signers'] as $i => $signerData) {
            $sigPath = null;
            if (isset($signerData['signature']) && $signerData['signature'] instanceof \Illuminate\Http\UploadedFile) {
                $sigPath = $signerData['signature']->store('signatures', 'public');
            }

            Signer::create([
                'template_id'    => $template->id,
                'nama'           => $signerData['nama'],
                'jabatan'        => $signerData['jabatan'],
                'signature_path' => $sigPath,
                'urutan'         => $i + 1,
            ]);
        }

        ActivityLog::log('create_template', "Membuat template: {$template->nama}");

        return redirect()->route('templates.index')->with('success', 'Template berhasil dibuat.');
    }

    public function update(Request $request, Template $template): RedirectResponse
    {
        $data = $request->validate([
            'nama'              => 'required|string|max:255',
            'orientasi'         => 'required|in:landscape,portrait',
            'event_id'          => 'nullable|exists:events,id',
            'deskripsi_format'  => 'nullable|string',
            'background'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'signers'           => 'required|array|min:1|max:4',
            'signers.*.nama'    => 'required|string|max:255',
            'signers.*.jabatan' => 'required|string|max:255',
        ]);

        $backgroundPath = $template->background_path;
        if ($request->hasFile('background')) {
            if ($backgroundPath) Storage::disk('public')->delete($backgroundPath);
            $backgroundPath = $request->file('background')->store('templates', 'public');
        }

        $template->update([
            'nama'             => $data['nama'],
            'orientasi'        => $data['orientasi'],
            'event_id'         => $data['event_id'] ?? null,
            'deskripsi_format' => $data['deskripsi_format'] ?? null,
            'background_path'  => $backgroundPath,
        ]);

        // Sync signers
        $template->signers()->delete();
        foreach ($data['signers'] as $i => $s) {
            Signer::create([
                'template_id' => $template->id,
                'nama'        => $s['nama'],
                'jabatan'     => $s['jabatan'],
                'urutan'      => $i + 1,
            ]);
        }

        ActivityLog::log('update_template', "Memperbarui template: {$template->nama}");

        return redirect()->route('templates.index')->with('success', 'Template berhasil diperbarui.');
    }

    public function destroy(Template $template): RedirectResponse
    {
        if ($template->background_path) {
            Storage::disk('public')->delete($template->background_path);
        }
        $nama = $template->nama;
        $template->delete(); // signers cascade

        ActivityLog::log('delete_template', "Menghapus template: {$nama}");

        return redirect()->route('templates.index')->with('success', 'Template berhasil dihapus.');
    }
}
