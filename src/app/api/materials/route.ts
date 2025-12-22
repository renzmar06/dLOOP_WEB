import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Material } from '@/models/Material';

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
    const body = await request.json();

    if (!body.materialname) {
      return NextResponse.json(
        { message: 'Missing required field: materialname' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const material: Omit<Material, '_id'> = {
      materialname: body.materialname,
      materialType: body.materialType || '',
      unitType: body.unitType || '',
      crvPrice: body.crvPrice || 0,
      scrapPrice: body.scrapPrice || 0,
      perUnit: body.perUnit || 0,
      minQuantity: body.minQuantity || 0,
      maxQuantity: body.maxQuantity || 0,
      specialNotes: body.specialNotes || '',
      submaterial: body.submaterial || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('materials').insertOne(material);
    
    return NextResponse.json({ 
      success: true,
      message: 'Material added successfully',
      data: material
    });

  } catch (error) {
    console.error('Error adding material:', error);
    return NextResponse.json(
      { error: 'Failed to add material' },
      { status: 500 }
    );
  }
}