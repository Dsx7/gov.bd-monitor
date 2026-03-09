import { Terminal, Code, FileJson, CheckCircle, Server, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "API Documentation | Gov.bd Monitor",
  description: "Public API documentation for the Gov.bd real-time status monitor.",
};

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* BACK NAVIGATION */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#006a4e] dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Monitor
        </Link>

        {/* 🌟 HERO HEADER */}
        <div className="bg-gradient-to-br from-[#006a4e] to-[#004734] dark:from-emerald-900/40 dark:to-slate-900 text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f42a41]/10 rounded-full -ml-20 -mb-20 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="h-20 w-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner flex-shrink-0">
              <Terminal className="h-10 w-10 text-emerald-300" />
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold tracking-wider uppercase mb-4 text-emerald-200">
                <Zap className="h-3 w-3 fill-emerald-200" /> v1.0 Live
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Developer API</h1>
              <p className="text-emerald-50/80 max-w-2xl text-lg leading-relaxed font-medium">
                Integrate real-time uptime data of 24,000+ Bangladesh government websites into your own apps, dashboards, or Discord bots.
              </p>
            </div>
          </div>
        </div>

        {/* 🛡️ AUTH & LIMITS */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800/60 overflow-hidden backdrop-blur-xl">
          <div className="border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/80 dark:bg-slate-900/80 px-8 py-5 flex items-center gap-3">
            <Server className="h-5 w-5 text-[#006a4e] dark:text-emerald-500" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">Authentication & Limits</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-slate-400">
            <div className="flex flex-col gap-2">
              <CheckCircle className="h-6 w-6 text-[#006a4e] dark:text-emerald-500" /> 
              <strong className="text-gray-900 dark:text-white text-base">No API Key</strong>
              <p>The API is completely public and open-source. No headers required.</p>
            </div>
            <div className="flex flex-col gap-2">
              <CheckCircle className="h-6 w-6 text-[#006a4e] dark:text-emerald-500" /> 
              <strong className="text-gray-900 dark:text-white text-base">Rate Limit</strong>
              <p>Please limit requests to 1 per minute to keep our community server healthy.</p>
            </div>
            <div className="flex flex-col gap-2">
              <CheckCircle className="h-6 w-6 text-[#006a4e] dark:text-emerald-500" /> 
              <strong className="text-gray-900 dark:text-white text-base">CORS Enabled</strong>
              <p>Fetch directly from frontend applications without browser blocks.</p>
            </div>
          </div>
        </div>

        {/* 💻 GET LIVE STATUS ENDPOINT */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800/60 overflow-hidden backdrop-blur-xl">
          <div className="border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/80 dark:bg-slate-900/80 px-8 py-5 flex items-center gap-3">
            <Code className="h-5 w-5 text-[#006a4e] dark:text-emerald-500" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">Get Live Status</h2>
          </div>
          
          <div className="p-8">
            {/* URL Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <span className="bg-[#006a4e] dark:bg-emerald-500/20 dark:text-emerald-400 text-white px-4 py-2 rounded-lg font-mono font-bold text-sm tracking-wider w-fit shadow-sm border dark:border-emerald-500/30">GET</span>
              <code className="bg-gray-100 dark:bg-[#0f172a] px-5 py-3 rounded-xl text-gray-800 dark:text-emerald-300 font-mono text-sm border border-gray-200 dark:border-slate-800 flex-1 overflow-x-auto shadow-inner">
                https://gov-bd-monitor.vercel.app/api/v1/status
              </code>
            </div>

            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider">Query Parameters</h3>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 mb-10 shadow-sm">
              <table className="w-full text-sm text-left text-gray-600 dark:text-slate-400">
                <thead className="bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-slate-200 border-b border-gray-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Parameter</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-slate-900/30 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-[#006a4e] dark:text-emerald-400 font-bold">q</td>
                    <td className="px-6 py-4">String <span className="text-gray-400 dark:text-slate-500 text-xs ml-1">(Optional)</span></td>
                    <td className="px-6 py-4 leading-relaxed">Search query to filter results by domain name or title (e.g., <code className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-gray-800 dark:text-slate-300 border dark:border-slate-700">?q=passport</code>). Returns a maximum of 100 results.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileJson className="h-4 w-4 text-gray-400" /> Example Response (HTTP 200)
            </h3>
            
            {/* Fake Mac Window Code Block */}
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-xl">
              <div className="bg-gray-100 dark:bg-[#0f172a] px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-slate-800">
                <div className="h-3 w-3 rounded-full bg-[#f42a41] dark:bg-rose-500"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400 dark:bg-amber-500"></div>
                <div className="h-3 w-3 rounded-full bg-[#006a4e] dark:bg-emerald-500"></div>
                <span className="ml-2 text-xs font-mono text-gray-400">response.json</span>
              </div>
              <pre className="bg-[#1e293b] dark:bg-[#020617] text-gray-300 p-6 overflow-x-auto text-sm font-mono leading-relaxed">
{`{
  "success": true,
  "api_version": "1.0",
  "timestamp": "2026-03-09T08:45:00.000Z",
  "results_count": 1,
  "data": [
    {
      "title": "Prime Minister's Office",
      "domain": "pmo.gov.bd",
      "status": "online",
      "http_code": 200,
      "uptime_ratio": "100.0%",
      "stable_since": "2026-03-08T14:20:00.000Z",
      "last_check": "2026-03-09T08:44:00.000Z",
      "recent_checks": [
        {
          "status": "online",
          "latency_ms": 142,
          "timestamp": "2026-03-09T08:44:00.000Z",
          "error": null
        }
      ]
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* 🚀 QUICK START */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800/60 overflow-hidden backdrop-blur-xl mb-20">
           <div className="border-b border-gray-100 dark:border-slate-800/60 bg-gray-50/80 dark:bg-slate-900/80 px-8 py-5">
            <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">Quick Start (JavaScript)</h2>
          </div>
          <div className="p-8">
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-xl">
              <div className="bg-gray-100 dark:bg-[#0f172a] px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-slate-800">
                <div className="h-3 w-3 rounded-full bg-[#f42a41] dark:bg-rose-500"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400 dark:bg-amber-500"></div>
                <div className="h-3 w-3 rounded-full bg-[#006a4e] dark:bg-emerald-500"></div>
                <span className="ml-2 text-xs font-mono text-gray-400">fetch-status.js</span>
              </div>
              <pre className="bg-[#1e293b] dark:bg-[#020617] p-6 overflow-x-auto text-sm font-mono leading-relaxed text-emerald-300">
{`fetch('https://gov-bd-monitor.vercel.app/api/v1/status?q=pmo')
  .then(response => response.json())
  .then(data => {
    if(data.success && data.data.length > 0) {
      const site = data.data[0];
      console.log(\`🚨 \${site.title} is currently \${site.status.toUpperCase()}!\`);
      console.log(\`📊 Uptime: \${site.uptime_ratio}\`);
    }
  })
  .catch(error => console.error('Error:', error));`}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}