import mongoose, { Schema } from "mongoose";

const SiteSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  status: { type: String, default: "UNKNOWN" },
  httpCode: { type: Number, default: 0 },
  latency: { type: Number, default: 0 },
  lastChecked: { type: Date, default: new Date(0) },
  lastChanged: { type: Date, default: Date.now },
  category: { type: String, default: "General" },

  // ✨ ALLOWS FALSE TO BE SAVED
  isApproved: { type: Boolean, default: true } 
}, { 
  collection: 'GovBD_Status', 
  timestamps: true 
});

// Delete existing model to force schema refresh (Fixes Mongoose caching issues in Dev)
if (mongoose.models.Site) {
  delete mongoose.models.Site;
}

export const Site = mongoose.model("Site", SiteSchema);