import { useState, useMemo } from 'react';

export default function DataTable({
    columns,
    data,
    searchable = true,
    searchPlaceholder = 'Search...',
    onView,
    onEdit,
    onDelete,
    emptyMessage = 'No data found.',
    itemsPerPage = 10,
    filters,
}) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        if (!search) return data;
        return data.filter((item) =>
            columns.some((col) => {
                const value = item[col.key];
                return value && value.toString().toLowerCase().includes(search.toLowerCase());
            })
        );
    }, [data, search, columns]);

    const sortedData = useMemo(() => {
        if (!sortField) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortField] ?? '';
            const bVal = b[sortField] ?? '';
            const cmp = aVal.toString().localeCompare(bVal.toString(), undefined, { numeric: true });
            return sortDirection === 'asc' ? cmp : -cmp;
        });
    }, [filteredData, sortField, sortDirection]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const hasActions = onView || onEdit || onDelete;

    return (
        <div className="rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Toolbar */}
            {(searchable || filters) && (
                <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/5">
                    {searchable && (
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                placeholder={searchPlaceholder}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700/50 border-white/10 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    )}
                    {filters}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors select-none"
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {sortField === col.key && (
                                            <svg className={`w-3.5 h-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {hasActions && (
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, idx) => (
                                <tr key={item.id || idx} className="hover:bg-white/[0.03] transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3.5 text-sm text-slate-300 whitespace-nowrap">
                                            {col.render ? col.render(item[col.key], item) : item[col.key]}
                                        </td>
                                    ))}
                                    {hasActions && (
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {onView && (
                                                    <button onClick={() => onView(item)} className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all" title="View">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button onClick={() => onEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button onClick={() => onDelete(item)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                        </svg>
                                        <p className="text-sm text-slate-500">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                    <p className="text-sm text-slate-400">
                        Showing <span className="font-medium text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium text-slate-200">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of{' '}
                        <span className="font-medium text-slate-200">{sortedData.length}</span>
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                                    currentPage === page
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
