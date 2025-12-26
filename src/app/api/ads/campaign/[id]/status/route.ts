import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import mongoose from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { status } = await request.json();
    const { id } = await params;

    console.log('Updating status for campaign:', id, 'to:', status);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign ID' },
        { status: 200 }
      );
    }

    // Validate status
    if (!['active', 'paused', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 200 }
      );
    }

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign status updated successfully',
      data: campaign
    });

  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign status' },
      { status: 500 }
    );
  }
}