import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
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

    const { plan } = await request.json();

    let price: number;
    let planName: string;
    let planPrice: string;

    if (plan === "pro") {
      price = 3900; // $39.00 in cents
      planName = "Pro";
      planPrice = "$39";
    } else if (plan === "elite") {
      price = 9900; // $99.00 in cents
      planName = "Elite";
      planPrice = "$99";
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${planName} Plan`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscription-billing`,
      metadata: {
        planName,
        planPrice,
        userId: user.userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}