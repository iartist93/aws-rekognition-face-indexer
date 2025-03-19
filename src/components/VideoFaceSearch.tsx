'use client';

import { useState } from 'react';
import { StartFaceSearch } from './StartFaceSearch';
import { Button } from './ui/Button';

interface VideoFaceSearchProps {
  addLog: (message: string) => void;
  setStatus: (status: string) => void;
}

export const VideoFaceSearch: React.FC<VideoFaceSearchProps> = ({
  addLog,
  setStatus,
}) => {
  const [collectionId, setCollectionId] = useState(
    process.env.NEXT_PUBLIC_COLLECTION_ID,
  );
  const [bucketName, setBucket] = useState(
    process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
  );
  const [videoKey, setVideoKey] = useState(process.env.NEXT_PUBLIC_VIDEO_KEY);
  const [region, setRegion] = useState(process.env.AWS_REGION || 'eu-west-1');

  const handleJobStarted = (jobId: string) => {
    setStatus('Face search job started');
    addLog(`Started face search job with ID: ${jobId}`);
  };

  const handleError = (error: Error) => {
    setStatus('Error starting face search');
    addLog(`Error: ${error.message}`);
  };

  const handleStartFaceSearch = async () => {
    if (!collectionId || !bucketName || !videoKey || !region) {
      handleError(
        new Error(
          'Please fill in all fields (Collection ID, Bucket Name, and Video Key are required)',
        ),
      );
      return;
    }

    try {
      const response = await fetch('/api/start-face-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId,
          bucketName,
          videoKey,
          region,
        }),
      });
      const data = await response.json();

      console.log(data);

      if (response.ok) {
        addLog(`Face search started. Job ID: ${data.JobId}`);
        setStatus('Face search job started');
      } else {
        addLog(`Error: ${data.error}`);
        setStatus('Failed to start face search');
      }
    } catch (error) {
      addLog(`Error: ${error.message}`);
      setStatus('Failed to start face search');
    }
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Search Faces in Video</h2>
      <div className='space-y-2'>
        <input
          type='text'
          placeholder='Collection ID'
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className='w-full px-3 py-2 border rounded'
        />
        <input
          type='text'
          placeholder='S3 Bucket Name'
          value={bucketName}
          onChange={(e) => setBucket(e.target.value)}
          className='w-full px-3 py-2 border rounded'
        />
        <input
          type='text'
          placeholder='Video S3 Key (path/to/video.mp4)'
          value={videoKey}
          onChange={(e) => setVideoKey(e.target.value)}
          className='w-full px-3 py-2 border rounded'
        />

        <Button onClick={handleStartFaceSearch}>Start Face Search</Button>
      </div>
    </div>
  );
};
