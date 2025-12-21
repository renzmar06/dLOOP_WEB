import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Material, CreateMaterialRequest } from '@/models/Material';

export async function GET() {
  try {
    const db = await connectDB();
    const materials = await db.collection('materials').find({}).toArray();
    
    return NextResponse.json({ 
      success: true, 
      materials 
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateMaterialRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.unitType || !body.crvPrice) {
      return NextResponse.json(
        { message: 'Missing required fields: name, unitType, crvPrice' },
        { status: 200 }
      );
    }

    const db = await connectDB();
    const material: Omit<Material, '_id'> = {
      name: body.name,
      materialType: body.materialType,
      unitType: body.unitType,
      crvPrice: parseFloat(body.crvPrice),
      scrapPrice: parseFloat(body.scrapPrice || '0'),
      perUnit: parseFloat(body.perUnit || '0'),
      minQuantity: body.minQuantity,
      maxQuantity: body.maxQuantity,
      specialNotes: body.specialNotes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('materials').insertOne(material);
console.log(result)
    return NextResponse.json({ 
      success: true,
      message: 'Material added successfully' , 
      data: { ...material }
    },{ status: 200 });

  } catch (error) {
    console.error('Error adding material:', error);
    return NextResponse.json(
      { error: 'Failed to add material' },
      { status: 500 }
    );
  }
}