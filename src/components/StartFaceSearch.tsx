import { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface StartFaceSearchProps {
  addLog: (message: string) => void;
  setStatus: (status: string) => void;
}

export function StartFaceSearch({ addLog, setStatus }: StartFaceSearchProps) {
  const [bucketName, setBucketName] = useState('');
  const [videoKey, setVideoKey] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [region, setRegion] = useState(process.env.AWS_REGION || 'eu-west-1');

  const handleStartFaceSearch = async () => {
    if (!bucketName || !videoKey || !collectionId || !region) {
      addLog('Error: All fields are required');
      return;
    }

    setStatus('Starting face search in video...');
    try {
      const response = await fetch('/api/start-face-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketName,
          videoKey,
          collectionId,
          region,
        }),
      });

      const data = await response.json();
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
    <div className='pt-6'>
      <h2 className='text-xl font-semibold mb-4'>Search Faces in Video</h2>
      <div className='space-y-4'>
        <Input
          label='S3 Bucket Name'
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
          placeholder='your-bucket-name'
        />
        <Input
          label='Video Key'
          value={videoKey}
          onChange={(e) => setVideoKey(e.target.value)}
          placeholder='path/to/video.mp4'
        />
        <Input
          label='Collection ID'
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          placeholder='YourCollectionName'
        />
        <Input
          label='AWS Region'
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder='us-east-1'
        />
        <Button onClick={handleStartFaceSearch} variant='blue'>
          Start Face Search
        </Button>
      </div>
    </div>
  );
}
