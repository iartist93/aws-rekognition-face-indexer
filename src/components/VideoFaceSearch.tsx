'use client';

import { useState } from 'react';
import { StartFaceSearch } from './StartFaceSearch';

interface VideoFaceSearchProps {
  addLog: (message: string) => void;
  setStatus: (status: string) => void;
}

export const VideoFaceSearch: React.FC<VideoFaceSearchProps> = ({
  addLog,
  setStatus,
}) => {
  const [collectionId, setCollectionId] = useState('');
  const [bucket, setBucket] = useState('');
  const [videoKey, setVideoKey] = useState('');

  const handleJobStarted = (jobId: string) => {
    setStatus('Face search job started');
    addLog(`Started face search job with ID: ${jobId}`);
  };

  const handleError = (error: Error) => {
    setStatus('Error starting face search');
    addLog(`Error: ${error.message}`);
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
          value={bucket}
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

        <StartFaceSearch
          collectionId={collectionId}
          videoS3Bucket={bucket}
          videoS3Key={videoKey}
          onJobStarted={handleJobStarted}
          onError={handleError}
        />
      </div>
    </div>
  );
};
