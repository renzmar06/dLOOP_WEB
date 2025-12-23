import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import BillingInformation from '@/models/BillingInformation';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const billingInfo = await BillingInformation.find({ userId: user.userId });
    
    return NextResponse.json(billingInfo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch billing information' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const billingData = await request.json();
    
    await connectDB();
    const billingInfo = new BillingInformation({
      ...billingData,
      userId: user.userId
    });
    
    const result = await billingInfo.save();
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error saving billing information:', error);
    return NextResponse.json({ error: 'Failed to save billing information' }, { status: 500 });
  }
}