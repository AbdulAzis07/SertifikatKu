<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@sertifikatku.com')->first();

        $events = [
            [
                'nama'             => 'Workshop Docker Fundamentals',
                'penyelenggara'    => 'Tech Community Indonesia',
                'lokasi'           => 'Aula Gedung A, Jakarta',
                'tanggal_mulai'    => Carbon::now()->subDays(30),
                'tanggal_selesai'  => Carbon::now()->subDays(29),
                'deskripsi'        => 'Workshop intensif belajar Docker dari dasar hingga deployment.',
                'kategori'         => 'workshop',
            ],
            [
                'nama'             => 'Seminar Kecerdasan Buatan',
                'penyelenggara'    => 'Universitas Nusantara',
                'lokasi'           => 'Auditorium Utama, Bandung',
                'tanggal_mulai'    => Carbon::now()->subDays(5),
                'tanggal_selesai'  => Carbon::now()->addDays(5),
                'deskripsi'        => 'Seminar membahas perkembangan AI terkini dan implementasinya.',
                'kategori'         => 'seminar',
            ],
            [
                'nama'             => 'Pelatihan Laravel Advanced',
                'penyelenggara'    => 'SertifikatKu Academy',
                'lokasi'           => 'Online via Zoom',
                'tanggal_mulai'    => Carbon::now()->addDays(15),
                'tanggal_selesai'  => Carbon::now()->addDays(17),
                'deskripsi'        => 'Pelatihan lanjutan membahas fitur-fitur advanced Laravel 11.',
                'kategori'         => 'pelatihan',
            ],
        ];

        foreach ($events as $data) {
            // Bypass booted() auto-status for seeding — set status manually
            $today = Carbon::today();
            $start = Carbon::parse($data['tanggal_mulai']);
            $end   = isset($data['tanggal_selesai']) ? Carbon::parse($data['tanggal_selesai']) : null;

            if ($start->gt($today)) {
                $status = 'upcoming';
            } elseif ($end && $end->lt($today)) {
                $status = 'completed';
            } else {
                $status = 'ongoing';
            }

            Event::firstOrCreate(
                ['nama' => $data['nama'], 'user_id' => $admin->id],
                array_merge($data, ['user_id' => $admin->id, 'status' => $status])
            );
        }
    }
}
