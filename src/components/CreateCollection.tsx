import { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CreateCollectionProps {
  addLog: (message: string) => void;
  setStatus: (status: string) => void;
}

export function CreateCollection({ addLog, setStatus }: CreateCollectionProps) {
  const [collectionId, setCollectionId] = useState(
    process.env.NEXT_PUBLIC_COLLECTION_ID,
  );
  const [region, setRegion] = useState(process.env.AWS_REGION || 'eu-west-1');

  const handleCreateCollection = async () => {
    if (!collectionId || !region) {
      addLog('Error: Collection ID and region are required');
      return;
    }

    setStatus('Creating collection...');
    try {
      const response = await fetch('/api/create-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId, region }),
      });

      const data = await response.json();
      if (response.ok) {
        addLog(`Collection created: ${collectionId}`);
        setStatus('Collection created successfully');
      } else {
        addLog(`Error: ${data.error}`);
        setStatus('Failed to create collection');
      }
    } catch (error) {
      addLog(`Error: ${error.message}`);
      setStatus('Failed to create collection');
    }
  };

  return (
    <div className='mb-6'>
      <h2 className='text-xl font-semibold mb-4'>Create Collection</h2>
      <div className='space-y-4'>
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
        <Button onClick={handleCreateCollection}>Create Collection</Button>
      </div>
    </div>
  );
}
