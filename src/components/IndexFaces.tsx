import { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface IndexFacesProps {
  addLog: (message: string) => void;
  setStatus: (status: string) => void;
}

export function IndexFaces({ addLog, setStatus }: IndexFacesProps) {
  const [bucketName, setBucketName] = useState(
    process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
  );
  const [folderPath, setFolderPath] = useState(
    process.env.NEXT_PUBLIC_FOLDER_NAME,
  );
  const [collectionId, setCollectionId] = useState(
    process.env.NEXT_PUBLIC_COLLECTION_ID,
  );
  const [personId, setPersonId] = useState(process.env.NEXT_PUBLIC_PERSON_ID);
  const [region, setRegion] = useState(process.env.AWS_REGION || 'eu-west-1');

  const handleIndexFaces = async () => {
    if (!bucketName || !folderPath || !collectionId || !personId || !region) {
      addLog('Error: All fields are required');
      return;
    }

    setStatus('Indexing faces...');
    try {
      const response = await fetch('/api/index-faces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketName,
          folderPath,
          collectionId,
          personId,
          region,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        addLog(`Indexing completed. ${data.indexed} faces indexed`);
        setStatus('Indexing completed');
      } else {
        addLog(`Error: ${data.error}`);
        setStatus('Indexing failed');
      }
    } catch (error) {
      addLog(`Error: ${error.message}`);
      setStatus('Indexing failed');
    }
  };

  return (
    <div className='pt-6'>
      <h2 className='text-xl font-semibold mb-4'>Index Faces</h2>
      <div className='space-y-4'>
        <Input
          label='S3 Bucket Name'
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
          placeholder='your-bucket-name'
        />
        <Input
          label='Folder Path'
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          placeholder='ahmed/'
        />
        <Input
          label='Collection ID'
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          placeholder='YourCollectionName'
        />
        <Input
          label='Person ID'
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          placeholder='ahmed'
        />
        <Input
          label='AWS Region'
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder='us-east-1'
        />
        <Button onClick={handleIndexFaces} variant='green'>
          Index Faces
        </Button>
      </div>
    </div>
  );
}
