import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/UI/StatCard';
import { Head, Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ── Dummy Data ──────────────────────────────────────────────
const chartData = [
    { month: 'Jan', certificates: 45 },
    { month: 'Feb', certificates: 62 },
    { month: 'Mar', certificates: 38 },
    { month: 'Apr', certificates: 89 },
    { month: 'May', certificates: 72 },
    { month: 'Jun', certificates: 95 },
    { month: 'Jul', certificates: 110 },
    { month: 'Aug', certificates: 68 },
    { month: 'Sep', certificates: 84 },
    { month: 'Oct', certificates: 130 },
    { month: 'Nov', certificates: 98 },
    { month: 'Dec', certificates: 145 },
];

const recentCertificates = [
    { id: 1, number: 'CERT/WS-DOCKER/2026/001', name: 'Ahmad Fauzi', event: 'Workshop Docker', date: '2026-04-20', status: 'valid' },
    { id: 2, number: 'CERT/WS-DOCKER/2026/002', name: 'Siti Nurhaliza', event: 'Workshop Docker', date: '2026-04-20', status: 'valid' },
    { id: 3, number: 'CERT/SEM-AI/2026/015', name: 'Budi Santoso', event: 'Seminar AI', date: '2026-04-18', status: 'valid' },
    { id: 4, number: 'CERT/WB-REACT/2026/008', name: 'Dewi Lestari', event: 'Webinar React', date: '2026-04-15', status: 'revoked' },
    { id: 5, number: 'CERT/SEM-AI/2026/016', name: 'Rudi Hermawan', event: 'Seminar AI', date: '2026-04-18', status: 'valid' },
];

const quickActions = [
    { label: 'Create Event', href: 'events.create', color: 'from-indigo-500 to-indigo-600', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    )},
    { label: 'Import Participants', href: 'participants.import', color: 'from-cyan-500 to-cyan-600', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
    )},
    { label: 'Generate Certificates', href: 'certificates.generate', color: 'from-emerald-500 to-emerald-600', icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
    )},
];

// ── Custom Tooltip ──────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg bg-slate-700 border border-white/10 px-3 py-2 shadow-xl">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-bold text-white font-mono">{payload[0].value} certificates</p>
            </div>
        );
    }
    return null;
};

// ── Status Badge ────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const styles = {
        valid: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
        revoked: 'bg-red-400/10 text-red-400 border-red-400/20',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status === 'valid' ? '✓ ' : '✕ '}{status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default function Dashboard({ stats, chart_data, recent_certificates }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-slate-400 mt-1">Overview of your certificate management system</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Events"
                    value={stats.total_events}
                    change="All time events"
                    changeType="increase"
                    color="indigo"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    }
                />
                <StatCard
                    title="Total Participants"
                    value={stats.total_participants}
                    change="Registered participants"
                    changeType="increase"
                    color="cyan"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Total Certificates"
                    value={stats.total_certificates}
                    change="Generated certificates"
                    changeType="increase"
                    color="emerald"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Valid Certificates"
                    value={stats.valid_certificates}
                    change={`${stats.valid_rate}% valid rate`}
                    changeType="increase"
                    color="amber"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    }
                />
            </div>

            {/* Chart + Quick Actions Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Bar Chart */}
                <div className="xl:col-span-2 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Certificates Generated</h2>
                            <p className="text-sm text-slate-400">Monthly overview for 2026</p>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 text-sm font-medium border border-emerald-400/20">
                            Live Database Data
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chart_data} barSize={24}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                            <Bar dataKey="certificates" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                href={route(action.href)}
                                className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-200 group"
                            >
                                <div className={`flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-br ${action.color} text-white shadow-lg`}>
                                    {action.icon}
                                </div>
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                    {action.label}
                                </span>
                                <svg className="w-4 h-4 ml-auto text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </Link>
                        ))}
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-6 pt-4 border-t border-white/5">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Overall System Summary</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 rounded-xl bg-slate-700/30">
                                <p className="text-xl font-bold text-white font-mono">{stats.total_events}</p>
                                <p className="text-xs text-slate-400">Events</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-slate-700/30">
                                <p className="text-xl font-bold text-white font-mono">{stats.total_certificates}</p>
                                <p className="text-xs text-slate-400">Certificates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Certificates Table */}
            <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Recent Certificates</h2>
                        <p className="text-sm text-slate-400">Latest generated certificates</p>
                    </div>
                    <Link
                        href={route('certificates.index')}
                        className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        View all →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Number</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recent_certificates.length > 0 ? (
                                recent_certificates.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-indigo-400">{cert.number}</td>
                                        <td className="px-6 py-4 text-sm text-slate-200 font-medium">{cert.name}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{cert.event}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">{cert.date}</td>
                                        <td className="px-6 py-4"><StatusBadge status={cert.status} /></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-slate-500">
                                        No recent certificates generated yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
