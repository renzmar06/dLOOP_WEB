import { connectDB } from '@/lib/mongodb';
import Location from '@/models/Location';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        const locations = await Location.find({}).sort({ payouts: -1 });
        return NextResponse.json({ success: true, data: locations }, { status: 200 });
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch locations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const location = await Location.create(body);
        return NextResponse.json({ success: true, message: 'Location created successfully', data: location }, { status: 200 });
    } catch (error: any) {
        console.error('Error creating location:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}