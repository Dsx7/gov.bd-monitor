import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

const uri = process.env.MONGODB_URI!;
// 🟢 A secret key so hackers can't send fake data
const CRON_SECRET = "gov-bd-secret-key-2024"; 

async function getDb() {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("gov_monitor");
}

// 1. cPanel asks this route for the list of sites
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDb();
    const sites = await db.collection("GovBD_Status").find({ isApproved: { $ne: false } }).toArray();
    return NextResponse.json({ sites });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 });
  }
}

// 2. cPanel sends the scan results here to be saved
export async function POST(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { results } = await req.json();
    const db = await getDb();
    const collection = db.collection("GovBD_Status");

    // Format the massive bulk update
    const bulkOps = results.map((res: any) => {
      let objectId;
      try { objectId = new ObjectId(res.id); } catch (e) { objectId = res.id; }

      return {
        updateOne: {
          filter: { _id: objectId },
          update: {
            $set: {
              status: res.status,
              httpCode: res.code,
              latency: res.latency,
              lastChecked: new Date(res.now),
              lastChanged: new Date(res.lastChanged)
            },
            $push: {
              history: {
                $each: [{ timestamp: new Date(res.now), status: res.status, latency: res.latency, error: res.error }],
                $slice: -15
              }
            }
          }
        }
      };
    });

    if (bulkOps.length > 0) await collection.bulkWrite(bulkOps);
    return NextResponse.json({ success: true, updated: bulkOps.length });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}