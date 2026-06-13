<?php

namespace App\Mail;

use App\Models\Certificate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class CertificateMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Certificate $certificate) {}

    public function envelope(): Envelope
    {
        $eventNama = $this->certificate->participant->event->nama;
        return new Envelope(
            subject: "Sertifikat Anda — {$eventNama}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.certificate',
            with: [
                'certificate'  => $this->certificate,
                'participant'  => $this->certificate->participant,
                'event'        => $this->certificate->participant->event,
                'verifyUrl'    => route('verify.check', ['code' => $this->certificate->nomor_sertifikat]),
            ],
        );
    }

    public function attachments(): array
    {
        $attachments = [];
        if ($this->certificate->pdf_path && Storage::disk('public')->exists($this->certificate->pdf_path)) {
            $attachments[] = Attachment::fromStorage($this->certificate->pdf_path)
                ->as($this->certificate->nomor_sertifikat . '.pdf')
                ->withMime('application/pdf');
        }
        return $attachments;
    }
}
