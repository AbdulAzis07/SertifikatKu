<?php
 
namespace App\Http\Controllers;
 
use App\Models\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
 
class VerifyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Verification/Show');
    }
 
    public function check(Request $request, string $code)
    {
        $certificate = Certificate::where('nomor_sertifikat', $code)
            ->with(['participant.event'])
            ->first();
 
        $result = null;
        if ($certificate) {
            $result = [
                'status'      => $certificate->status === 'valid' ? 'valid' : 'revoked',
                'number'      => $certificate->nomor_sertifikat,
                'name'        => $certificate->participant->nama,
                'position'    => $certificate->participant->posisi,
                'award'       => $certificate->participant->penghargaan,
                'event'       => $certificate->participant->event->nama,
                'date'        => $certificate->tanggal_terbit->format('Y-m-d'),
            ];
        } else {
            $result = [
                'status' => 'not_found',
                'number' => $code,
            ];
        }
 
        if ($request->wantsJson()) {
            if ($result['status'] === 'not_found') {
                return response()->json(['status' => 'not_found'], 404);
            }
            return response()->json([
                'status'      => $certificate->status === 'valid' ? 'valid' : 'dicabut',
                'certificate' => [
                    'nomor_sertifikat' => $certificate->nomor_sertifikat,
                    'tanggal_terbit'   => $certificate->tanggal_terbit->format('Y-m-d'),
                    'participant'      => [
                        'nama'        => $certificate->participant->nama,
                        'posisi'      => $certificate->participant->posisi,
                        'penghargaan' => $certificate->participant->penghargaan,
                    ],
                    'event' => [
                        'nama'         => $certificate->participant->event->nama,
                        'penyelenggara'=> $certificate->participant->event->penyelenggara,
                        'tanggal_mulai'=> $certificate->participant->event->tanggal_mulai->format('Y-m-d'),
                    ],
                ],
            ]);
        }
 
        return Inertia::render('Verification/Show', [
            'initialResult' => $result,
            'code'          => $code,
        ]);
    }
}
