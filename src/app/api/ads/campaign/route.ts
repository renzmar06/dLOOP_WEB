import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const campaignData = await request.json();
    
    // Calculate end date if not continuous
    const startDate = new Date(campaignData.startDate);
    const endDate = campaignData.isContinuous 
      ? null 
      : new Date(startDate.getTime() + (campaignData.durationDays * 24 * 60 * 60 * 1000));

    const campaign = new Campaign({
      ...campaignData,
      userId: new mongoose.Types.ObjectId(), // Temporary user ID
      startDate,
      endDate,
      status: 'active',
      totalBudget: campaignData.dailyBudget * campaignData.durationDays
    });

    await campaign.save();

    return NextResponse.json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });

  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create campaign' },
      { status: 500 }
    );
  }
}