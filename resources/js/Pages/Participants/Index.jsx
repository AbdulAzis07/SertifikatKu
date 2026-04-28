import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import DetailModal from '@/Components/UI/DetailModal';
import FormModal from '@/Components/UI/FormModal';
import ConfirmModal from '@/Components/UI/ConfirmModal';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const dummyParticipants = [
    { id: 1, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@email.com', phone: '081234567890', position: 'Peserta', award: 'Best Presenter', event: 'Workshop Docker Fundamentals', event_id: 1, certificate: 'CERT/WS-DOCKER/2026/001' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti.nur@email.com', phone: '082345678901', position: 'Peserta', award: null, event: 'Workshop Docker Fundamentals', event_id: 1, certificate: 'CERT/WS-DOCKER/2026/002' },
    { id: 3, name: 'Budi Santoso', email: 'budi.s@email.com', phone: '083456789012', position: 'Pemateri', award: null, event: 'Seminar AI', event_id: 2, certificate: 'CERT/SEM-AI/2026/015' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi.l@email.com', phone: '084567890123', position: 'Peserta', award: null, event: 'Webinar React & Next.js', event_id: 3, certificate: null },
    { id: 5, name: 'Rudi Hermawan', email: 'rudi.h@email.com', phone: null, position: 'Moderator', award: null, event: 'Seminar AI', event_id: 2, certificate: 'CERT/SEM-AI/2026/016' },
    { id: 6, name: 'Rina Wati', email: 'rina.w@email.com', phone: '086789012345', position: 'Peserta', award: 'Juara 1', event: 'Workshop Docker Fundamentals', event_id: 1, certificate: 'CERT/WS-DOCKER/2026/003' },
    { id: 7, name: 'Agus Priyanto', email: 'agus.p@email.com', phone: '087890123456', position: 'Peserta', award: null, event: 'Training Cybersecurity', event_id: 4, certificate: null },
    { id: 8, name: 'Maya Sari', email: 'maya.s@email.com', phone: '088901234567', position: 'Panitia', award: null, event: 'Workshop Docker Fundamentals', event_id: 1, certificate: 'CERT/WS-DOCKER/2026/004' },
    { id: 9, name: 'Hendra Gunawan', email: 'hendra.g@email.com', phone: null, position: 'Peserta', award: 'Juara 2', event: 'Seminar AI', event_id: 2, certificate: 'CERT/SEM-AI/2026/017' },
    { id: 10, name: 'Fitri Rahmawati', email: 'fitri.r@email.com', phone: '080123456789', position: 'Peserta', award: null, event: 'Webinar React & Next.js', event_id: 3, certificate: null },
    { id: 11, name: 'Doni Pratama', email: 'doni.p@email.com', phone: '081111222333', position: 'Peserta', award: 'Best Project', event: 'Workshop Docker Fundamentals', event_id: 1, certificate: 'CERT/WS-DOCKER/2026/005' },
    { id: 12, name: 'Lina Marlina', email: 'lina.m@email.com', phone: '082222333444', position: 'Peserta', award: null, event: 'Bootcamp Data Science', event_id: 7, certificate: 'CERT/BC-DS/2026/008' },
];

const positionOptions = ['Peserta', 'Pemateri', 'Moderator', 'Panitia', 'Pembicara', 'Instruktur', 'Mentor'];
const events = ['All Events', 'Workshop Docker Fundamentals', 'Seminar AI', 'Webinar React & Next.js', 'Training Cybersecurity', 'Bootcamp Data Science'];

const PositionBadge = ({ position }) => {
    const colors = {
        Peserta: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20',
        Pemateri: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
        Moderator: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
        Panitia: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
        Pembicara: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
        Instruktur: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
        Mentor: 'bg-teal-400/10 text-teal-400 border-teal-400/20',
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

export default function ParticipantsIndex() {
    const [viewItem, setViewItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const [eventFilter, setEventFilter] = useState('All Events');

    const filtered = eventFilter === 'All Events' ? dummyParticipants : dummyParticipants.filter((p) => p.event === eventFilter);

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
                onView={(item) => setViewItem(item)} onEdit={(item) => setEditItem(item)} onDelete={(item) => setDeleteItem(item)}
                filters={
                    <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="rounded-lg bg-slate-700/50 border-white/10 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        {events.map((e) => <option key={e} value={e}>{e}</option>)}
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
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-white text-sm">{viewItem.phone || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Event</p>
                                <p className="text-white text-sm">{viewItem.event}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Certificate</p>
                                {viewItem.certificate ? <p className="text-indigo-400 font-mono text-sm">{viewItem.certificate}</p> : <p className="text-slate-500 text-sm">Not generated yet</p>}
                            </div>
                        </div>
                    </div>
                )}
            </DetailModal>

            {/* Edit Modal */}
            <FormModal show={!!editItem} onClose={() => setEditItem(null)} onSubmit={() => setEditItem(null)} title="Edit Participant" submitText="Save Changes">
                {editItem && (
                    <>
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Nama</label><input type="text" defaultValue={editItem.name} className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" /></div>
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label><input type="email" defaultValue={editItem.email} className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" /></div>
                        <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label><input type="text" defaultValue={editItem.phone || ''} placeholder="Optional" className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Sebagai / Posisi <span className="text-red-400">*</span></label>
                                <select defaultValue={editItem.position} className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                    {positionOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Penghargaan <span className="text-slate-500 text-xs font-normal">(opsional)</span></label>
                                <input type="text" defaultValue={editItem.award || ''} placeholder="e.g. Juara 1, Best Presenter" className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                            </div>
                        </div>
                    </>
                )}
            </FormModal>

            <ConfirmModal show={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={() => setDeleteItem(null)} title="Delete Participant" message={deleteItem ? `Are you sure you want to delete "${deleteItem.name}"? Their certificate will also be removed.` : ''} confirmText="Delete" />
        </AuthenticatedLayout>
    );
}
