<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\Event;
use App\Models\Template;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        // Hanya seed sertifikat untuk event yang sudah completed (Workshop Docker)
        $event    = Event::where('nama', 'Workshop Docker Fundamentals')->first();
        $template = Template::where('nama', 'Template Workshop Landscape')->first();

        if (! $event || ! $template) return;

        $participants = $event->participants;
        $counter = 1;
        $kode    = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $event->nama), 0, 4));
        $year    = Carbon::now()->year;

        foreach ($participants as $participant) {
            $nomor = "CERT/{$kode}/{$year}/" . str_pad($counter, 3, '0', STR_PAD_LEFT);

            Certificate::firstOrCreate(
                ['participant_id' => $participant->id, 'template_id' => $template->id],
                [
                    'nomor_sertifikat' => $nomor,
                    'status'           => ($counter === 4) ? 'dicabut' : 'valid',
                    'tanggal_terbit'   => Carbon::now()->subDays(25),
                ]
            );

            $counter++;
        }
    }
}
