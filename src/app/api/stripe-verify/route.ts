import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import SubscriptionBilling from "@/models/SubscriptionBilling";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

interface DecodedToken {
  userId: string;
}

async function getUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = await verifyToken(token) as DecodedToken | null;
  return decoded?.userId ? decoded : null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await request.json();

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const planName = session.metadata?.planName;
      const planPrice = session.metadata?.planPrice;

      if (planName && planPrice) {
        await connectDB();

        // Check if subscription already exists for this session
        const existingSubscription = await SubscriptionBilling.findOne({
          stripeSessionId: sessionId
        });

        if (!existingSubscription) {
          // Calculate expiry date (1 month from now)
          const currentDate = new Date();
          const expiryDate = new Date(currentDate);
          expiryDate.setMonth(expiryDate.getMonth() + 1);

          // Create subscription record
          const subscription = new SubscriptionBilling({
            userId: user.userId,
            planName,
            planPrice,
            planExpiryDate: expiryDate,
            status: "active",
            selectedAt: new Date(),
            stripeSessionId: sessionId,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
          });

          await subscription.save();
          console.log("Subscription created successfully:", subscription);
        }

        return NextResponse.json({ 
          success: true, 
          subscription: existingSubscription || { planName, planPrice }
        });
      }
    }

    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json(
      { error: "Failed to verify session" },
      { status: 500 }
    );
  }
}