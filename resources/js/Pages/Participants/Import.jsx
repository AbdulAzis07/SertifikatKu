import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FileUpload from '@/Components/UI/FileUpload';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const dummyPreview = [
    { row: 1, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@email.com', phone: '081234567890', position: 'Peserta', award: 'Best Presenter', valid: true },
    { row: 2, name: 'Siti Nurhaliza', email: 'siti.nur@email.com', phone: '082345678901', position: 'Peserta', award: '', valid: true },
    { row: 3, name: 'Budi Santoso', email: 'budi.s@email.com', phone: '083456789012', position: 'Pemateri', award: '', valid: true },
    { row: 4, name: 'Dewi Lestari', email: 'dewi.l@email.com', phone: '', position: 'Peserta', award: '', valid: true },
    { row: 5, name: '', email: 'invalid@email.com', phone: '085678901234', position: 'Peserta', award: '', valid: false },
    { row: 6, name: 'Rudi Hermawan', email: 'rudi.h@email.com', phone: '', position: 'Moderator', award: '', valid: true },
    { row: 7, name: 'Rina Wati', email: 'rina.w@email.com', phone: '087890123456', position: 'Peserta', award: 'Juara 1', valid: true },
    { row: 8, name: 'Agus Priyanto', email: 'not-an-email', phone: '088901234567', position: 'Peserta', award: '', valid: false },
];

export default function ParticipantsImport() {
    const [file, setFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [importing, setImporting] = useState(false);
    const [imported, setImported] = useState(false);

    const handleFile = (f) => {
        setFile(f);
        setShowPreview(!!f);
        setImported(false);
    };

    const handleImport = () => {
        setImporting(true);
        setTimeout(() => { setImporting(false); setImported(true); }, 2000);
    };

    const validCount = dummyPreview.filter((r) => r.valid).length;
    const invalidCount = dummyPreview.filter((r) => !r.valid).length;

    return (
        <AuthenticatedLayout>
            <Head title="Import Participants" />

            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Link href={route('participants.index')} className="hover:text-white transition-colors">Participants</Link>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    <span className="text-slate-200">Import</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Import Participants</h1>
                <p className="text-sm text-slate-400 mt-1">Upload an Excel or CSV file to import participants in bulk</p>
            </div>

            <div className="max-w-4xl space-y-6">
                {/* Step 1: Download Template */}
                <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold text-sm">1</div>
                        <div className="flex-1">
                            <h2 className="text-sm font-semibold text-white">Download Template</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Use our Excel template to ensure correct data format</p>
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            Download .xlsx
                        </button>
                    </div>
                    <div className="mt-4 rounded-lg bg-slate-700/30 p-3 overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="text-slate-400"><th className="text-left py-1 px-2">name *</th><th className="text-left py-1 px-2">email *</th><th className="text-left py-1 px-2">phone</th><th className="text-left py-1 px-2">position *</th><th className="text-left py-1 px-2">award</th></tr></thead>
                            <tbody className="text-slate-300"><tr><td className="py-1 px-2">John Doe</td><td className="py-1 px-2">john@example.com</td><td className="py-1 px-2">081234567890</td><td className="py-1 px-2">Peserta</td><td className="py-1 px-2">Best Presenter</td></tr></tbody>
                        </table>
                    </div>
                </div>

                {/* Step 2: Upload */}
                <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-sm">2</div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Upload File</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Select your filled Excel or CSV file</p>
                        </div>
                    </div>
                    <FileUpload accept=".xlsx,.xls,.csv" label="Upload Excel / CSV file" hint="Supports .xlsx, .xls, .csv" onFileSelect={handleFile} preview={false} />
                </div>

                {/* Step 3: Preview */}
                {showPreview && (
                    <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-sm">3</div>
                            <div className="flex-1">
                                <h2 className="text-sm font-semibold text-white">Preview Data</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Review before importing</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="px-2 py-1 rounded-md bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">{validCount} valid</span>
                                {invalidCount > 0 && <span className="px-2 py-1 rounded-md bg-red-400/10 text-red-400 border border-red-400/20">{invalidCount} errors</span>}
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-white/5">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase">#</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase">Phone</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase">Sebagai</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase">Penghargaan</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {dummyPreview.map((row) => (
                                        <tr key={row.row} className={row.valid ? '' : 'bg-red-400/5'}>
                                            <td className="px-4 py-2 text-slate-500 font-mono text-xs">{row.row}</td>
                                            <td className={`px-4 py-2 ${!row.name ? 'text-red-400 italic' : 'text-slate-300'}`}>{row.name || 'Empty'}</td>
                                            <td className={`px-4 py-2 ${!row.email.includes('@') || !row.email.includes('.') ? 'text-red-400' : 'text-slate-300'}`}>{row.email}</td>
                                            <td className="px-4 py-2 text-slate-300">{row.phone || <span className="text-slate-600">—</span>}</td>
                                            <td className="px-4 py-2 text-slate-300">{row.position}</td>
                                            <td className="px-4 py-2">{row.award ? <span className="text-amber-400 text-xs">🏆 {row.award}</span> : <span className="text-slate-600">—</span>}</td>
                                            <td className="px-4 py-2">{row.valid ? <span className="text-emerald-400 text-xs">✓ Valid</span> : <span className="text-red-400 text-xs">✕ Error</span>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button onClick={() => { setShowPreview(false); setFile(null); }} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-white/10 transition-all">Cancel</button>
                            <button onClick={handleImport} disabled={importing || imported} className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white shadow-lg transition-all ${imported ? 'bg-emerald-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/25'} ${importing && 'opacity-75 cursor-wait'}`}>
                                {importing ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Importing...</>) : imported ? (<>✓ Imported {validCount} participants</>) : (<>Import {validCount} Participants</>)}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
