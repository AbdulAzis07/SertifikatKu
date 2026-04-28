export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded bg-slate-700/50 border-white/10 text-indigo-500 shadow-sm focus:ring-indigo-500 focus:ring-offset-0 ' +
                className
            }
        />
    );
}
