import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Promotion from '@/models/Promotion';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid promotion ID format',
        error: 'Provided ID is not a valid MongoDB ObjectId'
      }, { status: 400 });
    }

    const updatedPromotion = await Promotion.findOneAndUpdate(
      { _id: id, userId },
      promotionData,
      { new: true }
    );

    if (!updatedPromotion) {
      return NextResponse.json({
        success: false,
        message: 'Promotion not found or access denied',
        error: 'No promotion found with this ID for the authenticated user'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Promotion updated successfully',
      data: updatedPromotion
    }, { status: 200 });

  } catch (error) {
    console.error('Update promotion error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid authentication token',
        error: error.message
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update promotion',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid promotion ID format',
        error: 'Provided ID is not a valid MongoDB ObjectId'
      }, { status: 400 });
    }

    const promotion = await Promotion.findOne({ _id: id, userId });

    if (!promotion) {
      return NextResponse.json({
        success: false,
        message: 'Promotion not found or access denied',
        error: 'No promotion found with this ID for the authenticated user'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Promotion fetched successfully',
      data: promotion
    }, { status: 200 });

  } catch (error) {
    console.error('Get promotion error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid authentication token',
        error: error.message
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to fetch promotion',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}