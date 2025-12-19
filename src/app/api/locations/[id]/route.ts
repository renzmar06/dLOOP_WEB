// src/app/api/locations/[id]/route.ts

import { connectDB } from '@/lib/mongodb';
import Location from '@/models/Location';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid location ID' }, { status: 400 });
    }

    const body = await request.json();
    const location = await Location.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!location) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
      data: { ...location.toObject(), _id: location._id.toString() },
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid location ID' }, { status: 400 });
    }

    const location = await Location.findById(id);
    if (!location) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }

    location.status = location.status === 'active' ? 'inactive' : 'active';
    await location.save();

    return NextResponse.json({
      success: true,
      message: `Location ${location.status === 'active' ? 'enabled' : 'disabled'} successfully`,
      data: { ...location.toObject(), _id: location._id.toString() },
    });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}