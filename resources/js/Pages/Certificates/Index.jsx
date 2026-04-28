import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DataTable from '@/Components/DataTable';
import DetailModal from '@/Components/UI/DetailModal';
import ConfirmModal from '@/Components/UI/ConfirmModal';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const dummyCertificates = [
    { id: 1, certificate_number: 'CERT/WS-DOCKER/2026/001', participant: 'Ahmad Fauzi', event: 'Workshop Docker', issued_at: '2026-04-20', status: 'valid' },
    { id: 2, certificate_number: 'CERT/WS-DOCKER/2026/002', participant: 'Siti Nurhaliza', event: 'Workshop Docker', issued_at: '2026-04-20', status: 'valid' },
    { id: 3, certificate_number: 'CERT/SEM-AI/2026/015', participant: 'Budi Santoso', event: 'Seminar AI', issued_at: '2026-04-18', status: 'valid' },
    { id: 4, certificate_number: 'CERT/WB-REACT/2026/008', participant: 'Dewi Lestari', event: 'Webinar React', issued_at: '2026-04-15', status: 'revoked' },
    { id: 5, certificate_number: 'CERT/SEM-AI/2026/016', participant: 'Rudi Hermawan', event: 'Seminar AI', issued_at: '2026-04-18', status: 'valid' },
    { id: 6, certificate_number: 'CERT/WS-DOCKER/2026/003', participant: 'Rina Wati', event: 'Workshop Docker', issued_at: '2026-04-20', status: 'valid' },
    { id: 7, certificate_number: 'CERT/WS-DOCKER/2026/004', participant: 'Maya Sari', event: 'Workshop Docker', issued_at: '2026-04-20', status: 'valid' },
    { id: 8, certificate_number: 'CERT/BC-DS/2026/008', participant: 'Lina Marlina', event: 'Bootcamp Data Science', issued_at: '2026-03-15', status: 'valid' },
    { id: 9, certificate_number: 'CERT/WS-LARAVEL/2026/012', participant: 'Joko Widodo', event: 'Workshop Laravel', issued_at: '2026-03-28', status: 'revoked' },
    { id: 10, certificate_number: 'CERT/SEM-AI/2026/017', participant: 'Hendra Gunawan', event: 'Seminar AI', issued_at: '2026-04-18', status: 'valid' },
    { id: 11, certificate_number: 'CERT/WS-DOCKER/2026/005', participant: 'Doni Pratama', event: 'Workshop Docker', issued_at: '2026-04-20', status: 'valid' },
    { id: 12, certificate_number: 'CERT/BC-DS/2026/009', participant: 'Andi Susanto', event: 'Bootcamp Data Science', issued_at: '2026-03-15', status: 'valid' },
];

const StatusBadge = ({ status }) => {
    const s = { valid: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20', revoked: 'bg-red-400/10 text-red-400 border-red-400/20' };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s[status]}`}>{status === 'valid' ? '✓ Valid' : '✕ Revoked'}</span>;
};

const columns = [
    { key: 'certificate_number', label: 'Number', render: (val) => <span className="font-mono text-indigo-400 text-xs">{val}</span> },
    { key: 'participant', label: 'Recipient', render: (val) => <span className="font-medium text-white">{val}</span> },
    { key: 'event', label: 'Event' },
    { key: 'issued_at', label: 'Issued', render: (val) => <span className="font-mono">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
];

export default function CertificatesIndex() {
    const [viewCert, setViewCert] = useState(null);
    const [revokeCert, setRevokeCert] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('all');

    const events = [...new Set(dummyCertificates.map((c) => c.event))];
    let filtered = dummyCertificates;
    if (statusFilter !== 'all') filtered = filtered.filter((c) => c.status === statusFilter);
    if (eventFilter !== 'all') filtered = filtered.filter((c) => c.event === eventFilter);

    const validCount = dummyCertificates.filter((c) => c.status === 'valid').length;
    const revokedCount = dummyCertificates.filter((c) => c.status === 'revoked').length;

    return (
        <AuthenticatedLayout>
            <Head title="Certificates" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Certificates</h1>
                    <p className="text-sm text-slate-400 mt-1">View and manage generated certificates</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={route('certificates.generate')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                        Generate
                    </Link>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-white/10 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        Download ZIP
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-4 text-center">
                    <p className="text-2xl font-bold text-white font-mono">{dummyCertificates.length}</p>
                    <p className="text-xs text-slate-400">Total</p>
                </div>
                <div className="rounded-xl bg-emerald-400/5 border border-emerald-400/20 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400 font-mono">{validCount}</p>
                    <p className="text-xs text-slate-400">Valid</p>
                </div>
                <div className="rounded-xl bg-red-400/5 border border-red-400/20 p-4 text-center">
                    <p className="text-2xl font-bold text-red-400 font-mono">{revokedCount}</p>
                    <p className="text-xs text-slate-400">Revoked</p>
                </div>
            </div>

            <DataTable
                columns={columns} data={filtered} searchPlaceholder="Search certificates..."
                onView={(item) => setViewCert(item)} onDelete={(item) => item.status === 'valid' && setRevokeCert(item)}
                filters={
                    <div className="flex items-center gap-2">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg bg-slate-700/50 border-white/10 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="all">All Status</option><option value="valid">Valid</option><option value="revoked">Revoked</option>
                        </select>
                        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="rounded-lg bg-slate-700/50 border-white/10 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="all">All Events</option>
                            {events.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                }
            />

            {/* View Modal */}
            <DetailModal show={!!viewCert} onClose={() => setViewCert(null)} title="Certificate Details" maxWidth="lg">
                {viewCert && (
                    <div className="space-y-4">
                        <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-center">
                            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Certificate Number</p>
                            <p className="text-lg font-bold font-mono text-white">{viewCert.certificate_number}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Recipient</p><p className="text-white font-medium">{viewCert.participant}</p></div>
                            <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Event</p><p className="text-white text-sm">{viewCert.event}</p></div>
                            <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Issued Date</p><p className="text-white font-mono text-sm">{viewCert.issued_at}</p></div>
                            <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p><StatusBadge status={viewCert.status} /></div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 border border-indigo-400/20 transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                Download PDF
                            </button>
                            <button className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Preview
                            </button>
                        </div>
                    </div>
                )}
            </DetailModal>

            <ConfirmModal show={!!revokeCert} onClose={() => setRevokeCert(null)} onConfirm={() => setRevokeCert(null)} title="Revoke Certificate" message={revokeCert ? `Are you sure you want to revoke certificate "${revokeCert.certificate_number}"? This will mark it as invalid.` : ''} confirmText="Revoke" variant="warning" />
        </AuthenticatedLayout>
    );
}
