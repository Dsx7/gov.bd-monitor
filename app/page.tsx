import { getSites } from "@/app/actions";
import ClientHome from "@/components/ClientHome";
import AddSiteButton from "@/components/AddSiteButton";
import { Github, Linkedin, Star, Code, Heart } from "lucide-react";

// Cache data for 60 seconds to keep it fast
export const revalidate = 60;

export default async function Home() {
  // Fetch initial data (Page 1, Empty Query) on the server
  const initialData = await getSites("", 1);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
       
       {/* MAIN CONTENT WRAPPER (Flex-grow pushes footer down) */}
       <div className="relative flex-grow">
          {/* Add Button positioned absolutely */}
          <div className="absolute top-6 right-4 z-50 md:right-8">
            <AddSiteButton />
          </div>
          
          {/* Client Side Search/Grid */}
          <ClientHome initialData={initialData} />
       </div>

      {/* 🇧🇩 FOOTER SECTION */}
      <footer className="bg-[#006a4e] text-green-50 py-12 border-t-4 border-[#f42a41] relative overflow-hidden">
        
        {/* Background Pattern (Subtle) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute left-0 top-0 w-32 h-32 bg-[#f42a41] rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            
            {/* 1. PROJECT INFO */}
            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
                Gov.bd <span className="text-green-300">Monitor</span>
              </h3>
              <p className="text-sm opacity-80 leading-relaxed">
                An open-source initiative to monitor the uptime of 24,000+ Bangladesh government digital services in real-time.
              </p>
              <div className="pt-2">
                <span className="inline-block bg-[#00553e] text-green-300 text-xs px-3 py-1 rounded-full border border-green-800">
                  Unofficial / Not Govt Affiliated
                </span>
              </div>
            </div>

            {/* 2. DEVELOPER PROFILE */}
            <div className="flex flex-col items-center">
               <p className="text-sm font-medium text-green-200 mb-3 flex items-center gap-1">
                 Developed with <Heart className="h-3 w-3 text-[#f42a41] fill-[#f42a41]" /> by
               </p>
               <h4 className="text-lg font-bold text-white mb-3">Al Helal Mohammod Bayijid</h4>
               
               <div className="flex gap-4">
                 {/* LinkedIn */}
                 <a 
                   href="https://www.linkedin.com/in/bayazid603/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-2 bg-white/10 rounded-full hover:bg-[#0077b5] hover:text-white transition-all duration-300 group"
                   title="LinkedIn Profile"
                 >
                   <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                 </a>

                 {/* Personal GitHub */}
                 <a 
                   href="https://github.com/Dsx7" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-2 bg-white/10 rounded-full hover:bg-black hover:text-white transition-all duration-300 group"
                   title="GitHub Profile"
                 >
                   <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                 </a>
               </div>
            </div>

            {/* 3. REPO LINK (CTA) */}
            <div className="flex flex-col items-center md:items-end gap-3">
               <p className="text-xs font-bold uppercase tracking-widest text-green-300">Open Source</p>
               
               <a 
                 href="https://github.com/Dsx7/gov.bd-monitor" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 bg-white text-[#006a4e] px-5 py-2.5 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300"
               >
                 <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                 Star on GitHub
               </a>
               
               <div className="flex items-center gap-2 text-xs opacity-60">
                 <Code className="h-3 w-3" />
                 <span>v1.0.0 Public Release</span>
               </div>
            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="mt-12 pt-6 border-t border-green-800/50 text-center text-xs text-green-300/60">
            &copy; {new Date().getFullYear()} Gov.bd Monitor. All rights reserved. Built for Bangladesh.
          </div>
        </div>
      </footer>
    </main>
  );
}