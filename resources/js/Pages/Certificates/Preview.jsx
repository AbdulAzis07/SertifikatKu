import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CertificatesPreview({ templates = [], sample = null }) {
    const [selectedTemplateId, setSelectedTemplateId] = useState(
        templates.length > 0 ? String(templates[0].id) : ''
    );
    const [orientation, setOrientation] = useState(
        templates.length > 0 ? templates[0].orientasi : 'landscape'
    );
    const [signerCount, setSignerCount] = useState(
        templates.length > 0 ? templates[0].signers.length : 2
    );

    const selectedTemplate = templates.find(t => String(t.id) === selectedTemplateId);

    const handleTemplateChange = (e) => {
        const val = e.target.value;
        setSelectedTemplateId(val);
        const t = templates.find(temp => String(temp.id) === val);
        if (t) {
            setOrientation(t.orientasi);
            setSignerCount(t.signers.length);
        }
    };

    const certData = {
        number: sample?.nomor || 'CERT/WS-DOCKER/2026/001',
        participant: sample?.nama_peserta || 'Ahmad Fauzi',
        position: 'Peserta',
        award: 'Best Participant',
        event: sample?.event_nama || 'Workshop Docker Fundamentals',
        date: '20 April 2026',
        organizer: 'Tech Community Indonesia',
    };

    const dummySigners = [
        { name: 'Dr. Budi Santoso, M.T.', title: 'Ketua Penyelenggara' },
        { name: 'Prof. Siti Aminah, Ph.D.', title: 'Rektor Universitas' },
        { name: 'Ir. Joko Widodo', title: 'Kepala Dinas Pendidikan' },
        { name: 'Ahmad Dahlan, M.Kom.', title: 'Sponsor Utama' },
    ];

    let descriptionText = '';
    if (selectedTemplate) {
        const format = selectedTemplate.deskripsi_format || 'Diberikan kepada {nama} atas partisipasinya sebagai {posisi} dalam {event}.';
        descriptionText = format
            .replace('{nama}', certData.participant)
            .replace('{posisi}', certData.position)
            .replace('{event}', certData.event)
            .replace('{penghargaan}', certData.award || '');
    } else {
        descriptionText = `Diberikan kepada ${certData.participant} atas partisipasinya sebagai ${certData.position} dengan penghargaan ${certData.award} dalam acara ${certData.event} yang diselenggarakan oleh ${certData.organizer} pada tanggal ${certData.date}.`;
    }

    const isLandscape = orientation === 'landscape';
    
    // Pad template signers with dummy signers if signerCount is overridden to be larger
    const activeSigners = selectedTemplate
        ? (signerCount === selectedTemplate.signers.length 
            ? selectedTemplate.signers 
            : [...selectedTemplate.signers, ...dummySigners].slice(0, signerCount))
        : dummySigners.slice(0, signerCount);

    /* ── Signature Block ──────────────────────────────── */
    const SignatureBlock = ({ signer, idx, compact = false }) => {
        const signatureUrl = signer.signature_url;
        const nameText = signer.nama || signer.name;
        const titleText = signer.jabatan || signer.title;

        return (
            <div className="flex flex-col items-center" style={{ width: compact ? '200px' : '240px' }}>
                <div className="h-16 w-full mb-1 flex items-end justify-center relative">
                    {signatureUrl ? (
                        <img
                            src={signatureUrl}
                            alt={`Signature of ${nameText}`}
                            className="h-12 object-contain absolute bottom-1 pointer-events-none"
                            style={{ maxWidth: compact ? '120px' : '160px' }}
                        />
                    ) : (
                        <svg
                            className="h-12 text-indigo-900/70 absolute bottom-1"
                            style={{ width: compact ? '120px' : '160px' }}
                            viewBox="0 0 200 60" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                            {idx % 2 === 0 ? (
                                <>
                                    <path d="M10,40 Q30,10 50,30 T90,40 T130,20 T180,50" />
                                    <path d="M60,45 Q70,25 80,45" />
                                    <path d="M110,45 L150,35" />
                                </>
                            ) : (
                                <>
                                    <path d="M20,50 Q40,20 70,40 T110,30 T160,40 T190,20" />
                                    <path d="M80,50 Q100,10 120,40" />
                                </>
                            )}
                        </svg>
                    )}
                </div>
                <div className="w-full border-t border-slate-300 pt-2 text-center">
                    <p className={`font-bold text-slate-800 ${compact ? 'text-sm' : 'text-base'}`}>{nameText}</p>
                    <p className={`text-slate-500 mt-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>{titleText}</p>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Certificate Preview" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Link href={route('certificates.index')} className="hover:text-white transition-colors">Certificates</Link>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        <span className="text-slate-200">Preview Layout Options</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Dynamic Preview</h1>
                    <p className="text-sm text-slate-400 mt-1">Interactive layout engine for multiple signers & orientations</p>
                </div>

                {/* Control Panel */}
                <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
                    {templates.length > 0 && (
                        <>
                            <div className="flex items-center gap-2 px-2">
                                <span className="text-xs text-slate-400 font-medium">TEMPLATE:</span>
                                <select
                                    value={selectedTemplateId}
                                    onChange={handleTemplateChange}
                                    className="bg-slate-950/60 border border-white/10 rounded-xl text-xs text-slate-200 px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-transparent outline-none font-medium transition-all cursor-pointer"
                                >
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id} className="bg-slate-800 text-slate-200">
                                            {t.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                        </>
                    )}
                    <div className="flex items-center bg-slate-900/50 rounded-xl p-1">
                        <button onClick={() => setOrientation('landscape')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isLandscape ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            Landscape
                        </button>
                        <button onClick={() => setOrientation('portrait')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isLandscape ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            Portrait
                        </button>
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-2 px-2">
                        <span className="text-xs text-slate-400 font-medium">SIGNERS:</span>
                        {[1, 2, 3, 4].map(num => (
                            <button key={num} onClick={() => setSignerCount(num)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${signerCount === num ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                            >{num}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Certificate Canvas ────────────────────────── */}
            <div className="flex justify-center overflow-x-auto p-4 md:p-12 bg-slate-900 rounded-3xl border border-white/5 relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                <div
                    className="relative bg-white shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 ease-in-out origin-top"
                    style={{
                        width: isLandscape ? '1123px' : '794px',
                        height: isLandscape ? '794px' : '1123px',
                        transform: 'scale(0.75)',
                        transformOrigin: 'top center',
                        marginBottom: '-160px'
                    }}
                >
                    {/* Background Image if uploaded */}
                    {selectedTemplate?.background_url && (
                        <img
                            src={selectedTemplate.background_url}
                            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                            alt="Certificate Background"
                        />
                    )}

                    {/* Border Ornaments */}
                    {!selectedTemplate?.background_url && (
                        <>
                            <div className="absolute inset-4 border-[12px] border-double border-indigo-900/12 rounded-sm pointer-events-none" />
                            <div className="absolute inset-[30px] border border-indigo-900/8 pointer-events-none" />
                            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-br-full pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-600/5 rounded-tl-full pointer-events-none" />
                            {!isLandscape && <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-bl-full pointer-events-none" />}
                        </>
                    )}

                    {/* ── Content ─────────────────────────────── */}
                    <div className="absolute inset-0 flex flex-col items-center z-10" style={{ padding: isLandscape ? '50px 80px' : '50px 60px' }}>

                        {/* Top Bar with Cert Number */}
                        <div className="w-full flex justify-end mb-8">
                            <p className="text-xs font-mono text-slate-400 tracking-wider">No. {certData.number}</p>
                        </div>

                        {/* Title Section (Centered below Cert No) */}
                        <div className="text-center w-full flex flex-col items-center mt-2">
                            <h1 className={`font-serif font-bold text-indigo-900 tracking-widest uppercase ${isLandscape ? 'text-5xl mb-4' : 'text-5xl mb-6'}`}>
                                Certificate of Appreciation
                            </h1>
                            <p className={`text-indigo-600/80 font-medium tracking-widest uppercase ${isLandscape ? 'text-sm mb-12' : 'text-base mb-16'}`}>
                                Proudly Presented To
                            </p>

                            {/* Name */}
                            <h2 className={`font-bold font-serif text-slate-900 border-b-2 border-indigo-100 pb-4 px-12 inline-block ${isLandscape ? 'text-6xl mb-8' : 'text-6xl mb-12'}`}>
                                {certData.participant}
                            </h2>

                            {/* Description */}
                            <p className={`text-slate-600 leading-relaxed font-serif ${isLandscape ? 'text-xl max-w-4xl' : 'text-xl max-w-3xl'}`}>
                                {descriptionText}
                            </p>
                        </div>

                        {/* ── Spacer ── pushes footer to bottom */}
                        <div className="flex-1" />

                        {/* ══════════════════════════════════════ */}
                        {/*   FOOTER — QR and Signatures Container */}
                        {/* ══════════════════════════════════════ */}
                        <div className="w-full flex items-end justify-between relative mt-auto">
                            
                            {/* QR Code - ALWAYS Bottom Left */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className="w-24 h-24 bg-white border border-slate-200 p-2 shadow-sm rounded-lg flex items-center justify-center">
                                    <svg className="w-16 h-16 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 2h3v2h-3v-2zm-2 2h2v2h-2v-2zm-1 2h2v2h-2v-2zm-2-4h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                                    </svg>
                                </div>
                                <p className="text-[10px] text-slate-400 font-mono mt-2 tracking-widest">VERIFY SCAN</p>
                            </div>

                            {/* Signatures Area */}
                            <div className={`flex-1 flex ${isLandscape ? 'justify-end' : 'justify-center'} pl-8`}>
                                
                                {isLandscape ? (
                                    /* ── LANDSCAPE: Single Row (Right Aligned) ── */
                                    <div className={`flex items-end ${
                                        signerCount === 1 ? 'justify-end' :
                                        signerCount === 2 ? 'gap-16' :
                                        signerCount === 3 ? 'gap-8' : 'gap-6'
                                    }`}>
                                        {activeSigners.map((s, i) => (
                                            <SignatureBlock key={i} signer={s} idx={i} compact={signerCount >= 3} />
                                        ))}
                                    </div>
                                ) : (
                                    /* ── PORTRAIT: Grid Layout (Centered) ── */
                                    <div className="flex flex-col items-center gap-12 ml-auto mr-auto pl-12">
                                        {signerCount === 1 && (
                                            <SignatureBlock signer={activeSigners[0]} idx={0} />
                                        )}
                                        {signerCount === 2 && (
                                            <div className="flex gap-16">
                                                <SignatureBlock signer={activeSigners[0]} idx={0} compact />
                                                <SignatureBlock signer={activeSigners[1]} idx={1} compact />
                                            </div>
                                        )}
                                        {signerCount === 3 && (
                                            <div className="flex flex-col items-center gap-10">
                                                <div className="flex gap-16">
                                                    <SignatureBlock signer={activeSigners[0]} idx={0} compact />
                                                    <SignatureBlock signer={activeSigners[1]} idx={1} compact />
                                                </div>
                                                <div className="flex justify-center w-full">
                                                    <SignatureBlock signer={activeSigners[2]} idx={2} compact />
                                                </div>
                                            </div>
                                        )}
                                        {signerCount === 4 && (
                                            <div className="flex flex-col gap-10">
                                                <div className="flex gap-16">
                                                    <SignatureBlock signer={activeSigners[0]} idx={0} compact />
                                                    <SignatureBlock signer={activeSigners[1]} idx={1} compact />
                                                </div>
                                                <div className="flex gap-16">
                                                    <SignatureBlock signer={activeSigners[2]} idx={2} compact />
                                                    <SignatureBlock signer={activeSigners[3]} idx={3} compact />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
