import { NextResponse } from 'next/server';
import { getAWSServices } from '@/utils/aws-config';

export async function POST(request) {
  // return NextResponse.json(
  //   `${request} ${process.env.AWS_REGION} ${process.env.AWS_SNS_TOPIC_ARN} ${process.env.AWS_ROLE_ARN} ${process.env.AWS_ACCESS_KEY_ID} ${process.env.AWS_SECRET_ACCESS_KEY}`,
  // );

  try {
    const { bucketName, videoKey, collectionId, region } = await request.json();

    if (!bucketName || !videoKey || !collectionId || !region) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 },
      );
    }

    const { rekognition } = getAWSServices(region);

    const params = {
      Video: {
        S3Object: {
          Bucket: bucketName,
          Name: videoKey,
        },
      },
      CollectionId: collectionId,
      FaceMatchThreshold: 80, // Adjust confidence threshold as needed
      NotificationChannel: {
        SNSTopicArn: process.env.AWS_SNS_TOPIC_ARN,
        RoleArn: process.env.AWS_REKOGNITION_ROLE_ARN,
      },
      JobTag: 'face-search',
    };

    const data = await rekognition.startFaceSearch(params).promise();

    return NextResponse.json({
      message: 'Face search started',
      JobId: data.JobId,
    });
  } catch (error) {
    console.error('Error starting face search:', error);
    return NextResponse.json(
      { error: 'ERROR: ' + error.message || 'Failed to start face search' },
      { status: 500 },
    );
  }
}
