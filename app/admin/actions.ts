"use server";

import connectDB from "@/lib/db";
import { Site } from "@/models/Site";
import { revalidatePath } from "next/cache";

// DELETE SITE
export async function deleteSite(id: string) {
  await connectDB();
  await Site.findByIdAndDelete(id);
  revalidatePath("/admin");
  revalidatePath("/");
}

// UPDATE SITE
export async function updateSite(id: string, name: string, url: string) {
  await connectDB();
  await Site.findByIdAndUpdate(id, { name, url });
  revalidatePath("/admin");
  revalidatePath("/");
}

// 🧹 CLEAN DUPLICATES (Delete the 'www' version if root exists)
export async function resolveDuplicate(keepId: string, deleteId: string) {
  await connectDB();
  await Site.findByIdAndDelete(deleteId);
  revalidatePath("/admin");
}