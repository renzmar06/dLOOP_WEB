import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const billingInfo = await BillingInformation.findOne({ 
      _id: id, 
      userId: user.userId 
    });
    
    if (!billingInfo) {
      return NextResponse.json({ error: 'Billing information not found' }, { status: 404 });
    }
    
    return NextResponse.json(billingInfo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch billing information' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const billingData = await request.json();
    await connectDB();
    
    const billingInfo = await BillingInformation.findOneAndUpdate(
      { _id: id, userId: user.userId },
      billingData,
      { new: true }
    );
    
    if (!billingInfo) {
      return NextResponse.json({ error: 'Billing information not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Billing information updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update billing information' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const billingInfo = await BillingInformation.findOneAndDelete({ 
      _id: id, 
      userId: user.userId 
    });
    
    if (!billingInfo) {
      return NextResponse.json({ error: 'Billing information not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Billing information deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete billing information' }, { status: 500 });
  }
}