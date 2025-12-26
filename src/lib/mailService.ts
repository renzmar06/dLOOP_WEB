import nodemailer, { Transporter } from "nodemailer";
import MailConfiguration from "@/models/mailconfiguration";

/**
 * Create nodemailer transporter using DB mail configuration
 */
export async function createMailTransporter(): Promise<{
  transporter: Transporter;
  from: string;
}> {
  const mailConfig = await MailConfiguration.findOne({ isActive: true });

  if (!mailConfig) {
    throw new Error("Active mail configuration not found");
  }

  const transporter = nodemailer.createTransport({
    host: mailConfig.mailHost,
    port: mailConfig.mailPort,
    secure: mailConfig.mailPort === 465,
    auth: {
      user: mailConfig.mailUsername,
      pass: mailConfig.mailPassword,
    },
    tls:
      mailConfig.mailEncryption === "tls"
        ? { rejectUnauthorized: false }
        : undefined,
  });

  const from = `"${mailConfig.mailFromName}" <${mailConfig.mailFromAddress}>`;

  return { transporter, from };
}
