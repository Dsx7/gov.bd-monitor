"use client";

import { useState } from "react";
import { Trash2, Edit2, Save, X, Check } from "lucide-react";
import { updateSite, deleteSite } from "@/app/admin/actions"; 

export default function AdminRow({ site }: { site: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: site.name, url: site.url });
  const [status, setStatus] = useState("idle"); // idle, saving, deleting

  async function handleSave() {
    setStatus("saving");
    await updateSite(site._id, formData.name, formData.url);
    setIsEditing(false);
    setStatus("idle");
  }

  async function handleDelete() {
    if(!confirm("Are you sure you want to delete this domain?")) return;
    setStatus("deleting");
    await deleteSite(site._id);
  }

  if (isEditing) {
    return (
      <tr className="bg-blue-50">
        <td className="px-6 py-4">
          <input 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-1 border rounded"
          />
        </td>
        <td className="px-6 py-4">
           <input 
            value={formData.url} 
            onChange={(e) => setFormData({...formData, url: e.target.value})}
            className="w-full p-1 border rounded font-mono text-xs"
          />
        </td>
        <td className="px-6 py-4 text-xs text-slate-400">Editing...</td>
        <td className="px-6 py-4 text-right flex justify-end gap-2">
           <button onClick={handleSave} disabled={status === 'saving'} className="p-2 bg-green-600 text-white rounded hover:bg-green-700">
             <Save className="h-4 w-4" />
           </button>
           <button onClick={() => setIsEditing(false)} className="p-2 bg-slate-200 text-slate-600 rounded hover:bg-slate-300">
             <X className="h-4 w-4" />
           </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-50 group border-b border-slate-100">
      <td className="px-6 py-4 font-medium text-slate-900">{site.name}</td>
      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{site.url}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-xs font-bold ${site.status === 'UP' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {site.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
          <Edit2 className="h-4 w-4" />
        </button>
        <button onClick={handleDelete} disabled={status === 'deleting'} className="p-2 text-red-500 hover:bg-red-50 rounded" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}