"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { 
  Search, Wifi, WifiOff, ChevronLeft, ChevronRight, Loader2, ExternalLink, 
  CheckCircle, XCircle 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { getSites } from "@/app/actions";
import PopularServices from "./PopularServices"; // 🟢 IMPORT NEW COMPONENT

export default function ClientHome({ initialData }: any) {
  // --- STATE ---
  const [sites, setSites] = useState(initialData.sites || []);
  const [stats, setStats] = useState(initialData.globalStats || { total: 0, up: 0, down: 0 });
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 0);
  
  // Filters
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [query] = useDebounce(text, 500);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  
  const [loading, setLoading] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getSites(query, page, category, status);
      setSites(data.sites);
      setTotalPages(data.totalPages);
      // setStats(data.globalStats); 
      setLoading(false);
    };

    fetchData();
  }, [query, page, category, status]);

  // Reset page when filters change
  useEffect(() => setPage(1), [query, category, status]);

  // 🟢 NEW: Handler for clicking the Quick Cards
  const handleQuickSearch = (term: string) => {
    setText(term); // This updates the search box immediately
    window.scrollTo({ top: 400, behavior: 'smooth' }); // Smooth scroll to results
  };

  const categories = ["All", "Education", "Health", "Law & Order", "Agriculture", "Local Admin", "General"];
  const upRate = stats.total > 0 ? ((stats.up / stats.total) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* 📊 HEADER STATS */}
      <div className="bg-[#006a4e] text-white rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden ring-4 ring-[#006a4e]/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-[#f42a41] rounded-full flex items-center justify-center shadow-md border-4 border-[#00553e]">
                <span className="text-2xl font-bold">BD</span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Gov.bd <span className="text-green-200">Monitor</span>
                </h1>
                <p className="text-green-100 text-sm opacity-90 font-medium">
                  Live Status of {stats.total.toLocaleString()} Government Services
                </p>
              </div>
            </div>

            <div className="flex gap-4 md:gap-8">
              <StatBox label="UPTIME" value={`${upRate}%`} />
              <StatBox label="ONLINE" value={stats.up} />
              <StatBox label="DOWN" value={stats.down} color="text-[#f42a41] bg-white" />
            </div>
        </div>
      </div>

      {/* 🟢 POPULAR SERVICES (Quick Filters) */}
      <PopularServices onQuickSearch={handleQuickSearch} />

      {/* 🔍 FILTERS BAR (Sticky) */}
      <div className="sticky top-4 z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 ring-1 ring-gray-200 mb-8 transition-all">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search services (e.g. passport, nid, brta)..." 
              className="pl-10 h-11 bg-white border-gray-300 focus:border-[#006a4e] focus:ring-[#006a4e]/20 text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {loading && <Loader2 className="absolute right-3 top-3 h-5 w-5 text-[#006a4e] animate-spin" />}
          </div>

          {/* 🔽 FILTERS */}
          <div className="flex w-full md:w-auto gap-2">
            
            {/* 🚦 Status */}
            <select 
              className="h-11 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 outline-none focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 cursor-pointer w-1/2 md:w-auto"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Online">🟢 Online Only</option>
              <option value="Offline">🔴 Offline Only</option>
            </select>

            {/* 📂 Category */}
            <select 
              className="h-11 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 outline-none focus:border-[#006a4e] focus:ring-2 focus:ring-[#006a4e]/20 cursor-pointer w-1/2 md:w-auto"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
               {categories.map(cat => <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 📦 RESULTS GRID */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {sites.map((site: any) => {
          const isUp = site.status === "UP";
          const timeAgo = site.lastChanged ? formatDistanceToNow(new Date(site.lastChanged), { addSuffix: true }) : "recently";

          // 🖼️ ROBUST FAVICON URL
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${site.url}&sz=128`;

          return (
            <div 
              key={site._id} 
              className={`group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden
                ${isUp ? 'hover:border-green-200' : 'hover:border-red-200'}
              `}
            >
              {/* Status Stripe */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${isUp ? 'bg-[#006a4e]' : 'bg-[#f42a41]'}`} />

              <div className="flex justify-between items-start mb-4 mt-1">
                
                {/* 🖼️ FAVICON BOX */}
                <div className={`relative h-12 w-12 rounded-xl flex items-center justify-center p-1 border overflow-hidden
                  ${isUp ? 'bg-white border-green-50' : 'bg-red-50 border-red-100'}`}>
                  
                  <img 
                    src={faviconUrl}
                    alt=""
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  
                  {/* Fallback Icon */}
                  <div className="hidden">
                    {isUp ? <Wifi className="h-6 w-6 text-[#006a4e]" /> : <WifiOff className="h-6 w-6 text-[#f42a41]" />}
                  </div>
                </div>

                {/* Status Pill */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase
                  ${isUp ? 'bg-green-50 text-[#006a4e]' : 'bg-red-50 text-[#f42a41]'}`}>
                  {isUp ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {isUp ? "Online" : "Offline"}
                </div>
              </div>

              {/* Site Name & Category */}
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1" title={site.name}>
                  {site.name}
                </h3>
                {site.category && (
                  <p className="text-xs text-gray-400 mt-1 font-medium badge bg-gray-50 inline-block px-2 py-0.5 rounded">
                    {site.category}
                  </p>
                )}
              </div>
              
              {/* URL */}
              <a 
                href={site.url} 
                target="_blank"
                rel="nofollow noopener noreferrer" 
                className="mt-3 text-sm text-gray-500 hover:text-[#006a4e] flex items-center gap-1 truncate transition-colors font-medium group-hover:underline decoration-dotted underline-offset-4"
              >
                {site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>

              {/* Footer Meta */}
              <div className="pt-4 mt-4 border-t border-gray-50 flex justify-between items-center text-xs font-semibold text-gray-400">
                <span className="flex items-center gap-1">
                   {isUp ? "Stable since" : "Down since"} <span className="text-gray-600">{timeAgo}</span>
                </span>
                {site.latency > 0 && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{site.latency}ms</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sites.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
             <FilterIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No websites found</h3>
          <p className="text-gray-500">Try searching for something else.</p>
        </div>
      )}

      {/* ⏭️ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-12 pb-20">
          <Button 
            variant="outline" 
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="rounded-full px-6 border-gray-300 hover:bg-gray-50 hover:text-[#006a4e]"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Prev
          </Button>

          <span className="text-sm font-bold text-gray-600">
            Page {page} of {totalPages}
          </span>

          <Button 
            variant="outline" 
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="rounded-full px-6 border-gray-300 hover:bg-gray-50 hover:text-[#006a4e]"
          >
             Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-lg min-w-[80px] ${color || "bg-[#00523c]"}`}>
      <span className={`text-xl font-bold ${color ? "" : "text-white"}`}>{value}</span>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${color ? "" : "text-green-300"}`}>{label}</span>
    </div>
  )
}

function FilterIcon({ className }: any) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  )
}