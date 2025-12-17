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
  
  const decoded = verifyToken(token) as DecodedToken | null;
  return decoded?.userId ? decoded : null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const businesses = await Business.find({ userId: user.userId });
    
    return NextResponse.json(businesses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessData = await request.json();
    
    await connectDB();
    const business = new Business({
      ...businessData,
      userId: user.userId
    });
    
    const result = await business.save();
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create business' }, { status: 500 });
  }
}