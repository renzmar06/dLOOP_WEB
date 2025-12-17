import mongoose, { Schema, Document } from "mongoose";

export interface BusinessHours {
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
  businessHours: {
    monday: BusinessHours;
    tuesday: BusinessHours;
    wednesday: BusinessHours;
    thursday: BusinessHours;
    friday: BusinessHours;
    saturday: BusinessHours;
    sunday: BusinessHours;
  };
  instagram: string;
  facebook: string;
  twitter: string;
  seoKeywords: string;
}

const businessHoursSchema = new Schema<BusinessHours>({
  open: { type: String, required: true },
  close: { type: String, required: true },
  closed: { type: Boolean, default: false }
});

const businessSchema = new Schema<IBusiness>(
  {
    userId: { type: String, required: true },
    businessName: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    website: { type: String, required: true },
    googleLocation: { type: String, required: true },
    serviceArea: { type: String, required: true },
    businessType: { type: String, required: true },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    registeredId: { type: String, required: true },
    legalName: { type: String, required: true },
    businessHours: {
      monday: businessHoursSchema,
      tuesday: businessHoursSchema,
      wednesday: businessHoursSchema,
      thursday: businessHoursSchema,
      friday: businessHoursSchema,
      saturday: businessHoursSchema,
      sunday: businessHoursSchema
    },
    instagram: { type: String, required: true },
    facebook: { type: String, required: true },
    twitter: { type: String, required: true },
    seoKeywords: { type: String, required: true }
  },
  { timestamps: true }
);

const Business = mongoose.models?.Business || mongoose.model<IBusiness>("Business", businessSchema);
export default Business;
