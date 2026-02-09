const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" }); // Or your path

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("gov_monitor");
    const collection = db.collection("GovBD_Status");
    
    console.log("🚀 Starting Categorization...");

    // 1. Education
    const edu = await collection.updateMany(
      { url: { $regex: "edu|school|college|univ|madrasah", $options: "i" } },
      { $set: { category: "Education" } }
    );
    console.log(`📚 Tagged ${edu.modifiedCount} as Education`);

    // 2. Health
    const health = await collection.updateMany(
      { url: { $regex: "health|hospital|med|clinic|family", $options: "i" } },
      { $set: { category: "Health" } }
    );
    console.log(`🏥 Tagged ${health.modifiedCount} as Health`);

    // 3. Police / Law
    const police = await collection.updateMany(
      { url: { $regex: "police|ansar|rab|jail|prison|court|law", $options: "i" } },
      { $set: { category: "Law & Order" } }
    );
    console.log(`👮 Tagged ${police.modifiedCount} as Law & Order`);

    // 4. Agriculture
    const agri = await collection.updateMany(
      { url: { $regex: "agri|fish|forest|food", $options: "i" } },
      { $set: { category: "Agriculture" } }
    );
    console.log(`🌾 Tagged ${agri.modifiedCount} as Agriculture`);

    // 5. Land & Admin
    const land = await collection.updateMany(
      { url: { $regex: "land|uno|dc|div|zilla|upazila|union", $options: "i" } },
      { $set: { category: "Local Admin" } }
    );
    console.log(`🏛️ Tagged ${land.modifiedCount} as Local Admin`);

    console.log("✅ Done!");

  } finally {
    await client.close();
  }
}

run();