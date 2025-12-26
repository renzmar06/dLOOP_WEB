import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required', data: [] },
        { status: 400 }
      );
    }

    const users = db.collection('users');

    // Find user with matching token
    const user = await users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Token is invalid or expired', data: [] },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      data: []
    });

  } catch (error) {
    console.error('Validate token error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong', data: [] },
      { status: 500 }
    );
  }
}