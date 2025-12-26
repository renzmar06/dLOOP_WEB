import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Promotion from '@/models/Promotion';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get user from token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required', 
        error: 'No token provided' 
      }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const promotionData = await request.json();

    const promotion = new Promotion({
      ...promotionData,
      userId,
      status: 'active'
    });

    await promotion.save();

    return NextResponse.json({
      success: true,
      message: 'Promotion created successfully',
      data: promotion
    }, { status: 200 });

  } catch (error) {
    console.error('Create promotion error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid authentication token',
        error: error.message
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create promotion',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get user from token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication required', 
        error: 'No token provided' 
      }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const promotions = await Promotion.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Promotions fetched successfully',
      data: promotions
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch promotions error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid authentication token',
        error: error.message
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch promotions',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}