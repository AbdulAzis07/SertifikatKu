<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Template;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_events'       => Event::count(),
                'total_participants' => Participant::count(),
                'total_certificates' => Certificate::count(),
                'active_templates'   => Template::count(),
                'valid_certificates' => ($validCount = Certificate::where('status', 'valid')->count()),
                'valid_rate'         => ($total = Certificate::count()) > 0 ? round(($validCount / $total) * 100, 1) : 100,
            ],
            'chart_data'          => Certificate::perMonth(),
            'recent_certificates' => Certificate::with(['participant.event', 'template'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($c) => [
                    'id'     => $c->id,
                    'number' => $c->nomor_sertifikat,
                    'name'   => $c->participant->nama,
                    'event'  => $c->participant->event->nama,
                    'date'   => $c->tanggal_terbit->format('Y-m-d'),
                    'status' => $c->status,
                ]),
            'activity_feed' => ActivityLog::with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn($a) => [
                    'id'          => $a->id,
                    'action'      => $a->action,
                    'description' => $a->description,
                    'user'        => $a->user?->name ?? 'System',
                    'created_at'  => $a->created_at->diffForHumans(),
                ]),
        ]);
    }
}
