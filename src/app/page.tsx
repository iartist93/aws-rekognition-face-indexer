'use client';

import { getAWSServices } from '@/utils/aws-config';
import { useState } from 'react';

export default function Home() {
  const [bucketName, setBucketName] = useState('');
  const [folderPath, setFolderPath] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [personId, setPersonId] = useState('');
  const [region, setRegion] = useState(process.env.AWS_REGION || 'eu-west-1');
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (message: string) => {
    setLogs((prev: string[]) => [...prev, message]);
  };

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
    <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
          <div className='max-w-md mx-auto'>
            <div className='divide-y divide-gray-200'>
              <div className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                <h1 className='text-2xl font-bold text-center mb-8'>
                  AWS Rekognition Face Indexer
                </h1>

                <div className='mb-6'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Create Collection
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Collection ID
                      </label>
                      <input
                        type='text'
                        value={collectionId}
                        onChange={(e) => setCollectionId(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='YourCollectionName'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        AWS Region
                      </label>
                      <input
                        type='text'
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='us-east-1'
                      />
                    </div>

                    <button
                      onClick={handleCreateCollection}
                      className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                      Create Collection
                    </button>
                  </div>
                </div>

                <div className='pt-6'>
                  <h2 className='text-xl font-semibold mb-4'>Index Faces</h2>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        S3 Bucket Name
                      </label>
                      <input
                        type='text'
                        value={bucketName}
                        onChange={(e) => setBucketName(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='your-bucket-name'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Folder Path
                      </label>
                      <input
                        type='text'
                        value={folderPath}
                        onChange={(e) => setFolderPath(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='ahmed/'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Person ID
                      </label>
                      <input
                        type='text'
                        value={personId}
                        onChange={(e) => setPersonId(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                        placeholder='ahmed'
                      />
                    </div>

                    <button
                      onClick={handleIndexFaces}
                      className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    >
                      Index Faces
                    </button>
                  </div>
                </div>

                {status && (
                  <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                    <p className='text-blue-800 font-medium'>{status}</p>
                  </div>
                )}

                {logs.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-medium'>Activity Log</h3>
                    <div className='mt-2 max-h-60 overflow-y-auto p-3 bg-gray-100 rounded-lg text-sm'>
                      {logs.map((log, index) => (
                        <div key={index} className='py-1'>
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
