import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { boostType, dailyBudget, durationDays, audienceType, radiusKm } = await request.json();

    // Campaign estimation algorithm based on boost type and parameters
    const baseMultipliers = {
      'business-profile': { impressions: 150, clicks: 8, ctr: 5.3 },
      'promotion': { impressions: 200, clicks: 12, ctr: 6.0 },
      'map-pin': { impressions: 120, clicks: 6, ctr: 5.0 },
      'social-post': { impressions: 180, clicks: 10, ctr: 5.6 }
    };

    const audienceMultipliers = {
      'local': 1.2,
      'targeted': 1.0,
      'broad': 0.8
    };

    const radiusMultiplier = Math.min(1 + (radiusKm / 100), 1.5);
    const budgetMultiplier = Math.log10(dailyBudget) * 0.3 + 0.7;

    const base = baseMultipliers[boostType as keyof typeof baseMultipliers];
    const audienceMult = audienceMultipliers[audienceType as keyof typeof audienceMultipliers];

    const dailyImpressions = Math.round(
      base.impressions * dailyBudget * audienceMult * radiusMultiplier * budgetMultiplier
    );
    const dailyClicks = Math.round(dailyImpressions * (base.ctr / 100));
    const totalImpressions = dailyImpressions * durationDays;
    const totalClicks = dailyClicks * durationDays;
    const estimatedCtr = ((totalClicks / totalImpressions) * 100);

    return NextResponse.json({
      success: true,
      data: {
        dailyImpressions,
        dailyClicks,
        totalImpressions,
        totalClicks,
        estimatedCtr: Number(estimatedCtr.toFixed(2)),
        totalBudget: dailyBudget * durationDays
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate estimate' },
      { status: 500 }
    );
  }
}