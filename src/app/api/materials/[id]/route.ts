import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await connectDB();
    
    console.log('Material ID:', id);
    console.log('Request body:', body);
    console.log('Submaterial ID:', body.submaterialId);
    console.log('Is new submaterial?', body.submaterialId?.startsWith('new-'));
    
    if (body.submaterialId && body.config) {
      // Check if it's a new submaterial (starts with 'new-')
      if (body.submaterialId.startsWith('new-')) {
        // Add new submaterial to the array
        const newSubmaterial = {
          id: new ObjectId().toString(),
          enabled: true,
          submaterialname: body.config.submaterialname || 'New Submaterial',
          programType: body.config.programType,
          materialType: body.config.materialType,
          unitType: body.config.unitType,
          crvPrice: parseFloat(body.config.crvPrice) || 0,
          scrapPrice: parseFloat(body.config.scrapPrice) || 0,
          perUnit: parseFloat(body.config.perUnit) || 0,
          minQuantity: parseInt(body.config.minQuantity) || 0,
          maxQuantity: parseInt(body.config.maxQuantity) || 0,
          specialNotes: body.config.specialNotes || ''
        };
        
        console.log('Adding new submaterial:', newSubmaterial);
        
        const result = await db.collection('materials').updateOne(
          { _id: new ObjectId(id) },
          { 
            $push: { submaterial: newSubmaterial } as any,
            $set: { updatedAt: new Date() }
          }
        );
        
        console.log('Update result:', result);
        
        if (result.matchedCount === 0) {
          return NextResponse.json(
            { error: 'Material not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({ 
          success: true,
          message: 'New submaterial added successfully',
          newSubmaterialId: newSubmaterial.id
        });
      } else {
        console.log('Updating existing submaterial:', body.submaterialId);
        
        const result = await db.collection('materials').updateOne(
          { 
            _id: new ObjectId(id),
            'submaterial.id': body.submaterialId
          },
          { 
            $set: { 
              'submaterial.$.submaterialname': body.config.submaterialname || 'Updated Submaterial',
              'submaterial.$.programType': body.config.programType,
              'submaterial.$.materialType': body.config.materialType,
              'submaterial.$.unitType': body.config.unitType,
              'submaterial.$.crvPrice': parseFloat(body.config.crvPrice) || 0,
              'submaterial.$.scrapPrice': parseFloat(body.config.scrapPrice) || 0,
              'submaterial.$.perUnit': parseFloat(body.config.perUnit) || 0,
              'submaterial.$.minQuantity': parseInt(body.config.minQuantity) || 0,
              'submaterial.$.maxQuantity': parseInt(body.config.maxQuantity) || 0,
              'submaterial.$.specialNotes': body.config.specialNotes,
              updatedAt: new Date()
            }
          }
        );
        
        console.log('Update existing submaterial result:', result);
        
        if (result.matchedCount === 0) {
          return NextResponse.json(
            { error: 'Material or submaterial not found' },
            { status: 404 }
          );
        }
      }
    } else {
      // Update entire submaterial array
      const result = await db.collection('materials').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            submaterial: body.submaterial,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Material not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Material updated successfully'
    });

  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json(
      { error: 'Failed to update material' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { submaterialId } = await request.json();
    const db = await connectDB();
    
    const result = await db.collection('materials').updateOne(
      { _id: new ObjectId(id) },
      { 
        $pull: { submaterial: { id: submaterialId } as any },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Submaterial deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting submaterial:', error);
    return NextResponse.json(
      { error: 'Failed to delete submaterial' },
      { status: 500 }
    );
  }
}