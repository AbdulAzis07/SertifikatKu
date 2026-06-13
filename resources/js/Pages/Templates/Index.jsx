import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DetailModal from '@/Components/UI/DetailModal';
import FormModal from '@/Components/UI/FormModal';
import ConfirmModal from '@/Components/UI/ConfirmModal';
import FileUpload from '@/Components/UI/FileUpload';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

const dummyTemplates = [
    { id: 1, name: 'Template Formal Blue', orientation: 'landscape',
      description: 'Telah berhasil mengikuti {event_title} yang diselenggarakan oleh {organizer} pada tanggal {event_date} di {location}',
      signers: [
          { name: 'Dr. Ahmad Dahlan', title: 'Ketua Panitia' },
          { name: 'Prof. Siti Rahayu', title: 'Dekan Fakultas' },
      ],
      color: 'from-blue-600 to-indigo-700', events_count: 5, created_at: '2026-03-10' },
    { id: 2, name: 'Template Modern Green', orientation: 'landscape',
      description: 'Dengan ini menyatakan bahwa {participant_name} telah menyelesaikan {event_title} yang diselenggarakan oleh {organizer}',
      signers: [
          { name: 'Ir. Budi Santoso, M.T.', title: 'Direktur' },
      ],
      color: 'from-emerald-600 to-teal-700', events_count: 3, created_at: '2026-03-15' },
    { id: 3, name: 'Template Elegant Gold', orientation: 'portrait',
      description: 'Certificate of Completion for {event_title} held on {event_date} in {location}',
      signers: [
          { name: 'Dr. Ahmad Dahlan', title: 'Ketua Panitia' },
          { name: 'Prof. Siti Rahayu', title: 'Dekan Fakultas' },
          { name: 'Dewi Lestari, S.Kom.', title: 'Sekretaris' },
      ],
      color: 'from-amber-600 to-orange-700', events_count: 2, created_at: '2026-04-01' },
    { id: 4, name: 'Template Minimalist Dark', orientation: 'landscape',
      description: 'This certifies that {participant_name} has completed {event_title}',
      signers: [
          { name: 'Rudi Hermawan, M.Kom.', title: 'Head of Training' },
          { name: 'Andi Susanto, S.T.', title: 'Supervisor' },
          { name: 'Maya Sari, M.Pd.', title: 'Koordinator' },
          { name: 'Joko Widodo, S.Pd.', title: 'Kepala Sekolah' },
      ],
      color: 'from-slate-600 to-slate-800', events_count: 0, created_at: '2026-04-10' },
];

const OrientationBadge = ({ orientation }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
        orientation === 'landscape' ? 'bg-cyan-400/10 text-cyan-400' : 'bg-purple-400/10 text-purple-400'
    }`}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {orientation === 'landscape' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.75A2.25 2.25 0 013.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6z" />
            )}
        </svg>
        {orientation}
    </span>
);

export default function TemplatesIndex({ templates }) {
    const [viewTemplate, setViewTemplate] = useState(null);
    const [editTemplate, setEditTemplate] = useState(null);
    const [deleteTemplate, setDeleteTemplate] = useState(null);

    const { data, setData, put, reset } = useForm({
        nama: '',
        orientasi: 'landscape',
        deskripsi_format: '',
        signers: [],
    });

    const openEdit = (tpl) => {
        setEditTemplate(tpl);
        setData({
            nama: tpl.name || '',
            orientasi: tpl.orientation || 'landscape',
            deskripsi_format: tpl.description || '',
            signers: tpl.signers.map(s => ({ nama: s.name, jabatan: s.title })),
        });
    };

    const addEditSigner = () => {
        if (data.signers.length < 4) {
            setData('signers', [...data.signers, { nama: '', jabatan: '' }]);
        }
    };

    const removeEditSigner = (idx) => {
        if (data.signers.length > 1) {
            setData('signers', data.signers.filter((_, i) => i !== idx));
        }
    };

    const handleEditSignerChange = (idx, field, value) => {
        const updated = [...data.signers];
        updated[idx][field === 'name' ? 'nama' : 'jabatan'] = value;
        setData('signers', updated);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        put(route('templates.update', editTemplate.id), {
            onSuccess: () => {
                setEditTemplate(null);
                reset();
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('templates.destroy', deleteTemplate.id), {
            onSuccess: () => {
                setDeleteTemplate(null);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Templates" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Templates</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage your certificate templates</p>
                </div>
                <Link href={route('templates.create')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    New Template
                </Link>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {templates.map((tpl) => (
                    <div key={tpl.id} className="group rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-white/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                        {/* Thumbnail */}
                        <div className={`relative h-40 bg-gradient-to-br ${tpl.color} flex items-center justify-center`}>
                            <div className={`${tpl.orientation === 'landscape' ? 'w-32 h-24' : 'w-24 h-32'} rounded-lg bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center gap-0.5 p-2`}>
                                <div className="w-12 h-0.5 rounded bg-white/40" />
                                <div className="w-16 h-1 rounded bg-white/60 mt-1" />
                                <div className="w-14 h-0.5 rounded bg-white/30 mt-0.5" />
                                <div className="flex-1" />
                                {/* Signer preview dots */}
                                <div className="flex items-end gap-2">
                                    {tpl.signers.map((_, i) => (
                                        <div key={i} className="text-center">
                                            <div className="w-4 h-2 rounded bg-white/15 mx-auto" />
                                            <div className="w-5 h-0.5 rounded bg-white/20 mt-0.5" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-3 right-3"><OrientationBadge orientation={tpl.orientation} /></div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-white truncate">{tpl.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-400">{tpl.signers.length} signer{tpl.signers.length > 1 ? 's' : ''}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-xs text-slate-400 truncate">{tpl.signers.map(s => s.name.split(' ')[0]).join(', ')}</span>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                <span className="text-xs text-slate-500">{tpl.events_count} events</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setViewTemplate(tpl)} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all" title="View">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </button>
                                    <button onClick={() => openEdit(tpl)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all" title="Edit">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                                    </button>
                                    <button onClick={() => setDeleteTemplate(tpl)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View Modal */}
            <DetailModal show={!!viewTemplate} onClose={() => setViewTemplate(null)} title="Template Details" maxWidth="lg">
                {viewTemplate && (
                    <div className="space-y-4">
                        <div className={`h-48 rounded-xl bg-gradient-to-br ${viewTemplate.color} flex items-center justify-center`}>
                            <div className={`${viewTemplate.orientation === 'landscape' ? 'w-40 h-28' : 'w-28 h-40'} rounded-lg bg-white/10 backdrop-blur border border-white/20 flex flex-col items-center justify-center gap-1 p-3`}>
                                <div className="w-16 h-0.5 rounded bg-white/40" />
                                <div className="w-20 h-1.5 rounded bg-white/60 mt-1" />
                                <div className="w-16 h-0.5 rounded bg-white/30" />
                                <div className="flex-1" />
                                <div className="flex items-end gap-3">
                                    {viewTemplate.signers.map((_, i) => (
                                        <div key={i} className="text-center"><div className="w-6 h-3 rounded bg-white/15 mx-auto" /><div className="w-8 h-0.5 rounded bg-white/20 mt-0.5" /></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Name</p><p className="text-white text-sm font-medium">{viewTemplate.name}</p></div>
                            <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Orientation</p><OrientationBadge orientation={viewTemplate.orientation} /></div>
                        </div>
                        <div><p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Description Template</p><p className="text-slate-300 text-sm bg-slate-700/30 rounded-lg p-3 font-mono text-xs">{viewTemplate.description}</p></div>

                        {/* Signers List */}
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Signers ({viewTemplate.signers.length})</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {viewTemplate.signers.map((s, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 border border-white/5">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold">{i + 1}</span>
                                        <div><p className="text-sm text-white font-medium">{s.name}</p><p className="text-xs text-slate-400">{s.title}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </DetailModal>

            {/* Edit Modal */}
            <FormModal show={!!editTemplate} onClose={() => { setEditTemplate(null); reset(); }} onSubmit={handleEdit} title="Edit Template" submitText="Save Changes">
                {editTemplate && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Template Name</label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Orientation</label>
                            <select
                                value={data.orientasi}
                                onChange={(e) => setData('orientasi', e.target.value)}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="landscape">Landscape</option>
                                <option value="portrait">Portrait</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                            <textarea
                                value={data.deskripsi_format}
                                onChange={(e) => setData('deskripsi_format', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Dynamic Signers in Edit */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-300">Signers ({data.signers.length})</label>
                                {data.signers.length < 4 && (
                                    <button type="button" onClick={addEditSigner} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">+ Add Signer</button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {data.signers.map((s, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-700/30 border border-white/5">
                                        <span className="flex items-center justify-center w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold mt-1.5">{i + 1}</span>
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <input type="text" value={s.nama} onChange={(e) => handleEditSignerChange(i, 'name', e.target.value)} placeholder="Nama" className="rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                                            <input type="text" value={s.jabatan} onChange={(e) => handleEditSignerChange(i, 'title', e.target.value)} placeholder="Jabatan" className="rounded-lg bg-slate-700/50 border-white/10 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                                        </div>
                                        {data.signers.length > 1 && (
                                            <button type="button" onClick={() => removeEditSigner(i)} className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors mt-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </FormModal>

            {/* Delete Modal */}
            <ConfirmModal show={!!deleteTemplate} onClose={() => setDeleteTemplate(null)} onConfirm={handleDelete} title="Delete Template" message={deleteTemplate ? `Are you sure you want to delete "${deleteTemplate.name}"? Events using this template will be unlinked.` : ''} confirmText="Delete Template" />
        </AuthenticatedLayout>
    );
}
