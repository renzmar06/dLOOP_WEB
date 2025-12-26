import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import SubscriptionBilling from '@/models/SubscriptionBilling';

interface DecodedToken {
  userId: string;
}

async function getUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = await verifyToken(token) as DecodedToken | null;
  return decoded?.userId ? decoded : null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const subscriptions = await SubscriptionBilling.find({ userId: user.userId });
    
    return NextResponse.json({ success: true, message: 'Subscriptions fetched successfully', data: subscriptions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptionData = await request.json();
    console.log('Received subscription data:', subscriptionData);
    
    // Calculate expiry date (1 month from now)
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    await connectDB();
    const subscription = new SubscriptionBilling({
      userId: user.userId,
      planName: subscriptionData.planName,
      planPrice: subscriptionData.planPrice,
      planExpiryDate: expiryDate,
      status: subscriptionData.status || 'active'
    });
    
    console.log('Subscription before save:', subscription);
    const result = await subscription.save();
    console.log('Saved subscription result:', result);
    
    return NextResponse.json({ success: true, message: 'Subscription created successfully', data: result }, { status: 201 });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ success: false, error: 'Failed to save subscription' }, { status: 500 });
  }
}