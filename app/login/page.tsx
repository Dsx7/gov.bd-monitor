"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { loginAction } from "./actions"; // We will create this next

export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await loginAction(formData);
    if (result.success) {
      router.push("/admin");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 p-3 rounded-full">
            <Lock className="h-6 w-6 text-slate-600" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center mb-6 text-slate-800">Admin Login</h1>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
            <input name="username" className="w-full p-2 border rounded mt-1" required />
          </div>
          <div>
             <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
            <input name="password" type="password" className="w-full p-2 border rounded mt-1" required />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}