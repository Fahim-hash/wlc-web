import React from 'react';
import { Camera, Sparkles, ShieldCheck } from 'lucide-react';

export default function DomainReserved() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-md w-full bg-[#121212]/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2.5rem] p-10 text-center">
        
        {/* Icon Header */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <div className="relative p-5 bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/30 rounded-3xl">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Relax <span className="text-blue-500">Studio</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-blue-400/60 uppercase text-[10px] font-bold tracking-[0.3em]">
            <Sparkles className="w-3 h-3" />
            <span>Domain Reserved</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-400 leading-relaxed mb-10 text-lg">
          We are currently crafting a digital experience that defines <span className="text-gray-200 font-medium">Relax Studio</span>. Something big is on the way.
        </p>

        {/* Instagram Link Button */}
        <a 
          href="https://instagram.com/relaxstudio__" // এখানে আপনার অরিজিনাল ইউজারনেম দিন
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center gap-3 w-full py-4 px-6 bg-white text-black font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Camera className="w-5 h-5 transition-transform group-hover:rotate-12" />
          Follow our Journey
        </a>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/5">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Relax Studio
          </p>
        </div>
      </div>
    </main>
  );
}
