import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function EventsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        penyelenggara: '',
        lokasi: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        deskripsi: '',
        kategori: 'seminar',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('events.store'));
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
                        <label htmlFor="nama" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Event Title / Nama Event <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="nama"
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            placeholder="e.g. Workshop Docker Fundamentals"
                            className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                        />
                        {errors.nama && <p className="text-red-400 text-xs mt-1">{errors.nama}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="deskripsi" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Description / Deskripsi
                        </label>
                        <textarea
                            id="deskripsi"
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={4}
                            placeholder="Describe the event details..."
                            className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.deskripsi && <p className="text-red-400 text-xs mt-1">{errors.deskripsi}</p>}
                    </div>

                    {/* Date + Organizer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tanggal_mulai" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Tanggal Mulai <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="tanggal_mulai"
                                type="date"
                                value={data.tanggal_mulai}
                                onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                            {errors.tanggal_mulai && <p className="text-red-400 text-xs mt-1">{errors.tanggal_mulai}</p>}
                        </div>
                        <div>
                            <label htmlFor="penyelenggara" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Organizer / Penyelenggara <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="penyelenggara"
                                type="text"
                                value={data.penyelenggara}
                                onChange={(e) => setData('penyelenggara', e.target.value)}
                                placeholder="e.g. IT Department"
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                            {errors.penyelenggara && <p className="text-red-400 text-xs mt-1">{errors.penyelenggara}</p>}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="lokasi" className="block text-sm font-medium text-slate-300 mb-1.5">
                            Lokasi <span className="text-slate-500 text-xs font-normal">(opsional — masuk ke sertifikat)</span>
                        </label>
                        <input
                            id="lokasi"
                            type="text"
                            value={data.lokasi}
                            onChange={(e) => setData('lokasi', e.target.value)}
                            placeholder="e.g. Gedung A, Universitas XYZ"
                            className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {errors.lokasi && <p className="text-red-400 text-xs mt-1">{errors.lokasi}</p>}
                    </div>

                    {/* Kategori + Tanggal Selesai */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="kategori" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Kategori <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="kategori"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="seminar">Seminar</option>
                                <option value="workshop">Workshop</option>
                                <option value="pelatihan">Pelatihan</option>
                                <option value="konferensi">Konferensi</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                            {errors.kategori && <p className="text-red-400 text-xs mt-1">{errors.kategori}</p>}
                        </div>
                        <div>
                            <label htmlFor="tanggal_selesai" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Tanggal Selesai <span className="text-slate-500 text-xs font-normal">(opsional)</span>
                            </label>
                            <input
                                id="tanggal_selesai"
                                type="date"
                                value={data.tanggal_selesai}
                                onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {errors.tanggal_selesai && <p className="text-red-400 text-xs mt-1">{errors.tanggal_selesai}</p>}
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
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50"
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
