import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import Business from '@/models/Business';

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
    const business = await Business.findOne({ 
      _id: id, 
      userId: user.userId 
    });
    
    if (!business) {
      return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Business fetched successfully', data: business });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch business' + error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ success:false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const businessData = await request.json();
    await connectDB();
    
    const business = await Business.findOneAndUpdate(
      { _id: id, userId: user.userId },
      businessData,
      { new: true }
    );
    
    if (!business) {
      return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Business updated successfully', data: business });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update business' + error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ success:false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const business = await Business.findOneAndDelete({ 
      _id: id, 
      userId: user.userId 
    });
    
    if (!business) {
      return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Business deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete business' + error }, { status: 500 });
  }
}