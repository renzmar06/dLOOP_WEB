import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { getPasswordResetEmailTemplate } from "@/lib/emailTemplates";
import { createMailTransporter } from "@/lib/mailService";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required", data: [] },
        { status: 200 }
      );
    }

    const users = (await connectDB()).collection("users");

    /* -------------------- FIND USER -------------------- */
    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found with this email", data: [] },
        { status: 404 }
      );
    }

    /* -------------------- GENERATE TOKEN -------------------- */
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 2 * 60 * 60 * 1000;

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry,
        },
      }
    );

    /* -------------------- RESET URL -------------------- */
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    /* -------------------- SEND MAIL (DB CONFIG) -------------------- */
    const { transporter, from } = await createMailTransporter();

    const userName = user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : undefined;

    await transporter.sendMail({
      from,
      to: email,
      subject: "Reset Your dLOOP Password",
      html: getPasswordResetEmailTemplate(resetUrl, userName),
    });

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email",
      data: [],
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to send email", data: [] },
      { status: 500 }
    );
  }
}
