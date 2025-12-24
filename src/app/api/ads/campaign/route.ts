import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get user from token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const campaignData = await request.json();
    
    // Calculate end date if not continuous
    const startDate = new Date(campaignData.startDate);
    const endDate = campaignData.isContinuous 
      ? null 
      : new Date(startDate.getTime() + (campaignData.durationDays * 24 * 60 * 60 * 1000));

    const campaign = new Campaign({
      ...campaignData,
      userId,
      startDate,
      endDate,
      status: 'active',
      totalBudget: campaignData.dailyBudget * campaignData.durationDays
    });

    await campaign.save();

    return NextResponse.json({
      success: true,
      data: campaign
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}