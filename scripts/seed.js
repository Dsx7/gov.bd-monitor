// web/scripts/seed.js
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" }); 

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Error: MONGODB_URI is missing in .env.local");
  process.exit(1);
}

// The list of sites to monitor
const initialSites = [
  { name: "Prime Minister's Office", url: "http://pmo.gov.bd" },
  { name: "Ministry of Foreign Affairs", url: "http://mofa.gov.bd" },
  { name: "Bangladesh Bank", url: "https://www.bb.org.bd" },
  { name: "Ministry of Education", url: "http://moedu.gov.bd" },
  { name: "Bangladesh Parliament", url: "http://www.parliament.gov.bd" },
  { name: "Police Headquarters", url: "https://www.police.gov.bd" },
  { name: "Immigration & Passports", url: "http://dip.gov.bd" },
  { name: "National Board of Revenue", url: "http://nbr.gov.bd" },
  { name: "Election Commission", url: "http://www.ecs.gov.bd" },
  { name: "Forms Portal", url: "http://forms.gov.bd" },
  // Add a broken one to test "DOWN" status
  { name: "Test Broken Site", url: "http://this-does-not-exist.gov.bd" }
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected!");

    // ⚠️ MAKE SURE THIS MATCHES YOUR CODE
    const db = client.db("gov_monitor"); 
    const collection = db.collection("GovBD_Status"); // User requested this name earlier

    console.log(`Inserting ${initialSites.length} sites...`);

    for (const site of initialSites) {
      await collection.updateOne(
        { url: site.url },
        { 
          $set: { 
            name: site.name,
            url: site.url,
            status: "UNKNOWN", // Default until worker checks it
            httpCode: 0,
            lastChecked: new Date(0), // Old date ensures worker checks it first
            lastChanged: new Date()
          } 
        },
        { upsert: true } // Create if not exists
      );
    }

    console.log("🎉 Database seeded successfully!");
    console.log("👉 Now refresh your website.");

  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await client.close();
  }
}

seed();