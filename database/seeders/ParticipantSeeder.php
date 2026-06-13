<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Database\Seeder;

class ParticipantSeeder extends Seeder
{
    public function run(): void
    {
        $events = Event::all();

        $names = [
            'Ahmad Fauzi', 'Siti Nurhaliza', 'Budi Santoso',
            'Dewi Lestari', 'Rudi Hermawan', 'Rina Marlina',
            'Dodi Kurniawan', 'Fitri Handayani', 'Hendra Saputra', 'Lina Wati',
        ];

        $posisi = ['peserta', 'peserta', 'peserta', 'peserta', 'pemateri', 'peserta', 'moderator', 'peserta', 'peserta', 'panitia'];

        foreach ($events as $event) {
            foreach ($names as $i => $name) {
                $slug  = strtolower(str_replace(' ', '.', $name));
                $email = "{$slug}@example.com";

                Participant::firstOrCreate(
                    ['event_id' => $event->id, 'email' => $email],
                    [
                        'nama'        => $name,
                        'email'       => $email,
                        'posisi'      => $posisi[$i],
                        'penghargaan' => ($i === 4) ? 'Best Presenter' : null,
                    ]
                );
            }
        }
    }
}
