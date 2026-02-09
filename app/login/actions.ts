"use server";

import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const user = formData.get("username");
  const pass = formData.get("password");

  if (
    user === process.env.ADMIN_USER && 
    pass === process.env.ADMIN_PASS
  ) {
    // ⚠️ FIXED: Added 'await' before cookies()
    const cookieStore = await cookies();
    
    cookieStore.set("admin_session", "true", { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      path: "/",        // Good practice to set path
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    return { success: true };
  }
  
  return { success: false };
}