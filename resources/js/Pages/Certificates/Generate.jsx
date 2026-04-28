import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const dummyEvents = [
    { id: 1, title: 'Workshop Docker Fundamentals', participants: 45, template: 'Template Formal Blue', generated: 45, date: '2026-04-20' },
    { id: 2, title: 'Seminar Artificial Intelligence', participants: 120, template: 'Template Modern Green', generated: 0, date: '2026-04-18' },
    { id: 3, title: 'Webinar React & Next.js', participants: 78, template: 'Template Elegant Gold', generated: 0, date: '2026-05-05' },
    { id: 4, title: 'Training Cybersecurity', participants: 35, template: 'Template Formal Blue', generated: 0, date: '2026-05-12' },
];

export default function CertificatesGenerate() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);

    const handleGenerate = () => {
        if (!selectedEvent) return;
        setGenerating(true);
        setProgress(0);
        setCompleted(false);
        const total = selectedEvent.participants;
        let current = 0;
        const interval = setInterval(() => {
            current += Math.ceil(total / 20);
            if (current >= total) { current = total; clearInterval(interval); setTimeout(() => { setGenerating(false); setCompleted(true); }, 500); }
            setProgress(Math.round((current / total) * 100));
        }, 150);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Generate Certificates" />

            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Link href={route('certificates.index')} className="hover:text-white transition-colors">Certificates</Link>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    <span className="text-slate-200">Generate</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Generate Certificates</h1>
                <p className="text-sm text-slate-400 mt-1">Batch generate certificates for event participants</p>
            </div>

            <div className="max-w-3xl space-y-6">
                {/* Event Selection */}
                <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Select Event</h2>
                    <div className="space-y-3">
                        {dummyEvents.map((event) => (
                            <button key={event.id} onClick={() => { setSelectedEvent(event); setCompleted(false); setProgress(0); }}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selectedEvent?.id === event.id ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">{event.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{event.template} • {event.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold font-mono text-white">{event.participants}</p>
                                        <p className="text-xs text-slate-400">participants</p>
                                    </div>
                                </div>
                                {event.generated > 0 && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(event.generated / event.participants) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-emerald-400">{event.generated}/{event.participants}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Action */}
                {selectedEvent && (
                    <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Generate Certificates</h2>
                                <p className="text-sm text-slate-400 mt-1">{selectedEvent.title}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold font-mono text-white">{selectedEvent.participants}</p>
                                <p className="text-xs text-slate-400">certificates to generate</p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                                <p className="text-xs text-slate-400">Template</p>
                                <p className="text-sm font-medium text-white mt-1 truncate">{selectedEvent.template}</p>
                            </div>
                            <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                                <p className="text-xs text-slate-400">Format</p>
                                <p className="text-sm font-medium text-white mt-1">PDF + QR</p>
                            </div>
                            <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                                <p className="text-xs text-slate-400">Numbering</p>
                                <p className="text-sm font-medium text-white mt-1">Auto</p>
                            </div>
                        </div>

                        {/* Progress */}
                        {(generating || completed) && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-slate-300">{completed ? 'Completed!' : 'Generating...'}</p>
                                    <p className="text-sm font-mono text-white">{progress}%</p>
                                </div>
                                <div className="h-3 rounded-full bg-slate-700 overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-300 ${completed ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'}`} style={{ width: `${progress}%` }} />
                                </div>
                                {generating && (
                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                        Processing certificates...
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            {!completed ? (
                                <button onClick={handleGenerate} disabled={generating}
                                    className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white shadow-lg transition-all ${generating ? 'bg-slate-700 cursor-wait opacity-75' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/25'}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                                    🚀 Generate All Certificates
                                </button>
                            ) : (
                                <>
                                    <Link href={route('certificates.index')} className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 transition-all">
                                        ✓ View {selectedEvent.participants} Certificates
                                    </Link>
                                    <button className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-700 border border-white/10 transition-all">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                        ZIP
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
