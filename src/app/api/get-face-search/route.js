import { NextResponse } from 'next/server';
import { getAWSServices } from '@/utils/aws-config';

export async function POST(request) {
  try {
    const { jobId, region } = await request.json();

    if (!jobId || !region) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 },
      );
    }

    const { rekognition } = getAWSServices(region);

    const params = {
      JobId: jobId,
    };

    const data = await rekognition.getFaceSearch(params).promise();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting face search results:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get face search results' },
      { status: 500 },
    );
  }
}
