'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

interface GetFaceSearchProps {
  addLog: (message: string) => void;
  setStatus: (status: string) => void;
}

export const GetFaceSearch: React.FC<GetFaceSearchProps> = ({
  addLog,
  setStatus,
}) => {
  const [jobId, setJobId] = useState('');
  const [region, setRegion] = useState(process.env.AWS_REGION || 'eu-west-1');

  const handleGetFaceSearch = async () => {
    if (!jobId || !region) {
      addLog('Error: Job ID and region are required');
      setStatus('Error getting face search results');
      return;
    }

    try {
      const response = await fetch('/api/get-face-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          region,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addLog(`Face search status: ${data.JobStatus}`);
        if (data.Persons && data.Persons.length > 0) {
          const totalFaces = data.Persons.length;
          addLog(`Detected ${totalFaces} faces in the video`);

          data.Persons.forEach((detection: any) => {
            const timestamp = (detection.Timestamp / 1000).toFixed(2); // Convert to seconds
            const confidence = detection.Person.Face.Confidence.toFixed(2);
            const boundingBox = detection.Person.Face.BoundingBox;

            addLog(
              `Face detected at ${timestamp}s with ${confidence}% confidence\n` +
                `Position: ${(boundingBox.Left * 100).toFixed(
                  1,
                )}% from left, ` +
                `${(boundingBox.Top * 100).toFixed(1)}% from top`,
            );

            if (detection.FaceMatches && detection.FaceMatches.length > 0) {
              detection.FaceMatches.forEach((match: any) => {
                addLog(
                  `  Matched with similarity: ${match.Similarity.toFixed(2)}%`,
                );
              });
            } else {
              addLog('  No matches found in the collection');
            }
          });
        } else {
          addLog('No faces detected in the video');
        }
        setStatus(`Face search ${data.JobStatus.toLowerCase()}`);
      } else {
        addLog(`Error: ${data.error}`);
        setStatus('Failed to get face search results');
      }
    } catch (error) {
      addLog(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      setStatus('Failed to get face search results');
    }
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Get Face Search Results</h2>
      <div className='space-y-2'>
        <input
          type='text'
          placeholder='Job ID'
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className='w-full px-3 py-2 border rounded'
        />
        <Button onClick={handleGetFaceSearch}>Get Results</Button>
      </div>
    </div>
  );
};
