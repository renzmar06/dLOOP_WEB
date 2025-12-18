import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 200 }
      );
    }

    // Database connection
    let db;
    try {
      db = await connectDB();
    } catch {
      return NextResponse.json(
        { sucess: false, message: 'Database connection failed' },
        { status: 503 }
      );
    }

    const users = db.collection('users');

    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
      
        { sucess: false,  message: 'User already exists' },
        { status: 200 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const user = {
      id: result.insertedId.toString(),
      name,
      email,
    };

    return NextResponse.json({
      sucess: true,
      message: 'User registered successfully',
      user,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { sucess: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}