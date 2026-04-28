import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function FormModal({ show, onClose, onSubmit, title, children, submitText = 'Save', maxWidth = 'lg' }) {
    const widths = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(e);
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
                            <Dialog.Panel className={`w-full ${widths[maxWidth]} rounded-2xl bg-slate-800 border border-white/10 shadow-2xl`}>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                                        <Dialog.Title className="text-lg font-semibold text-white">
                                            {title}
                                        </Dialog.Title>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {children}
                                    </div>

                                    <div className="flex justify-end gap-3 p-6 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 border border-white/10 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 transition-all duration-200"
                                        >
                                            {submitText}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
