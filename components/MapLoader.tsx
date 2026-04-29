import { Map } from "lucide-react";

export default function MapLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full selection:bg-emerald-500/30">
      
      {/* 🟢 Animated Radar Map Container */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-6">
        
        {/* Outer pulsing rings */}
        <div className="absolute inset-0 bg-[#006a4e]/20 dark:bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-4 bg-[#f42a41]/20 dark:bg-rose-500/10 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
        
        {/* Center Map Icon */}
        <div className="relative z-10 bg-white dark:bg-[#0b1120] p-5 rounded-full shadow-2xl border-4 border-gray-50 dark:border-slate-800">
          <Map className="w-12 h-12 text-[#006a4e] dark:text-emerald-500 animate-pulse" />
        </div>

        {/* Sweeping Radar Line */}
        <div className="absolute inset-0 z-20 rounded-full overflow-hidden pointer-events-none">
          <div className="w-1/2 h-[200%] bg-gradient-to-r from-transparent to-[#006a4e]/40 dark:to-emerald-400/30 absolute top-1/2 left-1/2 origin-top-left animate-[spin_3s_linear_infinite] -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* 🇧🇩 Loading Text */}
      <h3 className="text-xl font-extrabold text-gray-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
        Scanning Bangladesh <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-[#f42a41] rounded-full animate-bounce"></span>
          <span className="w-1.5 h-1.5 bg-[#006a4e] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1.5 h-1.5 bg-[#f42a41] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </span>
      </h3>
      <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-2 uppercase tracking-widest">
        Fetching Live Server Status
      </p>

    </div>
  );
}