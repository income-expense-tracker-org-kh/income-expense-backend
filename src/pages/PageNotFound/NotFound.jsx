import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTranslation from '../../hooks/useTranslation';
import { useSettingsStore } from '../../store/settingsStore';

export default function NotFound() {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useSettingsStore();
    const { t } = useTranslation(language);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
            {/* Decorative background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl" />
            </div>

            <div className="relative text-center max-w-lg w-full">
                {/* 404 number */}
                <div className="relative inline-block mb-6">
                    <span className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-purple-600 select-none">
                        404
                    </span>
                    <div className="absolute inset-0 text-[10rem] font-black leading-none text-indigo-500 opacity-10 blur-2xl select-none">
                        404
                    </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                    {t('notFound.title')}
                </h1>
                <p className="text-slate-400 text-base mb-2">
                    {t('notFound.message')}
                </p>

                {/* Attempted URL */}
                <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 mb-8">
                    <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    </svg>
                    <code className="text-sm text-rose-400 font-mono truncate max-w-xs">
                        {location.pathname}
                    </code>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t('notFound.goBack')}
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {t('notFound.goDashboard')}
                    </button>
                </div>
            </div>
        </div>
    );
}