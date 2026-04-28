export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-lg border border-white/10 bg-slate-700/50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-300 shadow-sm transition duration-150 ease-in-out hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
