import Link from 'next/link';
import { Home, Search, AlertOctagon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] flex flex-col items-center justify-center p-4 font-sans selection:bg-emerald-500/30">
      
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Icon */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#f42a41]/20 dark:bg-rose-500/20 rounded-full animate-ping"></div>
          <div className="relative bg-[#f42a41] dark:bg-rose-600 text-white p-6 rounded-full shadow-2xl border-4 border-white dark:border-[#0b1120]">
            <AlertOctagon className="w-16 h-16" />
          </div>
        </div>

        {/* Error Text */}
        <div className="space-y-3">
          <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200">Page Not Found</h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium">
            The page you are looking for doesn't exist, was moved, or is temporarily offline (just like some of the sites we monitor!).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-[#006a4e] dark:bg-emerald-600 text-white rounded-xl font-bold hover:bg-[#00553e] dark:hover:bg-emerald-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Link>
          
          <Link 
            href="/api-docs"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border-2 border-gray-200 dark:border-slate-800 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            <Search className="w-5 h-5" />
            Developer API
          </Link>
        </div>
        
        {/* Footer Note */}
        <div className="pt-12 text-sm text-gray-400 dark:text-slate-600 font-medium">
          &copy; {new Date().getFullYear()} Gov.bd Monitor
        </div>
      </div>
      
    </div>
  );
}