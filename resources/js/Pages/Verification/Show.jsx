import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function VerificationShow() {
    const [certNumber, setCertNumber] = useState('');
    const [result, setResult] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setResult(null);

        // Simulate network request
        setTimeout(() => {
            const num = certNumber.toUpperCase();
            if (num.includes('REVOKE')) {
                setResult({ status: 'revoked', number: num });
            } else if (num.includes('CERT')) {
                setResult({
                    status: 'valid',
                    name: 'Ahmad Fauzi',
                    event: 'Workshop Docker Fundamentals',
                    date: '2026-04-20',
                    number: num,
                    position: 'Peserta',
                    award: null
                });
            } else {
                setResult({ status: 'not_found', number: num });
            }
            setIsVerifying(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#0B1120] flex flex-col relative overflow-hidden">
            <Head title="Verify Certificate | SertifikatKu" />

            {/* Background Ornaments */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/20 via-slate-900/5 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-40 -left-40 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 py-12">
                
                {/* Brand */}
                <div className="flex flex-col items-center gap-4 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-4 ring-slate-800">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white tracking-tight">SertifikatKu</h1>
                        <p className="text-slate-400 mt-1">Official Document Verification</p>
                    </div>
                </div>

                {/* Verification Card */}
                <div className="w-full max-w-lg rounded-3xl bg-slate-800/60 backdrop-blur-xl border border-white/10 p-6 sm:p-10 shadow-2xl">
                    <h2 className="text-xl font-semibold text-white text-center mb-2">Verify Credential</h2>
                    <p className="text-sm text-slate-400 text-center mb-8">
                        Enter the unique certificate number to check its authenticity and details.
                    </p>

                    <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label htmlFor="certNumber" className="sr-only">Certificate Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <input
                                    id="certNumber"
                                    type="text"
                                    value={certNumber}
                                    onChange={(e) => setCertNumber(e.target.value)}
                                    placeholder="e.g. CERT/WS-DOCKER/2026/001"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono shadow-inner transition-all uppercase"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2 text-center">
                                Tip: You can find the certificate number at the bottom right of the document.
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={isVerifying || !certNumber.trim()}
                            className="w-full py-3.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isVerifying ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                'Verify Certificate'
                            )}
                        </button>
                    </form>

                    {/* Result Area */}
                    <div className={`mt-8 overflow-hidden transition-all duration-500 ease-in-out ${result ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'}`}>
                        {result && (
                            <div className={`p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
                                result.status === 'valid'
                                    ? 'bg-emerald-500/10 border-emerald-500/20'
                                    : result.status === 'revoked'
                                    ? 'bg-amber-500/10 border-amber-500/20'
                                    : 'bg-red-500/10 border-red-500/20'
                            }`}>
                                {/* Decorator side line */}
                                <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                                    result.status === 'valid' ? 'bg-emerald-500' 
                                    : result.status === 'revoked' ? 'bg-amber-500' 
                                    : 'bg-red-500'
                                }`} />

                                {result.status === 'valid' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </div>
                                            VALID CERTIFICATE
                                        </div>
                                        <div className="pt-2 border-t border-emerald-500/10 space-y-3 text-sm">
                                            <div>
                                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Credential Number</p>
                                                <p className="text-white font-mono">{result.number}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Issued To</p>
                                                <p className="text-white font-medium text-base">{result.name}</p>
                                                {result.position && <span className="inline-flex mt-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{result.position}</span>}
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">For Event</p>
                                                <p className="text-white">{result.event}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Issued On</p>
                                                <p className="text-white">{new Date(result.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {result.status === 'revoked' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-amber-400 font-bold text-lg">
                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            CERTIFICATE REVOKED
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed pl-11">
                                            The certificate number <span className="font-mono text-amber-400">{result.number}</span> has been explicitly revoked by the issuer and is no longer valid.
                                        </p>
                                    </div>
                                )}

                                {result.status === 'not_found' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-red-400 font-bold text-lg">
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            RECORD NOT FOUND
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed pl-11">
                                            We could not find any official record matching <span className="font-mono text-red-400">{result.number}</span>. Please verify the number and try again.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center">
                <p className="text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} SertifikatKu. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
