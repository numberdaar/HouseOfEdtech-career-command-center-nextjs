import mongoose, { Schema, models } from "mongoose";

const OpportunitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, trim: true, maxlength: 120, default: "" },
    stage: {
      type: String,
      enum: ["saved", "applied", "screening", "interview", "offer", "rejected"],
      required: true,
      index: true
    },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    salary: { type: String, trim: true, maxlength: 80, default: "" },
    nextAction: { type: String, trim: true, maxlength: 240, default: "" },
    followUpDate: { type: String, trim: true, maxlength: 30, default: "" },
    notes: { type: String, trim: true, maxlength: 2000, default: "" },
    jobUrl: { type: String, trim: true, maxlength: 500, default: "" }
  },
  { timestamps: true }
);

OpportunitySchema.index({ userId: 1, updatedAt: -1 });
OpportunitySchema.index({ userId: 1, stage: 1, updatedAt: -1 });

export const Opportunity =
  models.Opportunity || mongoose.model("Opportunity", OpportunitySchema);