import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FileUpload from '@/Components/UI/FileUpload';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TemplatesCreate({ events }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        orientasi: 'landscape',
        event_id: '',
        deskripsi_format: 'Telah berhasil mengikuti {event_title} yang diselenggarakan oleh {organizer} pada tanggal {event_date} di {location}',
        background: null,
        signers: [
            { nama: '', jabatan: '', signature: null },
        ],
    });

    const [bgPreview, setBgPreview] = useState(null);

    const handleSignerChange = (index, field, value) => {
        const updated = [...data.signers];
        updated[index][field] = value;
        setData('signers', updated);
    };

    const addSigner = () => {
        if (data.signers.length < 4) {
            setData('signers', [...data.signers, { nama: '', jabatan: '', signature: null }]);
        }
    };

    const removeSigner = (index) => {
        if (data.signers.length > 1) {
            const updated = data.signers.filter((_, i) => i !== index);
            setData('signers', updated);
        }
    };

    const handleBgFile = (f) => {
        setData('background', f);
        if (f) {
            const r = new FileReader();
            r.onload = (e) => setBgPreview(e.target.result);
            r.readAsDataURL(f);
        } else {
            setBgPreview(null);
        }
    };

    const handleSigFile = (index, f) => {
        const updated = [...data.signers];
        updated[index].signature = f;
        setData('signers', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('templates.store'));
    };

    const variables = [
        { label: '{participant_name}', desc: 'Nama peserta' },
        { label: '{position}', desc: 'Sebagai / posisi peserta' },
        { label: '{award}', desc: 'Penghargaan yang diterima' },
        { label: '{event_title}', desc: 'Judul event' },
        { label: '{event_date}', desc: 'Tanggal event' },
        { label: '{organizer}', desc: 'Penyelenggara' },
        { label: '{location}', desc: 'Lokasi event' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Create Template" />

            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Link href={route('templates.index')} className="hover:text-white transition-colors">Templates</Link>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    <span className="text-slate-200">Create</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Create New Template</h1>
                <p className="text-sm text-slate-400 mt-1">Design a certificate template with custom fields and multiple signers</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left: Form */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Template Details */}
                        <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 space-y-5">
                            <h2 className="text-lg font-semibold text-white">Template Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Template Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="e.g. Template Formal Blue"
                                        className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.nama && <p className="text-red-400 text-xs mt-1">{errors.nama}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Orientation</label>
                                    <select
                                        value={data.orientasi}
                                        onChange={(e) => setData('orientasi', e.target.value)}
                                        className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="landscape">Landscape</option>
                                        <option value="portrait">Portrait</option>
                                    </select>
                                    {errors.orientasi && <p className="text-red-400 text-xs mt-1">{errors.orientasi}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Link to Event <span className="text-slate-500 text-xs font-normal">(optional)</span></label>
                                <select
                                    value={data.event_id}
                                    onChange={(e) => setData('event_id', e.target.value)}
                                    className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">Select event...</option>
                                    {events.map((e) => (
                                        <option key={e.id} value={e.id}>{e.nama} ({e.penyelenggara})</option>
                                    ))}
                                </select>
                                {errors.event_id && <p className="text-red-400 text-xs mt-1">{errors.event_id}</p>}
                            </div>

                            {/* Certificate Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Certificate Description</label>
                                <textarea
                                    value={data.deskripsi_format}
                                    onChange={(e) => setData('deskripsi_format', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {errors.deskripsi_format && <p className="text-red-400 text-xs mt-1">{errors.deskripsi_format}</p>}
                                <p className="text-xs text-slate-500 mt-1.5">Gunakan variabel di bawah untuk data dinamis:</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {variables.map((v) => (
                                        <button
                                            key={v.label}
                                            type="button"
                                            onClick={() => setData('deskripsi_format', data.deskripsi_format + ' ' + v.label)}
                                            className="group relative px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                                        >
                                            {v.label}
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{v.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Signers Section */}
                        <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Signers</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Tambahkan 1 hingga 4 penandatangan sertifikat</p>
                                </div>
                                {data.signers.length < 4 && (
                                    <button type="button" onClick={addSigner} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 border border-indigo-400/20 transition-all">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                        Add Signer
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {data.signers.map((signer, idx) => (
                                    <div key={idx} className="rounded-xl bg-slate-700/30 border border-white/5 p-4 relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">{idx + 1}</span>
                                                <p className="text-sm font-medium text-slate-300">Signer {idx + 1}</p>
                                            </div>
                                            {data.signers.length > 1 && (
                                                <button type="button" onClick={() => removeSigner(idx)} className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Remove signer">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Penandatangan <span className="text-red-400">*</span></label>
                                                <input type="text" value={signer.nama} onChange={(e) => handleSignerChange(idx, 'nama', e.target.value)} placeholder="e.g. Dr. Ahmad Dahlan" className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">Jabatan / Posisi <span className="text-red-400">*</span></label>
                                                <input type="text" value={signer.jabatan} onChange={(e) => handleSignerChange(idx, 'jabatan', e.target.value)} placeholder="e.g. Ketua Panitia" className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tanda Tangan (PNG transparan)</label>
                                            <FileUpload accept="image/png" label={`Upload signature — Signer ${idx + 1}`} hint="PNG with transparent background" onFileSelect={(f) => handleSigFile(idx, f)} maxSize={2} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {data.signers.length < 4 && (
                                <p className="text-xs text-slate-500 text-center">
                                    {4 - data.signers.length} slot tersisa • Klik <strong className="text-indigo-400">Add Signer</strong> untuk menambah
                                </p>
                            )}
                        </div>

                        {/* Background Upload */}
                        <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 space-y-5">
                            <h2 className="text-lg font-semibold text-white">Background Image</h2>
                            <FileUpload accept="image/png,image/jpeg" label="Upload certificate background" hint="PNG or JPG, max 5MB" onFileSelect={handleBgFile} />
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div>
                        <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 sticky top-20">
                            <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
                            <div className={`relative ${data.orientasi === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]'} rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 overflow-hidden`}>
                                {bgPreview ? (
                                    <img src={bgPreview} alt="Background" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4">
                                        <div className="w-16 h-0.5 rounded bg-white/10" />
                                        <p className="text-[9px] font-bold text-white/25 mt-2">{data.nama || 'Certificate Title'}</p>
                                        <div className="w-12 h-0.5 rounded bg-white/10 mt-1" />
                                        <p className="text-[7px] text-white/15 text-center px-4 mt-1 max-w-[80%] leading-relaxed">
                                            {data.deskripsi_format.substring(0, 80) || 'Certificate description...'}
                                        </p>
                                        <div className="flex-1" />
                                        {/* Signers Preview */}
                                        <div className={`flex items-end gap-4 ${data.signers.length > 2 ? 'gap-2' : 'gap-6'}`}>
                                            {data.signers.map((s, i) => (
                                                <div key={i} className="text-center">
                                                    <div className="w-8 h-4 rounded bg-white/5 mx-auto mb-0.5" />
                                                    <p className="text-[6px] text-white/20 font-medium">{s.nama || `Signer ${i + 1}`}</p>
                                                    <p className="text-[5px] text-white/10">{s.jabatan || 'Jabatan'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Summary */}
                            <div className="mt-4 space-y-2 text-xs text-slate-400">
                                <div className="flex justify-between"><span>Template</span><span className="text-white">{data.nama || '—'}</span></div>
                                <div className="flex justify-between"><span>Orientation</span><span className="text-white capitalize">{data.orientasi}</span></div>
                                <div className="flex justify-between"><span>Background</span><span className={data.background ? 'text-emerald-400' : 'text-slate-500'}>{data.background ? '✓ Uploaded' : 'Not set'}</span></div>
                                <div className="flex justify-between"><span>Signers</span><span className="text-white">{data.signers.length}</span></div>
                                {data.signers.map((s, i) => (
                                    <div key={i} className="flex justify-between pl-3 border-l-2 border-indigo-500/20">
                                        <span className="text-slate-500">Signer {i + 1}</span>
                                        <span className={s.nama ? 'text-emerald-400' : 'text-slate-500'}>{s.nama || '—'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <Link href={route('templates.index')} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 transition-all duration-200">Cancel</Link>
                    <button type="submit" disabled={processing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Create Template
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
