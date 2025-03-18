import { NextResponse } from 'next/server';
import { getAWSServices } from '@/utils/aws-config';

export async function POST(request) {
  try {
    const { collectionId, region } = await request.json();

    if (!collectionId || !region) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 },
      );
    }

    const { rekognition } = getAWSServices(region);

    const params = {
      CollectionId: collectionId,
    };

    const data = await rekognition.createCollection(params).promise();
    return NextResponse.json({ message: 'Collection created', data });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create collection' },
      { status: 500 },
    );
  }
}
