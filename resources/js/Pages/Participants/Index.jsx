import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import DetailModal from '@/Components/UI/DetailModal';
import FormModal from '@/Components/UI/FormModal';
import ConfirmModal from '@/Components/UI/ConfirmModal';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const PositionBadge = ({ position }) => {
    const colors = {
        Peserta: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20',
        Pemateri: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
        Moderator: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
        Panitia: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
        Juri: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors[position] || 'bg-slate-400/10 text-slate-400 border-slate-400/20'}`}>{position}</span>;
};

const columns = [
    { key: 'name', label: 'Nama', render: (val) => <span className="font-medium text-white">{val}</span> },
    { key: 'email', label: 'Email' },
    { key: 'position', label: 'Sebagai', render: (val) => <PositionBadge position={val} /> },
    { key: 'award', label: 'Penghargaan', render: (val) => val ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20">🏆 {val}</span> : <span className="text-slate-600">—</span> },
    { key: 'event', label: 'Event' },
    { key: 'certificate', label: 'Sertifikat', render: (val) => val ? <span className="text-xs font-mono text-indigo-400">{val}</span> : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-400/10 text-slate-400 border border-slate-400/20">Pending</span> },
];

export default function ParticipantsIndex({ participants, events }) {
    const [viewItem, setViewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [eventFilter, setEventFilter] = useState('all');

    const { data, setData, put, delete: destroy, reset, errors } = useForm({
        event_id: '',
        nama: '',
        email: '',
        posisi: 'peserta',
        penghargaan: '',
    });

    const openEdit = (item) => {
        setEditItem(item);
        setData({
            event_id: item.event_id || '',
            nama: item.name || '',
            email: item.email || '',
            posisi: item.position ? item.position.toLowerCase() : 'peserta',
            penghargaan: item.award || '',
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        put(route('participants.update', editItem.id), {
            onSuccess: () => {
                setEditItem(null);
                reset();
            }
        });
    };

    const handleDelete = () => {
        destroy(route('participants.destroy', deleteItem.id), {
            onSuccess: () => {
                setDeleteItem(null);
            }
        });
    };

    const filtered = eventFilter === 'all'
        ? participants
        : participants.filter((p) => String(p.event_id) === String(eventFilter));

    return (
        <AuthenticatedLayout>
            <Head title="Participants" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Participants</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage event participants</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={route('participants.import')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                        Import Excel
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns} data={filtered} searchPlaceholder="Search participants..."
                onView={(item) => setViewItem(item)} onEdit={(item) => openEdit(item)} onDelete={(item) => setDeleteItem(item)}
                filters={
                    <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="rounded-lg bg-slate-700/50 border-white/10 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="all">All Events</option>
                        {events.map((e) => <option key={e.id} value={String(e.id)}>{e.nama}</option>)}
                    </select>
                }
            />

            {/* View Modal */}
            <DetailModal show={!!viewItem} onClose={() => setViewItem(null)} title="Participant Details">
                {viewItem && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">{viewItem.name.charAt(0)}</div>
                            <div>
                                <p className="text-lg font-semibold text-white">{viewItem.name}</p>
                                <p className="text-sm text-slate-400">{viewItem.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sebagai / Posisi</p>
                                <PositionBadge position={viewItem.position} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Penghargaan</p>
                                {viewItem.award ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20">🏆 {viewItem.award}</span>
                                ) : (
                                    <p className="text-slate-500 text-sm">—</p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Event</p>
                                <p className="text-white text-sm">{viewItem.event}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Certificate</p>
                                {viewItem.certificate ? <p className="text-indigo-400 font-mono text-sm">{viewItem.certificate}</p> : <p className="text-slate-500 text-sm">Not generated yet</p>}
                            </div>
                        </div>
                    </div>
                )}
            </DetailModal>

            {/* Edit Modal */}
            <FormModal show={!!editItem} onClose={() => setEditItem(null)} onSubmit={handleEdit} title="Edit Participant" submitText="Save Changes">
                {editItem && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nama</label>
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
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Event <span className="text-red-400">*</span></label>
                            <select
                                value={data.event_id}
                                onChange={(e) => setData('event_id', e.target.value)}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Event...</option>
                                {events.map((e) => <option key={e.id} value={e.id}>{e.nama}</option>)}
                            </select>
                            {errors.event_id && <p className="text-red-400 text-xs mt-1">{errors.event_id}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Sebagai / Posisi <span className="text-red-400">*</span></label>
                                <select
                                    value={data.posisi}
                                    onChange={(e) => setData('posisi', e.target.value)}
                                    className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                >
                                    <option value="peserta">Peserta</option>
                                    <option value="pemateri">Pemateri</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="panitia">Panitia</option>
                                    <option value="juri">Juri</option>
                                </select>
                                {errors.posisi && <p className="text-red-400 text-xs mt-1">{errors.posisi}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Penghargaan <span className="text-slate-500 text-xs font-normal">(opsional)</span></label>
                                <input
                                    type="text"
                                    value={data.penghargaan}
                                    onChange={(e) => setData('penghargaan', e.target.value)}
                                    placeholder="e.g. Juara 1, Best Presenter"
                                    className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                {errors.penghargaan && <p className="text-red-400 text-xs mt-1">{errors.penghargaan}</p>}
                            </div>
                        </div>
                    </>
                )}
            </FormModal>

            <ConfirmModal show={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Participant" message={deleteItem ? `Are you sure you want to delete "${deleteItem.name}"? Their certificate will also be removed.` : ''} confirmText="Delete" />
        </AuthenticatedLayout>
    );
}
