"use server";

import connectDB from "@/lib/db";
import { Site } from "@/models/Site";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// ==========================================================
// 1. FRONTEND DATA FETCHER (With Filters)
// ==========================================================
export async function getSites(
  query: string, 
  page: number, 
  category?: string, 
  status?: string
) {
  await connectDB();

  const limit = 24;
  const skip = (page - 1) * limit;

  // 🟢 BASE FILTER: Show Approved + Old Data (Missing isApproved)
  const filter: any = { isApproved: { $ne: false } };
  
  // 1. Text Search
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { url: { $regex: query, $options: "i" } },
    ];
  }

  // 2. Category Filter
  if (category && category !== "All") {
    filter.category = category;
  }

  // 3. Status Filter
  if (status && status !== "All") {
    // Map "Online" -> "UP", "Offline" -> "DOWN"
    filter.status = status === "Online" ? "UP" : "DOWN";
  }

  // Parallel Fetching for Speed
  const [sites, totalCount, stats] = await Promise.all([
    // Fetch Filtered Sites
    Site.find(filter)
      .sort({ status: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    
    // Count Filtered Sites
    Site.countDocuments(filter),
    
    // Fetch GLOBAL Stats (Ignoring filters, just showing total system health)
    Site.aggregate([
      { $match: { isApproved: { $ne: false } } }, 
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          up: { $sum: { $cond: [{ $eq: ["$status", "UP"] }, 1, 0] } },
          down: { $sum: { $cond: [{ $eq: ["$status", "DOWN"] }, 1, 0] } }
        }
      }
    ])
  ]);

  // Clean Data
  const sanitizedSites = JSON.parse(JSON.stringify(sites));
  const globalStats = stats[0] || { total: 0, up: 0, down: 0 };
  
  return {
    sites: sanitizedSites,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    globalStats
  };
}

// ==========================================================
// 2. USER SUBMISSION (Pending Requests)
// ==========================================================
export async function addMissingSite(formData: FormData) {
  const url = formData.get("url") as string;
  
  if (!url) return { success: false, message: "URL is required" };

  // Basic Validation
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http")) {
    cleanUrl = "https://" + cleanUrl;
  }

  try {
    const domain = new URL(cleanUrl).hostname.replace("www.", "");
    const name = domain.split(".")[0].toUpperCase() + " (User Submitted)";

    await connectDB();

    // Check Duplicate
    const existing = await Site.findOne({ 
      url: { $regex: domain, $options: "i" } 
    });

    if (existing) {
      return { success: false, message: "This site is already in our database!" };
    }

    // Create New as PENDING (isApproved: false)
    await Site.create({
      name,
      url: cleanUrl,
      status: "UNKNOWN",
      lastChecked: new Date(0),
      lastChanged: new Date(),
      isApproved: false // <--- Hides from homepage
    });

    revalidatePath("/admin");
    return { success: true, message: "Request sent to Admin for approval!" };

  } catch (e) {
    return { success: false, message: "Invalid URL format." };
  }
}

// ==========================================================
// 3. ADMIN ACTIONS
// ==========================================================

export async function approveSite(id: string) {
  await connectDB();
  await Site.findByIdAndUpdate(id, { isApproved: true });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function rejectSite(id: string) {
  await connectDB();
  await Site.findByIdAndDelete(id);
  revalidatePath("/admin");
}

export async function deleteSite(id: string) {
  await connectDB();
  await Site.findByIdAndDelete(id);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateSite(id: string, name: string, url: string) {
  await connectDB();
  await Site.findByIdAndUpdate(id, { name, url });
  revalidatePath("/admin");
  revalidatePath("/");
}

// 4. ADMIN LOGIN
export async function loginAction(formData: FormData) {
  const user = formData.get("username");
  const pass = formData.get("password");

  if (
    user === process.env.ADMIN_USER && 
    pass === process.env.ADMIN_PASS
  ) {
    const cookieStore = await cookies();
    
    cookieStore.set("admin_session", "true", { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    return { success: true };
  }
  
  return { success: false };
}