import connectDB from "@/lib/db";
import { Site } from "@/models/Site";
import { Search, Check, X, ShieldAlert, AlertTriangle, Layers } from "lucide-react";
import AdminRow from "@/components/admin/AdminRow";
import DuplicateResolver from "@/components/admin/DuplicateResolver"; 
import { approveSite, rejectSite } from "@/app/actions";

// Force dynamic rendering for live admin data
export const dynamic = "force-dynamic";

export default async function AdminPage(props: {
  searchParams: Promise<{ q?: string; page?: string; dups?: string }>;
}) {
  await connectDB();
  
  const params = await props.searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1", 10);
  const showAllDups = params.dups === "all"; // Check if user clicked "Show All"
  
  // ---------------------------------------------------------
  // 1. FETCH PENDING REQUESTS (User Submissions)
  // ---------------------------------------------------------
  const pendingSites = await Site.find({ isApproved: false }).lean();

  // ---------------------------------------------------------
  // 2. FETCH DUPLICATES (Supercharged Aggregation)
  // ---------------------------------------------------------
  // Logic: 
  // 1. Lowercase everything (MoFa.gov.bd == mofa.gov.bd)
  // 2. Remove http, https, www
  // 3. Remove trailing slashes
  // 4. Group them
  
  const duplicateLimit = showAllDups ? 2000 : 50; // Show 50 by default, or 2000 if requested

  const duplicateGroups = await Site.aggregate([
    {
      $project: {
        name: 1, url: 1, status: 1,
        cleanUrl: {
            $toLower: { // 🟢 Fix: Case Insensitive
                $trim: {
                    input: {
                        $replaceAll: {
                            input: {
                                $replaceAll: {
                                    input: {
                                        $replaceAll: { input: "$url", find: "https://", replacement: "" }
                                    },
                                    find: "http://", replacement: ""
                                }
                            },
                            find: "www.", replacement: ""
                        }
                    },
                    chars: "/" 
                }
            }
        }
      }
    },
    {
      $group: {
        _id: "$cleanUrl",
        count: { $sum: 1 },
        ids: { $push: "$_id" },
        details: { $push: { id: "$_id", url: "$url", name: "$name", status: "$status" } }
      }
    },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1 } }, // 🟢 Fix: Show worst offenders (most duplicates) first
    { $limit: duplicateLimit }
  ]);

  // ---------------------------------------------------------
  // 3. FETCH MASTER LIST (Pagination & Search)
  // ---------------------------------------------------------
  const limit = 20;
  const skip = (page - 1) * limit;

  // Filter: Show Approved (True or Missing)
  const filter: any = { isApproved: { $ne: false } };
  
  if (query) {
    filter.$or = [
      { url: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } }
    ];
  }
  
  const sites = await Site.find(filter).sort({ _id: -1 }).skip(skip).limit(limit).lean();
  const totalCount = await Site.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);
  const sanitizedSites = JSON.parse(JSON.stringify(sites));

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-[#006a4e]">Admin Panel</h1>
            <p className="text-gray-500 text-sm">Managing {totalCount.toLocaleString()} Domains</p>
          </div>
          <a href="/" className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
            View Live Site
          </a>
        </div>

        {/* 🚨 SECTION 1: PENDING REQUESTS */}
        {pendingSites.length > 0 ? (
          <div className="bg-white rounded-xl border-l-4 border-[#f42a41] shadow-md overflow-hidden">
            <div className="bg-red-50 px-6 py-4 flex justify-between items-center border-b border-red-100">
              <h2 className="font-bold text-[#d11f33] flex items-center gap-2 text-lg">
                <ShieldAlert className="h-5 w-5" /> User Submissions ({pendingSites.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingSites.map((site: any) => (
                <div key={site._id} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{site.url}</p>
                    <p className="text-sm text-gray-500">Submitted Name: {site.name}</p>
                  </div>
                  <div className="flex gap-3">
                    <form action={async () => { "use server"; await approveSite(site._id); }}>
                      <button className="flex items-center gap-2 bg-[#006a4e] text-white px-4 py-2 rounded-lg hover:bg-[#00553e]">
                        <Check className="h-4 w-4" /> Approve
                      </button>
                    </form>
                    <form action={async () => { "use server"; await rejectSite(site._id); }}>
                      <button className="flex items-center gap-2 bg-white text-[#f42a41] border border-[#f42a41] px-4 py-2 rounded-lg hover:bg-red-50">
                        <X className="h-4 w-4" /> Reject
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ⚠️ SECTION 2: DUPLICATE RESOLVER */}
        <div className="space-y-4">
            <DuplicateResolver groups={JSON.parse(JSON.stringify(duplicateGroups))} />
            
            {/* Show All Button */}
            {!showAllDups && duplicateGroups.length >= 50 && (
                <div className="text-center">
                    <a href="/admin?dups=all" className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 font-medium text-sm shadow-sm transition-all">
                        <Layers className="h-4 w-4" /> Load All Duplicates (Heavy)
                    </a>
                </div>
            )}
            {showAllDups && (
                <div className="text-center">
                    <a href="/admin" className="text-sm text-gray-500 hover:underline">Show Less</a>
                </div>
            )}
        </div>

        {/* 📋 SECTION 3: MASTER DOMAIN LIST */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             
             {/* Search Bar */}
             <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <h2 className="font-bold text-gray-700 text-lg">All Approved Domains</h2>
                 <form className="relative w-full sm:w-96" action="/admin">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <input 
                      name="q" 
                      placeholder="Search domain or name..." 
                      className="w-full pl-10 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006a4e] focus:border-[#006a4e] outline-none transition-all" 
                      defaultValue={query} 
                    />
                 </form>
             </div>
             
             {/* Responsive Table */}
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Title / Name</th>
                            <th className="px-6 py-4">URL</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sanitizedSites.map((site: any) => (
                            <AdminRow key={site._id} site={site} />
                        ))}
                    </tbody>
                </table>
             </div>

             {/* Pagination */}
             {totalPages > 1 && (
               <div className="flex justify-center items-center gap-4 p-6 border-t border-gray-200 bg-gray-50/50">
                   {page > 1 && (
                     <a href={`/admin?page=${page-1}&q=${query}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">Previous</a>
                   )}
                   <span className="text-gray-500 font-medium">Page {page} of {totalPages}</span>
                   {page < totalPages && (
                     <a href={`/admin?page=${page+1}&q=${query}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">Next</a>
                   )}
               </div>
             )}
        </div>
      </div>
    </div>
  );
}