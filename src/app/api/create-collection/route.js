import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

export async function POST(request) {
  try {
    const { collectionId, region } = await request.json();

    if (!collectionId || !region) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 },
      );
    }

    // Configure AWS
    AWS.config.update({ region });

    // Create AWS credentials from environment variables
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const rekognition = new AWS.Rekognition();

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
