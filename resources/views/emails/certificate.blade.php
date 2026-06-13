<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Sertifikat Anda — {{ $event->nama }}</title>
    <style>
        body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a1a6e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { border: 1px solid #ddd; padding: 30px; border-radius: 0 0 8px 8px; }
        .cert-box { background: #f8f9ff; border: 1px solid #c7d2fe; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .btn { background: #1a1a6e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
        .footer { color: #888; font-size: 12px; margin-top: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎓 SertifikatKu</h1>
        <p>Platform Manajemen Sertifikat Digital</p>
    </div>
    <div class="content">
        <p>Yth. <strong>{{ $participant->nama }}</strong>,</p>
        <p>Selamat! Sertifikat Anda atas partisipasi dalam <strong>{{ $event->nama }}</strong> telah diterbitkan dan terlampir dalam email ini.</p>

        <div class="cert-box">
            <p><strong>No. Sertifikat:</strong> {{ $certificate->nomor_sertifikat }}</p>
            <p><strong>Event:</strong> {{ $event->nama }}</p>
            <p><strong>Penyelenggara:</strong> {{ $event->penyelenggara }}</p>
            <p><strong>Tanggal Terbit:</strong> {{ $certificate->tanggal_terbit->isoFormat('D MMMM Y') }}</p>
        </div>

        <p>Anda dapat memverifikasi keaslian sertifikat ini melalui link berikut:</p>
        <a href="{{ $verifyUrl }}" class="btn">🔍 Verifikasi Sertifikat</a>

        <div class="footer">
            <p>Email ini dikirim otomatis oleh sistem SertifikatKu. Mohon tidak membalas email ini.</p>
        </div>
    </div>
</body>
</html>
