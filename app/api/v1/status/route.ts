import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const dynamic = "force-dynamic";

const uri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  return cachedClient.db("gov_monitor");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); 

    // 🛑 NEW: PREVENT DEFAULT DATABASE DUMP
    if (!query || query.trim() === "") {
      return NextResponse.json({
        success: false,
        error: "Missing search query",
        message: "Please provide a 'q' parameter to search for a specific domain or title. Example: ?q=pmo",
        documentation: "https://gov-bd-monitor.vercel.app/api-docs"
      }, { 
        status: 400, // 400 Bad Request
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        }
      });
    }

    // If there is a query, proceed to database search
    const db = await getDb();
    const collection = db.collection("GovBD_Status");
    
    const filter: any = { 
      isApproved: { $ne: false },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { url: { $regex: query, $options: "i" } },
      ]
    };

    const sites = await collection.find(filter)
      .sort({ status: 1, name: 1 }) 
      .limit(100) 
      .toArray();

    const formattedData = sites.map((site) => {
      let uptimeRatio = "0.0%";
      const history = site.history || [];
      if (history.length > 0) {
        const upCount = history.filter((h: any) => h.status === "UP").length;
        uptimeRatio = ((upCount / history.length) * 100).toFixed(1) + "%";
      }

      const domainName = site.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

      return {
        title: site.name,
        domain: domainName,
        status: site.status === "UP" ? "online" : "offline",
        http_code: site.httpCode || 0,
        uptime_ratio: uptimeRatio,
        stable_since: site.lastChanged,
        last_check: site.lastChecked,
        recent_checks: history.map((h: any) => ({
          status: h.status === "UP" ? "online" : "offline",
          latency_ms: h.latency,
          timestamp: h.timestamp,
          error: h.error || null
        }))
      };
    });

    return NextResponse.json({
      success: true,
      api_version: "1.0",
      timestamp: new Date().toISOString(),
      results_count: formattedData.length,
      data: formattedData
    }, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}