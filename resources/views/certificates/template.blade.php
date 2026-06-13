<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sertifikat {{ $certificate['nomor'] }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
            margin: 0;
            @if($template->orientasi === 'landscape')
            size: A4 landscape;
            @else
            size: A4 portrait;
            @endif
        }

        body {
            width: 100%;
            height: 100%;
            font-family: 'Times New Roman', Times, serif;
            position: relative;
            overflow: hidden;
        }

        .certificate-wrapper {
            width: 100%;
            height: 100vh;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 40px 60px;
        }

        .background-image {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100%; height: 100%;
            z-index: 0;
        }

        .content {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .cert-number {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 10px;
            color: #666;
        }

        .title {
            font-size: 36px;
            font-weight: bold;
            color: #1a1a6e;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 16px;
            color: #444;
            margin-bottom: 30px;
            letter-spacing: 2px;
        }

        .recipient-label {
            font-size: 14px;
            color: #555;
            margin-bottom: 8px;
        }

        .recipient-name {
            font-size: 32px;
            font-weight: bold;
            color: #1a1a6e;
            border-bottom: 2px solid #1a1a6e;
            padding-bottom: 8px;
            margin-bottom: 20px;
            min-width: 400px;
        }

        .description {
            font-size: 13px;
            color: #444;
            max-width: 600px;
            line-height: 1.8;
            margin-bottom: 20px;
        }

        .date {
            font-size: 12px;
            color: #666;
            margin-bottom: 40px;
        }

        .footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
        }

        .qr-section {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .qr-label {
            font-size: 8px;
            color: #888;
            margin-top: 4px;
            text-align: center;
        }

        .signers-section {
            display: flex;
            gap: 40px;
            justify-content: flex-end;
        }

        .signer {
            text-align: center;
            min-width: 140px;
        }

        .signer-line {
            border-top: 1px solid #333;
            padding-top: 6px;
            margin-top: 5px;
        }

        .signer-name {
            font-size: 11px;
            font-weight: bold;
            color: #222;
        }

        .signer-title {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
        }
    </style>
</head>
<body>
<div class="certificate-wrapper">

    {{-- Background --}}
    @if($background_base64)
    <img class="background-image"
         src="data:image/png;base64,{{ $background_base64 }}"
         alt="background"/>
    @endif

    {{-- Nomor sertifikat --}}
    <div class="cert-number">No. {{ $certificate['nomor'] }}</div>

    {{-- Konten utama --}}
    <div class="content">
        <div class="title">Certificate</div>
        <div class="subtitle">of Participation</div>

        <div class="recipient-label">Diberikan kepada</div>
        <div class="recipient-name">{{ $participant->nama }}</div>

        <div class="description">{{ $description }}</div>

        <div class="date">{{ $certificate['tanggal'] }}</div>
    </div>

    {{-- Footer: QR + Tanda tangan --}}
    <div class="footer">
        {{-- QR Code --}}
        <div class="qr-section">
            @if($qr_base64)
            <img src="data:image/png;base64,{{ $qr_base64 }}"
                 alt="QR Code" width="80" height="80"/>
            @endif
            <div class="qr-label">Verify QR</div>
        </div>

        {{-- Penandatangan --}}
        <div class="signers-section">
            @foreach($signers as $signer)
            <div class="signer">
                <div style="height: 50px; text-align: center; margin-bottom: -10px;">
                    @if(isset($signer->signature_base64) && $signer->signature_base64)
                        <img src="data:image/png;base64,{{ $signer->signature_base64 }}" style="max-height: 50px; max-width: 120px;" />
                    @else
                        <div style="height: 50px;"></div>
                    @endif
                </div>
                <div class="signer-line">
                    <div class="signer-name">{{ $signer->nama }}</div>
                    <div class="signer-title">{{ $signer->jabatan }}</div>
                </div>
            </div>
            @endforeach
        </div>
    </div>

</div>
</body>
</html>
