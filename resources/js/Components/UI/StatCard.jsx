export default function StatCard({ title, value, icon, change, changeType = 'increase', color = 'indigo' }) {
    const gradients = {
        indigo: 'from-indigo-500 to-indigo-600',
        cyan: 'from-cyan-500 to-cyan-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
    };

    const glowColors = {
        indigo: 'group-hover:shadow-indigo-500/20',
        cyan: 'group-hover:shadow-cyan-500/20',
        emerald: 'group-hover:shadow-emerald-500/20',
        amber: 'group-hover:shadow-amber-500/20',
    };

    return (
        <div className={`group relative overflow-hidden rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 hover:shadow-xl ${glowColors[color]}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white font-mono tracking-tight">{value}</p>
                    {change && (
                        <p className={`mt-1 text-sm font-medium ${changeType === 'increase' ? 'text-emerald-400' : 'text-red-400'}`}>
                            <span className="inline-flex items-center gap-1">
                                {changeType === 'increase' ? '↑' : '↓'} {change}
                            </span>
                        </p>
                    )}
                </div>
                <div className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${gradients[color]} p-3.5 text-white shadow-lg`}>
                    {icon}
                </div>
            </div>
            <div className={`absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-gradient-to-br ${gradients[color]} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
        </div>
    );
}
