"use client";

import { CreditCard, Plane, FileText, Car, GraduationCap, Activity, Search } from "lucide-react";

interface PopularServicesProps {
  onQuickSearch: (term: string) => void;
}

const services = [
  { name: "NID Server", term: "nidw", icon: CreditCard },
  { name: "E-Passport", term: "passport", icon: Plane },
  { name: "Birth Reg", term: "bdris", icon: FileText },
  { name: "BRTA (DL)", term: "brta", icon: Car },
  { name: "Education", term: "educationboard", icon: GraduationCap },
  { name: "Health DGHS", term: "dghs", icon: Activity },
];

export default function PopularServices({ onQuickSearch }: PopularServicesProps) {
  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-4 px-1">
         <div className="h-1.5 w-1.5 rounded-full bg-[#f42a41]" />
         <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Most Checked Services</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {services.map((item) => (
          <button
            key={item.name}
            onClick={() => onQuickSearch(item.term)}
            className="group relative flex flex-col items-center justify-center p-4 bg-white/60 hover:bg-white backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-[#006a4e]/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full"
          >
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#006a4e]/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />

            {/* Icon Circle */}
            <div className="relative mb-3 p-3 rounded-full bg-gray-50 border border-gray-100 group-hover:bg-[#006a4e] group-hover:border-[#006a4e] transition-colors duration-300">
              <item.icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
            </div>

            {/* Text */}
            <span className="text-xs font-bold text-gray-700 group-hover:text-[#006a4e] transition-colors uppercase tracking-wide">
              {item.name}
            </span>
            
            {/* Search Icon Hint */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                <Search className="h-3 w-3 text-[#006a4e]/40" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}