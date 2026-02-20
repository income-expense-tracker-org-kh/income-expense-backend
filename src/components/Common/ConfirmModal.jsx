import React from 'react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger', // 'danger' | 'warning' | 'info'
}) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: (
                <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                </svg>
            ),
            iconBg: 'bg-red-50 dark:bg-red-500/10',
            confirmBtn: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 shadow-red-200 dark:shadow-red-900/40',
        },
        warning: {
            icon: (
                <svg className="w-6 h-6 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
            ),
            iconBg: 'bg-amber-50 dark:bg-amber-500/10',
            confirmBtn: 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 shadow-amber-200 dark:shadow-amber-900/40',
        },
        info: {
            icon: (
                <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
                </svg>
            ),
            iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
            confirmBtn: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-indigo-200 dark:shadow-indigo-900/40',
        },
    };

    const style = variantStyles[variant] ?? variantStyles.danger;

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div className="relative z-10 w-full max-w-sm rounded-2xl border shadow-2xl transition-all duration-300 bg-white border-slate-200 shadow-slate-300/50 dark:bg-slate-900 dark:border-slate-700/60 dark:shadow-black/50">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="p-6 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${style.iconBg}`}>
                        
                        {style.icon}
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold mb-1 text-slate-900 dark:text-white">
                        {title}
                    </h2>

                    {/* Message */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Actions */}
                <div className="flex gap-3 p-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg transition-all duration-200 cursor-pointer ${style.confirmBtn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}