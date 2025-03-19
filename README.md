# AWS Rekognition Face Indexer

This is a Next.js project that allows you to index faces from an S3 bucket into an AWS Rekognition collection.

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

```env
AWS_ACCESS_KEY_ID=<your-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
AWS_REGION=<your-region>
AWS_SNS_TOPIC_ARN=<your-sns-topic-arn>
AWS_REKOGNITION_ROLE_ARN=<your-rekognition-role-arn>
AWS_LAMBDA_ROLE_ARN=<your-lambda-role-arn>
NEXT_PUBLIC_COLLECTION_ID=<your-collection-id>
NEXT_PUBLIC_S3_BUCKET_NAME=<your-s3-bucket-name>
NEXT_PERSON_FOLDER_NAME=<your-person-folder-name>
NEXT_PUBLIC_PERSON_ID=<your-person-id>
NEXT_PUBLIC_VIDEO_KEY=<path-to-search-video>
```
