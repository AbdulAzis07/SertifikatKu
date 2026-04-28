import { useState, useRef } from 'react';

export default function FileUpload({ accept = 'image/*', label = 'Upload File', hint, onFileSelect, preview = true, maxSize = 5 }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleFile = (f) => {
        setError(null);
        if (f.size > maxSize * 1024 * 1024) {
            setError(`File size must be less than ${maxSize}MB`);
            return;
        }
        setFile(f);
        onFileSelect?.(f);
        if (preview && f.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(f);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => {
        if (e.target.files?.[0]) handleFile(e.target.files[0]);
    };

    const removeFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setError(null);
        onFileSelect?.(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div>
            {!file ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                        dragActive
                            ? 'border-indigo-500 bg-indigo-500/5'
                            : 'border-white/10 hover:border-white/20 bg-slate-700/20 hover:bg-slate-700/30'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${dragActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-400'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-300 mb-1">{label}</p>
                    <p className="text-xs text-slate-500">Drag & drop or click to browse</p>
                    {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
                    <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
                </div>
            ) : (
                <div className="rounded-xl border border-white/10 bg-slate-700/20 p-4">
                    <div className="flex items-start gap-4">
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-white/10" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                            <div className="mt-2 h-1 rounded-full bg-slate-700 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 w-full" />
                            </div>
                        </div>
                        <button onClick={removeFile} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Remove">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
    );
}
