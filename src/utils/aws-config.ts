import AWS from 'aws-sdk';

export function configureAWS(region: string): void {
  // Configure AWS
  AWS.config.update({ region });

  // Create AWS credentials from environment variables
  AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
}

/**
 * Singleton =>  Module level variable shared across all the imports of this module file
 */
let awsServices: { s3: AWS.S3; rekognition: AWS.Rekognition } | null = null;

export function getAWSServices(region: string) {
  if (!awsServices) {
    configureAWS(region);
    awsServices = {
      s3: new AWS.S3(),
      rekognition: new AWS.Rekognition(),
    };
  }
  return awsServices;
}
