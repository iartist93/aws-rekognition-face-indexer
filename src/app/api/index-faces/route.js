import { NextResponse } from 'next/server';
import { getAWSServices } from '@/utils/aws-config';

export async function POST(request) {
  try {
    const { bucketName, folderPath, collectionId, personId, region } =
      await request.json();

    if (!bucketName || !folderPath || !collectionId || !personId || !region) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 },
      );
    }

    const { s3, rekognition } = getAWSServices(region);

    // List all objects in the folder
    const listParams = {
      Bucket: bucketName,
      Prefix: folderPath,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      return NextResponse.json(
        { error: `No files found in ${folderPath}` },
        { status: 404 },
      );
    }

    const results = {
      indexed: 0,
      failed: 0,
      skipped: 0,
      details: [],
    };

    // Process each image in the folder
    for (const item of listedObjects.Contents) {
      const key = item.Key;

      // Skip folder objects or non-image files
      if (key.endsWith('/') || !/\.(jpg|jpeg|png)$/i.test(key)) {
        results.skipped++;
        results.details.push({
          file: key,
          status: 'skipped',
          reason: 'Not an image file',
        });
        continue;
      }

      try {
        // Index the face
        const indexParams = {
          CollectionId: collectionId,
          Image: {
            S3Object: {
              Bucket: bucketName,
              Name: key,
            },
          },
          ExternalImageId: personId,
          DetectionAttributes: ['ALL'],
        };

        const indexResponse = await rekognition
          .indexFaces(indexParams)
          .promise();

        // Check if faces were detected
        const faceRecords = indexResponse.FaceRecords || [];
        if (faceRecords.length > 0) {
          results.indexed += faceRecords.length;
          results.details.push({
            file: key,
            status: 'success',
            faces: faceRecords.length,
          });
        } else {
          results.skipped++;
          results.details.push({
            file: key,
            status: 'skipped',
            reason: 'No faces detected',
          });
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          file: key,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error indexing faces:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to index faces' },
      { status: 500 },
    );
  }
}
