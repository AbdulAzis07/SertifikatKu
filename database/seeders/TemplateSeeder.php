<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Signer;
use App\Models\Template;
use App\Models\User;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        $admin  = User::where('email', 'admin@sertifikatku.com')->first();
        $event1 = Event::where('nama', 'Workshop Docker Fundamentals')->first();
        $event2 = Event::where('nama', 'Seminar Kecerdasan Buatan')->first();

        $templates = [
            [
                'user_id'         => $admin->id,
                'event_id'        => $event1?->id,
                'nama'            => 'Template Workshop Landscape',
                'orientasi'       => 'landscape',
                'deskripsi_format'=> 'Diberikan kepada {nama} atas partisipasinya sebagai {posisi} dalam {event}.',
                'signers' => [
                    ['nama' => 'Dr. Budi Santoso, M.T.', 'jabatan' => 'Ketua Penyelenggara', 'urutan' => 1],
                    ['nama' => 'Prof. Siti Aminah, Ph.D.', 'jabatan' => 'Rektor Universitas', 'urutan' => 2],
                ],
            ],
            [
                'user_id'         => $admin->id,
                'event_id'        => $event2?->id,
                'nama'            => 'Template Seminar Portrait',
                'orientasi'       => 'portrait',
                'deskripsi_format'=> 'Diberikan kepada {nama} atas kehadirannya dalam {event} sebagai {posisi}.',
                'signers' => [
                    ['nama' => 'Ir. Ahmad Fauzi', 'jabatan' => 'Kepala Program', 'urutan' => 1],
                    ['nama' => 'Dewi Rahayu, M.Kom.', 'jabatan' => 'Koordinator Acara', 'urutan' => 2],
                ],
            ],
        ];

        foreach ($templates as $data) {
            $signers = $data['signers'];
            unset($data['signers']);

            $template = Template::firstOrCreate(
                ['nama' => $data['nama'], 'user_id' => $admin->id],
                $data
            );

            if ($template->signers()->count() === 0) {
                foreach ($signers as $s) {
                    Signer::create(array_merge($s, ['template_id' => $template->id]));
                }
            }
        }
    }
}
