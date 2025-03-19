exports.handler = async (event, context) => {
  try {
    const records = event.Records;

    for (const record of records) {
      const snsMessage = record.Sns;
      const messageBody = JSON.parse(snsMessage.Message);
      
      // Log the job details
      console.log('Processing Rekognition Face Search job:', messageBody.JobId);
      console.log('Status:', messageBody.Status);

      // Only process if the job is complete
      if (messageBody.Status === 'SUCCEEDED') {
        // Here you would typically:
        // 1. Get the full results using getRekognitionResults()
        // 2. Store the results in your database
        // 3. Notify the user or trigger next steps
        await processCompletedFaceSearch(messageBody);
      } else if (messageBody.Status === 'FAILED') {
        console.error('Face search job failed:', messageBody.StatusMessage);
        // Handle failure case (e.g., notify user, cleanup resources)
        await handleFailedJob(messageBody);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully processed face search results' }),
    };
  } catch (error) {
    console.error('Error processing face search results:', error);
    throw error;
  }
};

async function processCompletedFaceSearch(jobDetails) {
  try {
    const { rekognition } = getAWSServices(process.env.AWS_REGION);
    let paginationToken = null;
    const allResults = [];

    do {
      const params = {
        JobId: jobDetails.JobId,
        MaxResults: 100,
        ...(paginationToken && { NextToken: paginationToken }),
      };

      const response = await rekognition.getFaceSearch(params).promise();
      allResults.push(...response.Persons);
      paginationToken = response.NextToken;
    } while (paginationToken);

    console.log(`Found ${allResults.length} persons in the video`);
    // Process and store results as needed
    await storeResults(jobDetails.JobId, allResults);
  } catch (error) {
    console.error('Error processing completed face search:', error);
    throw error;
  }
}

async function handleFailedJob(jobDetails) {
  console.log(`Handling failed job ${jobDetails.JobId}`);
  // Implement failure handling logic
  // e.g., update database, notify users, etc.
}

async function storeResults(jobId, results) {
  console.log(`Storing results for job ${jobId}`);
  // Implement storage logic
  // e.g., save to DynamoDB, S3, etc.
}

function getAWSServices(region) {
  const AWS = require('aws-sdk');
  AWS.config.update({ region });
  
  return {
    rekognition: new AWS.Rekognition(),
  };
}
