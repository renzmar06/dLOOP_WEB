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

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ success:false, message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB();
    const businesses = await Business.find({ userId: user.userId });
    
    return NextResponse.json({ success:true, message: 'Businesses fetched successfully', data: businesses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch businesses' + error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json({ success:false, message: 'Unauthorized' }, { status: 401 });
    }

    const businessData = await request.json();
    
    await connectDB();
    const business = new Business({
      ...businessData,
      userId: user.userId
    });
    
    const result = await business.save();
    
    return NextResponse.json({ success:true, message: 'Business created successfully', data: result }, { status: 200 });
  } catch (error) {
    console.error('Business creation error:', error);
    return NextResponse.json({ success: false, message: `Failed to create business: ${error}` }, { status: 500 });
  }
}