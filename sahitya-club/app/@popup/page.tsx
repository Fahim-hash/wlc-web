// app/@popup/page.tsx
'use client';
import { useState } from 'react';

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300">
      {/* Pop-up Box Container */}
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-center transform transition-all">
        
        {/* Close Button (Top Right Cross) */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Club Event Content */}
        <div className="mt-2">
          <span className="inline-block bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Upcoming Event 🔥
          </span>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
            Mega Club Reunion '26
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
            Registration is now open for our biggest event of the year! Secure your slot before it's too late.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => setIsOpen(false)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Later
          </button>
          <a 
            href="/register" // Apnar registration link ba explicit section link input korun
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            Register Now
          </a>
        </div>

      </div>
    </div>
  );
}
