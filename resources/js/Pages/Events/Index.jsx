import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import DetailModal from '@/Components/UI/DetailModal';
import FormModal from '@/Components/UI/FormModal';
import ConfirmModal from '@/Components/UI/ConfirmModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

// ── Dummy Data ──────────────────────────────────────────────
const dummyEvents = [
    { id: 1, title: 'Workshop Docker Fundamentals', description: 'Learn Docker containerization from scratch including Dockerfile, Docker Compose, and deployment strategies.', event_date: '2026-04-20', organizer: 'IT Department', location: 'Gedung A, Universitas XYZ', status: 'completed', participants: 45, template: 'Template Formal Blue' },
    { id: 2, title: 'Seminar Artificial Intelligence', description: 'Introduction to AI, Machine Learning, and Deep Learning for industry applications.', event_date: '2026-04-18', organizer: 'CS Faculty', location: 'Aula Utama, Kampus B', status: 'completed', participants: 120, template: 'Template Modern Green' },
    { id: 3, title: 'Webinar React & Next.js', description: 'Building modern web applications with React 18 and Next.js 14 framework.', event_date: '2026-05-05', organizer: 'Web Dev Community', location: 'Online (Zoom)', status: 'active', participants: 78, template: 'Template Elegant Gold' },
    { id: 4, title: 'Training Cybersecurity', description: 'Hands-on cybersecurity training covering penetration testing and security best practices.', event_date: '2026-05-12', organizer: 'Security Lab', location: 'Lab Komputer Lt.3', status: 'active', participants: 35, template: 'Template Formal Blue' },
    { id: 5, title: 'Workshop UI/UX Design', description: 'Learn the principles of user interface and user experience design using Figma.', event_date: '2026-05-20', organizer: 'Design Studio', location: '', status: 'draft', participants: 0, template: 'Template Modern Green' },
    { id: 6, title: 'Seminar Cloud Computing', description: 'AWS, Azure, and GCP cloud services for enterprise solutions.', event_date: '2026-06-01', organizer: 'IT Department', location: '', status: 'draft', participants: 0, template: null },
    { id: 7, title: 'Bootcamp Data Science', description: 'Intensive data science bootcamp covering Python, Pandas, and visualization.', event_date: '2026-03-15', organizer: 'Data Lab', location: 'Ruang Seminar C', status: 'completed', participants: 52, template: 'Template Elegant Gold' },
    { id: 8, title: 'Workshop Laravel Advanced', description: 'Advanced Laravel patterns including queues, events, and microservices.', event_date: '2026-03-28', organizer: 'PHP Community', location: 'Gedung B, Universitas XYZ', status: 'completed', participants: 38, template: 'Template Formal Blue' },
];

// ── Status Badge ────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const styles = {
        draft: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
        active: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
        completed: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20',
    };
    const icons = { draft: '○', active: '●', completed: '✓' };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// ── Table Columns ───────────────────────────────────────────
const columns = [
    { key: 'title', label: 'Event Title' },
    { key: 'event_date', label: 'Date', render: (val) => <span className="font-mono">{val}</span> },
    { key: 'organizer', label: 'Organizer' },
    { key: 'participants', label: 'Participants', render: (val) => <span className="font-mono">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
];

export default function EventsIndex({ events }) {
    const [viewEvent, setViewEvent] = useState(null);
    const [editEvent, setEditEvent] = useState(null);
    const [deleteEvent, setDeleteEvent] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const { data, setData, put, delete: destroy, reset } = useForm({
        nama: '',
        penyelenggara: '',
        lokasi: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        deskripsi: '',
        kategori: 'seminar',
    });

    const filteredEvents = statusFilter === 'all'
        ? events
        : events.filter((e) => e.status === statusFilter);

    const openEdit = (item) => {
        setEditEvent(item);
        setData({
            nama: item.title || '',
            penyelenggara: item.organizer || '',
            lokasi: item.location || '',
            tanggal_mulai: item.event_date || '',
            tanggal_selesai: item.tanggal_selesai || item.event_date || '',
            deskripsi: item.description || '',
            kategori: item.kategori || 'seminar',
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        put(route('events.update', editEvent.id), {
            onSuccess: () => {
                setEditEvent(null);
                reset();
            }
        });
    };

    const handleDelete = () => {
        destroy(route('events.destroy', deleteEvent.id), {
            onSuccess: () => {
                setDeleteEvent(null);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Events" />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Events</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage your events, workshops, and seminars</p>
                </div>
                <Link
                    href={route('events.create')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create Event
                </Link>
            </div>

            {/* DataTable with Filter */}
            <DataTable
                columns={columns}
                data={filteredEvents}
                searchPlaceholder="Search events..."
                onView={(item) => setViewEvent(item)}
                onEdit={(item) => openEdit(item)}
                onDelete={(item) => setDeleteEvent(item)}
                filters={
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg bg-slate-700/50 border-white/10 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                }
            />

            {/* View Detail Modal */}
            <DetailModal
                show={!!viewEvent}
                onClose={() => setViewEvent(null)}
                title="Event Details"
                maxWidth="lg"
            >
                {viewEvent && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Title</p>
                            <p className="text-white font-medium">{viewEvent.title}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Description</p>
                            <p className="text-slate-300 text-sm">{viewEvent.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                                <p className="text-white font-mono text-sm">{viewEvent.event_date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Organizer</p>
                                <p className="text-white text-sm">{viewEvent.organizer}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Location</p>
                                <p className="text-white text-sm">{viewEvent.location || <span className="text-slate-500 italic">Belum diisi</span>}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Participants</p>
                                <p className="text-white font-mono text-sm">{viewEvent.participants}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                <StatusBadge status={viewEvent.status} />
                            </div>
                        </div>
                        {viewEvent.template && (
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Template</p>
                                <p className="text-white text-sm">{viewEvent.template}</p>
                            </div>
                        )}
                    </div>
                )}
            </DetailModal>

            {/* Edit Form Modal */}
            <FormModal
                show={!!editEvent}
                onClose={() => setEditEvent(null)}
                onSubmit={handleEdit}
                title="Edit Event"
                submitText="Save Changes"
            >
                {editEvent && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                            {errors.nama && <p className="text-red-400 text-xs mt-1">{errors.nama}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {errors.deskripsi && <p className="text-red-400 text-xs mt-1">{errors.deskripsi}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
                                <input
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                                {errors.tanggal_mulai && <p className="text-red-400 text-xs mt-1">{errors.tanggal_mulai}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Organizer / Penyelenggara</label>
                                <input
                                    type="text"
                                    value={data.penyelenggara}
                                    onChange={(e) => setData('penyelenggara', e.target.value)}
                                    className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                                {errors.penyelenggara && <p className="text-red-400 text-xs mt-1">{errors.penyelenggara}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Lokasi <span className="text-slate-500 text-xs font-normal">(opsional)</span></label>
                            <input
                                type="text"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                placeholder="e.g. Gedung A, Universitas XYZ"
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            {errors.lokasi && <p className="text-red-400 text-xs mt-1">{errors.lokasi}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Kategori</label>
                            <select
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
                    </>
                )}
            </FormModal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={!!deleteEvent}
                onClose={() => setDeleteEvent(null)}
                onConfirm={handleDelete}
                title="Delete Event"
                message={deleteEvent ? `Are you sure you want to delete "${deleteEvent.title}"? This action cannot be undone.` : ''}
                confirmText="Delete Event"
            />
        </AuthenticatedLayout>
    );
}
