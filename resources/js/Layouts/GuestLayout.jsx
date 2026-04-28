import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4">
            {/* Decorative background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
            </div>

            {/* Logo */}
            <div className="relative z-10 mb-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">SertifikatKu</h1>
                        <p className="text-xs text-slate-400">Certificate Manager</p>
                    </div>
                </Link>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 px-8 py-8 shadow-2xl">
                {children}
            </div>

            <p className="relative z-10 mt-6 text-xs text-slate-600">© 2026 SertifikatKu. All rights reserved.</p>
        </div>
    );
}
