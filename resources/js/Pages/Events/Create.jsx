import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function EventsCreate() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        event_date: '',
        organizer: '',
        location: '',
        status: 'draft',
        template_id: '',
    });

    const dummyTemplates = [
        { id: 1, name: 'Template Formal Blue' },
        { id: 2, name: 'Template Modern Green' },
        { id: 3, name: 'Template Elegant Gold' },
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // UI only — no submission
        alert('Form submitted (UI only)\n\n' + JSON.stringify(form, null, 2));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Event" />

            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Link href={route('events.index')} className="hover:text-white transition-colors">Events</Link>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span className="text-slate-200">Create</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Create New Event</h1>
                <p className="text-sm text-slate-400 mt-1">Set up a new event, workshop, or seminar</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Event Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Workshop Docker Fundamentals"
                            className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe the event details..."
                            className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Date + Organizer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="event_date" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Event Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="event_date"
                                name="event_date"
                                type="date"
                                value={form.event_date}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="organizer" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Organizer / Penyelenggara <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="organizer"
                                name="organizer"
                                type="text"
                                value={form.organizer}
                                onChange={handleChange}
                                placeholder="e.g. IT Department"
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Lokasi <span className="text-slate-500 text-xs font-normal">(opsional — masuk ke sertifikat)</span>
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="e.g. Gedung A, Universitas XYZ"
                            className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Template + Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="template_id" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Certificate Template
                            </label>
                            <select
                                id="template_id"
                                name="template_id"
                                value={form.template_id}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select template...</option>
                                {dummyTemplates.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-6">
                    <Link
                        href={route('events.index')}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 transition-all duration-200"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create Event
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
