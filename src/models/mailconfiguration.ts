import mongoose, { Schema, Document, Model } from "mongoose";

/* -------------------- INTERFACE -------------------- */
export interface IMailConfiguration extends Document {
  mailDriver: string;
  mailHost: string;
  mailPort: number;
  mailUsername: string;
  mailPassword: string;
  mailEncryption: string;
  mailFromAddress: string;
  mailFromName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* -------------------- SCHEMA -------------------- */
const MailConfigurationSchema: Schema<IMailConfiguration> = new Schema(
  {
    mailDriver: {
      type: String,
      required: true,
      enum: ["smtp"],
      default: "smtp",
    },

    mailHost: {
      type: String,
      required: true,
    },

    mailPort: {
      type: Number,
      required: true,
      default: 587,
    },

    mailUsername: {
      type: String,
      required: true,
    },

    mailPassword: {
      type: String,
      required: true,
    },

    mailEncryption: {
      type: String,
      enum: ["tls", "ssl", "none"],
      default: "tls",
    },

    mailFromAddress: {
      type: String,
      required: true,
    },

    mailFromName: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------- MODEL -------------------- */
const MailConfiguration: Model<IMailConfiguration> =
  mongoose.models.MailConfiguration ||
  mongoose.model<IMailConfiguration>(
    "MailConfiguration",
    MailConfigurationSchema
  );
export default MailConfiguration;
