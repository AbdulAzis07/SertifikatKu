<?php

namespace App\Jobs;

use App\Mail\CertificateMail;
use App\Models\Certificate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendCertificateEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Certificate $certificate) {}

    public function handle(): void
    {
        Mail::to($this->certificate->participant->email)
            ->send(new CertificateMail($this->certificate));

        // Update timestamp dikirim
        $this->certificate->update(['dikirim_at' => now()]);
    }
}
