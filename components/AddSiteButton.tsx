"use client";

import { useState } from "react";
import { Plus, Loader2, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMissingSite } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast"; // If you have Shadcn Toast, or use alert

export default function AddSiteButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    
    const result = await addMissingSite(formData);
    
    if (result.success) {
      setOpen(false);
      alert("✅ " + result.message); // Replace with Toast if available
    } else {
      setMessage(result.message || "Failed to add");
    }
    setLoading(false);
  }

  return (
    <>
      {/* 🖥️ Desktop Button */}
      <div className="hidden md:block">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-4 w-4" /> Add Website
            </Button>
          </DialogTrigger>
          <AddSiteForm loading={loading} message={message} onSubmit={handleSubmit} />
        </Dialog>
      </div>

      {/* 📱 Mobile Floating Action Button (FAB) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl transition-transform hover:scale-105">
              <Plus className="h-8 w-8" />
            </Button>
          </DialogTrigger>
          <AddSiteForm loading={loading} message={message} onSubmit={handleSubmit} />
        </Dialog>
      </div>
    </>
  );
}

function AddSiteForm({ loading, message, onSubmit }: any) {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" /> 
          Submit a Missing Website
        </DialogTitle>
      </DialogHeader>
      <form action={onSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-500">Website URL</label>
          <Input 
            name="url" 
            placeholder="e.g. passport.gov.bd" 
            required 
            className="text-lg"
          />
        </div>
        
        {message && (
          <p className={`text-sm p-2 rounded ${message.includes("already") ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Submit Request"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}