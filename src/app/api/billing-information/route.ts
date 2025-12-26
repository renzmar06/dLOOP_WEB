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
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const billingInfo = await BillingInformation.find({ userId: user.userId });
    
    return NextResponse.json({ success: true, message: 'Billing information fetched successfully', data: billingInfo });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch billing information' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const billingData = await request.json();
    
    await connectDB();
    
    // Check if user already has a payment method
    const existingBilling = await BillingInformation.findOne({ userId: user.userId });
    
    if (existingBilling) {
      // Update existing payment method
      const updatedBilling = await BillingInformation.findOneAndUpdate(
        { userId: user.userId },
        { ...billingData },
        { new: true }
      );
      return NextResponse.json({ success: true, message: 'Payment method updated successfully', data: updatedBilling }, { status: 200 });
    } else {
      // Create new payment method
      const billingInfo = new BillingInformation({
        ...billingData,
        userId: user.userId
      });
      
      const result = await billingInfo.save();
      return NextResponse.json({ success: true, message: 'Payment method created successfully', data: result }, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving billing information:', error);
    return NextResponse.json({ success: false, error: 'Failed to save billing information' }, { status: 500 });
  }
}