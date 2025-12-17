import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import Business from '@/models/Business';

interface DecodedToken {
  userId: string;
}

async function getUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = verifyToken(token) as DecodedToken | null;
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
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    return NextResponse.json(business);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch business' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Business updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
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
    const business = await Business.findOneAndDelete({ 
      _id: id, 
      userId: user.userId 
    });
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Business deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete business' }, { status: 500 });
  }
}