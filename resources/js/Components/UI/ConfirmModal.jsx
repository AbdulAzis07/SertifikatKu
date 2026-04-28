import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function ConfirmModal({ show, onClose, onConfirm, title, message, confirmText = 'Delete', variant = 'danger' }) {
    const variants = {
        danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
        warning: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    };

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-slate-800 border border-white/10 p-6 shadow-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`flex-shrink-0 rounded-full p-2 ${variant === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                        </svg>
                                    </div>
                                    <Dialog.Title className="text-lg font-semibold text-white">
                                        {title}
                                    </Dialog.Title>
                                </div>

                                <p className="text-slate-400 text-sm mb-6 ml-12">
                                    {message}
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-white/10 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${variants[variant]} shadow-lg transition-all duration-200`}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
