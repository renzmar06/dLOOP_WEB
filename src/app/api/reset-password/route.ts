import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const db = await connectDB();
    const { token, password, confirmPassword } = await request.json();

    // Validate token is a string to prevent NoSQL injection
    if (!token || typeof token !== 'string' || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required', data: [] },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match', data: [] },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long', data: [] },
        { status: 400 }
      );
    }

    const users = db.collection('users');

    // Find user with valid token
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

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset fields
    await users.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: '', resetPasswordExpires: '' }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      data: []
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong', data: [] },
      { status: 500 }
    );
  }
}