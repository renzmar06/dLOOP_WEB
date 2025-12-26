import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import mongoose from 'mongoose';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    const campaignData = await request.json();
    const { id } = await params;

    console.log('Updating campaign ID:', id);
    console.log('Campaign data:', campaignData);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign ID' },
        { status: 400 }
      );
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      {
        ...campaignData,
        totalBudget: campaignData.dailyBudget * campaignData.durationDays
      },
      { new: true }
    );

    if (!updatedCampaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully',
      data: updatedCampaign
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update campaign' },
      { status: 500 }
    );
  }
}