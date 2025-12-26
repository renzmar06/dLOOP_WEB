import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: campaigns
    });

  } catch (error) {
    console.error('Fetch campaigns error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}