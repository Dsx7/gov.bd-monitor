"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, Wifi, WifiOff, ChevronLeft, ChevronRight, Loader2, ExternalLink, 
  CheckCircle, XCircle, Share2, Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, format } from "date-fns";
import { getSites } from "@/app/actions";
import PopularServices from "./PopularServices";
import { toast } from "sonner"; 

export default function ClientHome({ initialData }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- STATE ---
  const [sites, setSites] = useState(initialData.sites || []);
  const [stats, setStats] = useState(initialData.globalStats || { total: 0, up: 0, down: 0 });
  const [lastUpdate, setLastUpdate] = useState(initialData.lastUpdate);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 0);
  
  const [page, setPage] = useState(1);
  const [text, setText] = useState(searchParams.get("q") || "");
  const [query] = useDebounce(text, 500);
  
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  // 🟢 SYNC URL WHEN USER TYPES
  useEffect(() => {
    const currentSearch = window.location.search;
    const params = new URLSearchParams(currentSearch);
    
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    const newQueryString = params.toString();
    const currentQueryString = currentSearch.replace('?', '');

    if (newQueryString !== currentQueryString) {
      router.replace(`/?${newQueryString}`, { scroll: false });
    }
  }, [query, router]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getSites(query, page, category, status);
      setSites(data.sites);
      setTotalPages(data.totalPages);
      if(data.lastUpdate) setLastUpdate(data.lastUpdate);
      setLoading(false);
    };
    fetchData();
  }, [query, page, category, status]);

  useEffect(() => setPage(1), [query, category, status]);

  const handleQuickSearch = (term: string) => {
    setText(term);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleShare = async (site: any) => {
    const shareText = `🚨 ${site.name} is currently ${site.status}! Checked via Gov.bd Monitor.`;
    const shareUrl = `https://gov-bd-monitor.vercel.app/?q=${encodeURIComponent(site.name)}`; 

    if (navigator.share) {
      try {
        await navigator.share({ title: "Gov.bd Monitor", text: shareText, url: shareUrl });
      } catch (err) { console.log("Share cancelled"); }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast.success("Link copied to clipboard!");
    }
  };

  const categories = ["All", "Education", "Health", "Law & Order", "Agriculture", "Local Admin", "General"];
  const upRate = stats.total > 0 ? ((stats.up / stats.total) * 100).toFixed(1) : "0.0";
  const timeSinceUpdate = lastUpdate ? formatDistanceToNow(new Date(lastUpdate), { addSuffix: true }) : "recently";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* 📊 HEADER STATS */}
      <div className="bg-[#006a4e] dark:bg-emerald-900/40 text-white rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden ring-4 ring-[#006a4e]/10 dark:ring-emerald-500/20 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="h-16 w-16 bg-[#f42a41] dark:bg-rose-600 rounded-full flex items-center justify-center shadow-md border-4 border-[#00553e] dark:border-emerald-800">
                <span className="text-2xl font-bold">BD</span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white dark:text-emerald-100">
                  Gov.bd <span className="text-green-200 dark:text-emerald-400">Monitor</span>
                </h1>
                <p className="text-green-100 dark:text-emerald-200/80 text-sm font-medium mt-1">
                  Live Status of {stats.total.toLocaleString()} Services
                </p>
                <div className="inline-flex items-center gap-1.5 mt-2 bg-black/20 dark:bg-black/40 px-3 py-1 rounded-full text-xs text-green-50 backdrop-blur-sm border border-white/10">
                  <Clock className="h-3 w-3 opacity-70" />
                  <span>Database updated {timeSinceUpdate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 md:gap-8">
              <StatBox label="UPTIME" value={`${upRate}%`} color="bg-[#00523c] dark:bg-slate-800/50" textColor="text-emerald-400" labelColor="text-emerald-200/70" />
              <StatBox label="ONLINE" value={stats.up} color="bg-[#00523c] dark:bg-slate-800/50" textColor="text-white" labelColor="text-green-300 dark:text-emerald-400" />
              <StatBox label="DOWN" value={stats.down} color="bg-white dark:bg-slate-800 shadow-md" textColor="text-[#f42a41] dark:text-rose-400" labelColor="text-slate-500 dark:text-slate-400" />
            </div>
        </div>
      </div>

      <PopularServices onQuickSearch={handleQuickSearch} />

      {/* 🔍 FILTERS BAR */}
      <div className="sticky top-4 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 ring-1 ring-gray-200 dark:ring-slate-800 mb-8 transition-all">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-slate-500" />
            <Input 
              placeholder="Search by name or URL..." 
              className="pl-10 h-11 bg-white dark:bg-slate-950 border-gray-300 dark:border-slate-700 focus:border-[#006a4e] dark:focus:border-emerald-500 text-base dark:text-white dark:placeholder:text-slate-600"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <select className="h-11 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-gray-700 dark:text-slate-300 outline-none focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 w-1/2 md:w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Online">🟢 Online</option>
              <option value="Offline">🔴 Offline</option>
            </select>
            <select className="h-11 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium text-gray-700 dark:text-slate-300 outline-none focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 w-1/2 md:w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
               {categories.map(cat => <option key={cat} value={cat}>{cat === "All" ? "Categories" : cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 📦 RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        
        {loading ? (
           Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : sites.length > 0 ? (
          sites.map((site: any) => {
            const isUp = site.status === "UP";
            const timeAgo = site.lastChanged ? formatDistanceToNow(new Date(site.lastChanged), { addSuffix: true }) : "recently";
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${site.url}&sz=128`;

            return (
              <div key={site._id} className={`group bg-white dark:bg-slate-900 rounded-xl p-5 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${isUp ? 'border-gray-100 dark:border-slate-800 hover:border-green-200 dark:hover:border-emerald-700' : 'border-red-50 dark:border-rose-900/30 hover:border-red-200 dark:hover:border-rose-800'}`}>
                
                {/* Status Top Line */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${isUp ? 'bg-[#006a4e] dark:bg-emerald-500' : 'bg-[#f42a41] dark:bg-rose-500'}`} />

                <div>
                  <div className="flex justify-between items-start mb-4 mt-1">
                    <div className={`relative h-12 w-12 rounded-xl flex items-center justify-center p-1 border overflow-hidden transition-colors ${isUp ? 'bg-white dark:bg-slate-950 border-green-50 dark:border-emerald-900/50' : 'bg-red-50 dark:bg-rose-950/30 border-red-100 dark:border-rose-900'}`}>
                      <img src={faviconUrl} alt="" className="h-8 w-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                      <div className="hidden">{isUp ? <Wifi className="h-6 w-6 text-[#006a4e] dark:text-emerald-500" /> : <WifiOff className="h-6 w-6 text-[#f42a41] dark:text-rose-500" />}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleShare(site)} className="p-1.5 rounded-md text-gray-400 hover:text-[#006a4e] dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors" title="Share Status">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${isUp ? 'bg-green-50 dark:bg-emerald-950/50 text-[#006a4e] dark:text-emerald-400' : 'bg-red-50 dark:bg-rose-950/50 text-[#f42a41] dark:text-rose-400'}`}>
                        {isUp ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {isUp ? "Online" : "Offline"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg leading-tight line-clamp-1" title={site.name}>{site.name}</h3>
                    {site.category && <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 font-medium badge bg-gray-50 dark:bg-slate-800 inline-block px-2 py-0.5 rounded">{site.category}</p>}
                  </div>
                  
                  <a href={site.url} target="_blank" rel="nofollow noopener noreferrer" className="mt-3 text-sm text-gray-500 dark:text-slate-400 hover:text-[#006a4e] dark:hover:text-emerald-400 flex items-center gap-1 truncate transition-colors font-medium group-hover:underline decoration-dotted underline-offset-4">
                    {site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </div>

                {/* 🟢 NEW: History & Footer Section */}
                <div className="mt-6">
                  {/* History Bar Chart */}
                  <UptimeHistory history={site.history} />

                  <div className="pt-3 mt-3 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center text-xs font-semibold text-gray-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      {isUp ? "Stable since" : "Down since"} <span className="text-gray-600 dark:text-slate-400">{timeAgo}</span>
                    </span>
                    {site.latency > 0 && <span className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-slate-400">{site.latency}ms</span>}
                  </div>
                </div>

              </div>
            );
          })
        ) : null}
      </div>

      {sites.length === 0 && !loading && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300">No websites found</h3>
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-4 pt-12 pb-20">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-full px-6 border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <ChevronLeft className="h-4 w-4 mr-2" /> Prev
          </Button>
          <span className="text-sm font-bold text-gray-600 dark:text-slate-400">Page {page} of {totalPages}</span>
          <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-full px-6 border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
             Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// 🟢 NEW: UPTIME HISTORY COMPONENT
function UptimeHistory({ history = [] }: { history: any[] }) {
  // We want to show 15 bars. If there are less than 15 historical records, we fill the rest with nulls.
  const TOTAL_BARS = 15;
  const safeHistory = Array.isArray(history) ? history : [];
  
  // Pad the array to always have 15 items, keeping the newest at the end
  const paddedHistory = [...Array(TOTAL_BARS - safeHistory.length).fill(null), ...safeHistory].slice(-TOTAL_BARS);

  return (
    <div className="group/history relative">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Recent Checks</span>
        {safeHistory.length > 0 && (
          <span className="text-[10px] text-gray-400 dark:text-slate-500">
            {Math.round((safeHistory.filter(h => h.status === 'UP').length / safeHistory.length) * 100)}% uptime
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-[2px] h-6 w-full">
        {paddedHistory.map((record, i) => {
          let bgColor = "bg-gray-100 dark:bg-slate-800"; // No data yet
          let tooltip = "No data yet";
          
          if (record) {
            bgColor = record.status === "UP" ? "bg-[#006a4e]/80 dark:bg-emerald-500/80 hover:bg-[#006a4e] dark:hover:bg-emerald-400" : "bg-[#f42a41]/80 dark:bg-rose-500/80 hover:bg-[#f42a41] dark:hover:bg-rose-400";
            const time = format(new Date(record.timestamp), "MMM d, h:mm a");
            tooltip = `${record.status} at ${time} (${record.latency}ms)`;
            if(record.error) tooltip += ` - ${record.error}`;
          }

          return (
            <div 
              key={i} 
              className={`flex-1 h-full rounded-[2px] transition-colors cursor-help ${bgColor}`}
              title={tooltip}
            />
          );
        })}
      </div>
    </div>
  );
}

// SKELETON LOADER COMPONENT
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden h-[260px]">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent z-10" />
      <div className="flex justify-between items-start mb-4 mt-1">
        <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-6 w-16 rounded-md bg-gray-100 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="space-y-3 mt-6">
        <div className="h-5 w-3/4 rounded bg-gray-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-1/4 rounded bg-gray-50 dark:bg-slate-800/50 animate-pulse" />
        <div className="h-10 w-full rounded bg-gray-50 dark:bg-slate-800/50 animate-pulse mt-4" />
      </div>
    </div>
  );
}

// STAT BOX COMPONENT
function StatBox({ label, value, color, textColor, labelColor }: any) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-lg min-w-[80px] ${color}`}>
      <span className={`text-xl font-bold ${textColor}`}>{value}</span>
      <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${labelColor}`}>{label}</span>
    </div>
  )
}