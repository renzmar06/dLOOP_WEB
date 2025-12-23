import { connectDB } from '@/lib/mongodb';
import Location from '@/models/Location';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        console.log('GET userId:', userId);

        const query = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};
        console.log('Query:', query);
        
        const locations = await Location.find(query).sort({ payouts: -1 });
        console.log('Found locations:', locations.length);

        return NextResponse.json(
            { success: true, data: locations },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch locations' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        
        console.log('Received body:', JSON.stringify(body, null, 2));
        console.log('userId from body:', body.userId);

        console.log('userId type:', typeof body.userId);
        console.log('userId value:', body.userId);
        
        if (!body.userId) {
            return NextResponse.json(
                { success: false, error: 'userId is required' },
                { status: 200 }
            );
        }

        if (!body.name || !body.address || !body.city || !body.state || !body.zip) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 200 }
            );
        }

        const locationData = {
            ...body,
            userId: body.userId // Keep as string, mongoose will convert
        };
        
        console.log('locationData before create:', JSON.stringify(locationData, null, 2));
        
        const location = await Location.create(locationData);
        console.log('Created location:', JSON.stringify(location, null, 2));

        return NextResponse.json(
            {
                success: true,
                message: 'Location created successfully',
                data: location,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error creating location:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create location' },
            { status: 200 }
        );
    }
}