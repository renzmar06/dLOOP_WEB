import mongoose, { Schema, Document } from "mongoose";

export interface BusinessHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessHoursEntry {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface IBusiness extends Document {
  userId: string;
  businessName: string;
  logo: string;
  phone: string;
  email: string;
  website: string;
  googleLocation: string;
  serviceArea: string;
  businessType: string;
  industry: string;
  description: string;
  registeredId: string;
  legalName: string;
  businessHours: BusinessHoursEntry[];
  instagram: string;
  facebook: string;
  twitter: string;
  seoKeywords: string;
}

const businessHoursEntrySchema = new Schema<BusinessHoursEntry>({
  day: { type: String, required: true },
  open: { type: String, required: true },
  close: { type: String, required: true },
  closed: { type: Boolean, default: false }
});

const businessSchema = new Schema<IBusiness>(
  {
    userId: { type: String, required: true },
    businessName: { type: String, required: true, trim: true },
    logo: { type: String, required: false },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    website: { type: String, required: false },
    googleLocation: { type: String, required: false },
    serviceArea: { type: String, required: false },
    businessType: { type: String, required: false },
    industry: { type: String, required: false },
    description: { type: String, required: false },
    registeredId: { type: String, required: false },
    legalName: { type: String, required: false },
    businessHours: {
      type: [businessHoursEntrySchema],
      default: [
        { day: "monday", open: "09:00", close: "17:00", closed: true },
        { day: "tuesday", open: "09:00", close: "17:00", closed: true },
        { day: "wednesday", open: "09:00", close: "17:00", closed: true },
        { day: "thursday", open: "09:00", close: "17:00", closed: true },
        { day: "friday", open: "09:00", close: "17:00", closed: true },
        { day: "saturday", open: "09:00", close: "17:00", closed: true },
        { day: "sunday", open: "09:00", close: "17:00", closed: true }
      ]
    },
    instagram: { type: String, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    seoKeywords: { type: String, required: false }
  },
  { timestamps: true }
);

const Business = mongoose.models?.Business || mongoose.model<IBusiness>("Business", businessSchema);
export default Business;
