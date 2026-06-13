import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CertificatesGenerate({ events, templates }) {
    const { data, setData, post, processing, errors } = useForm({
        event_id: '',
        template_id: '',
    });

    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setData((prev) => ({
            ...prev,
            event_id: event.id,
        }));
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        post(route('certificates.generate.store'));
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

            <form onSubmit={handleGenerate} className="max-w-3xl space-y-6">
                {/* Event Selection */}
                <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Select Event</h2>
                    {events.length > 0 ? (
                        <div className="space-y-3">
                            {events.map((event) => (
                                <button
                                    key={event.id}
                                    type="button"
                                    onClick={() => handleSelectEvent(event)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selectedEvent?.id === event.id ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">{event.nama}</p>
                                            <p className="text-xs text-slate-400 mt-1">Organizer: {event.penyelenggara}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold font-mono text-white">{event.participants ? event.participants.length : 0}</p>
                                            <p className="text-xs text-slate-400">participants</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">No events found in database. Create an event first.</p>
                    )}
                    {errors.event_id && <p className="text-red-400 text-xs mt-1">{errors.event_id}</p>}
                </div>

                {/* Generate Action */}
                {selectedEvent && (
                    <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Generate Certificates</h2>
                                <p className="text-sm text-slate-400 mt-1">{selectedEvent.nama}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold font-mono text-white">{selectedEvent.participants ? selectedEvent.participants.length : 0}</p>
                                <p className="text-xs text-slate-400">certificates to generate</p>
                            </div>
                        </div>

                        {/* Template Select */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Select Certificate Template <span className="text-red-400">*</span></label>
                            {templates.length > 0 ? (
                                <select
                                    value={data.template_id}
                                    onChange={(e) => setData('template_id', e.target.value)}
                                    className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Choose a template...</option>
                                    {templates.map((t) => (
                                        <option key={t.id} value={t.id}>{t.nama} ({t.orientasi})</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm text-amber-400 italic">No templates found. Please create a certificate template first.</p>
                            )}
                            {errors.template_id && <p className="text-red-400 text-xs mt-1">{errors.template_id}</p>}
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                                <p className="text-xs text-slate-400">Format</p>
                                <p className="text-sm font-medium text-white mt-1">PDF + QR</p>
                            </div>
                            <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                                <p className="text-xs text-slate-400">Numbering</p>
                                <p className="text-sm font-medium text-white mt-1">Auto</p>
                            </div>
                            <div className="rounded-lg bg-slate-700/30 p-3 text-center">
                                <p className="text-xs text-slate-400">Target Disk</p>
                                <p className="text-sm font-medium text-white mt-1">Public Storage</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing || !data.template_id}
                                className={`flex-grow inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white shadow-lg transition-all ${processing ? 'bg-slate-700 cursor-wait opacity-75' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/25'}`}
                            >
                                {processing ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                        Generating Certificates...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                                        🚀 Generate All Certificates
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </AuthenticatedLayout>
    );
}
