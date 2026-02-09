import { MetadataRoute } from 'next';
import connectDB from "@/lib/db";
import { Site } from "@/models/Site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-domain.com'; // 🟢 CHANGE THIS

  // Fetch top 500 important sites to index individually (don't do all 24k at once to avoid timeouts)
  await connectDB();
  const sites = await Site.find({ isApproved: true }).limit(1000).sort({ lastChanged: -1 }).lean();

  const siteUrls = sites.map((site: any) => ({
    url: `${baseUrl}/?q=${encodeURIComponent(site.name)}`, // Pointing to search results for now
    lastModified: new Date(site.lastChanged || new Date()),
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...siteUrls,
  ];
}