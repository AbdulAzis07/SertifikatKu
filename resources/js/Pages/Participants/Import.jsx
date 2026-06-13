import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FileUpload from '@/Components/UI/FileUpload';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ParticipantsImport({ events }) {
    const { data, setData, post, processing, errors } = useForm({
        event_id: '',
        file: null,
    });

    const handleImport = (e) => {
        e.preventDefault();
        post(route('participants.import.store'));
    };

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

            <form onSubmit={handleImport} className="max-w-4xl space-y-6">
                {/* Step 1: Download Template */}
                <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold text-sm">1</div>
                        <div className="flex-1">
                            <h2 className="text-sm font-semibold text-white">Download Template</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Use our CSV template to ensure correct data format</p>
                        </div>
                        <a
                            href={route('participants.template')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            Download Template CSV
                        </a>
                    </div>
                    <div className="mt-4 rounded-lg bg-slate-700/30 p-3 overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="text-slate-400"><th className="text-left py-1 px-2">Nama *</th><th className="text-left py-1 px-2">Email *</th><th className="text-left py-1 px-2">Posisi *</th><th className="text-left py-1 px-2">Penghargaan</th></tr></thead>
                            <tbody className="text-slate-300"><tr><td className="py-1 px-2">John Doe</td><td className="py-1 px-2">john@example.com</td><td className="py-1 px-2">Peserta</td><td className="py-1 px-2">Best Presenter</td></tr></tbody>
                        </table>
                    </div>
                </div>

                {/* Step 2: Upload */}
                <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-sm">2</div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Select Event & Upload File</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Select the target event and upload your Excel/CSV file</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Event <span className="text-red-400">*</span></label>
                        <select
                            value={data.event_id}
                            onChange={(e) => setData('event_id', e.target.value)}
                            className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select event...</option>
                            {events.map((e) => (
                                <option key={e.id} value={e.id}>{e.nama}</option>
                            ))}
                        </select>
                        {errors.event_id && <p className="text-red-400 text-xs mt-1">{errors.event_id}</p>}
                    </div>

                    <FileUpload accept=".xlsx,.xls,.csv" label="Upload Excel / CSV file" hint="Supports .xlsx, .xls, .csv" onFileSelect={(f) => setData('file', f)} preview={false} />
                    {errors.file && <p className="text-red-400 text-xs mt-1">{errors.file}</p>}
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 mt-4">
                    <Link href={route('participants.index')} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-white/10 transition-all">Cancel</Link>
                    <button type="submit" disabled={processing || !data.file || !data.event_id} className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white shadow-lg transition-all bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/25 disabled:opacity-50`}>
                        {processing ? 'Importing...' : 'Import Participants'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
