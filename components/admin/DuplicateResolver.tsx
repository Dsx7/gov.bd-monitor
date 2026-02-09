"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { deleteSite } from "@/app/admin/actions";

export default function DuplicateResolver({ groups }: { groups: any[] }) {
  const [isExpanded, setIsExpanded] = useState(true); // Default open

  if (groups.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-red-100 mb-8 transition-all">
      {/* Header (Click to Toggle) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center cursor-pointer hover:bg-red-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-red-200 p-2 rounded-full text-red-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-red-900">Duplicate Resolver</h2>
            <p className="text-xs text-red-600">{groups.length} groups found</p>
          </div>
        </div>
        
        <button className="text-red-700">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {/* Body (Collapsible) */}
      {isExpanded && (
        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {groups.map((group) => (
            <div key={group._id} className="p-4 flex flex-col gap-3">
              <div className="text-xs font-mono text-slate-400 uppercase">
                Group: {group._id}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.details.map((site: any) => (
                  <div key={site.id} className="border border-slate-200 p-3 rounded-lg flex justify-between items-center bg-slate-50">
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm truncate" title={site.url}>{site.url}</div>
                      <div className="text-xs text-slate-500 truncate">{site.name}</div>
                    </div>
                    <button 
                      onClick={() => {
                         if(confirm("Delete this duplicate?")) deleteSite(site.id);
                      }}
                      className="text-red-500 hover:bg-red-100 p-2 rounded ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}