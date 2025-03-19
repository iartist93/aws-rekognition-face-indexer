'use client';

import { useState } from 'react';
import { CreateCollection } from '@/components/CreateCollection';
import { IndexFaces } from '@/components/IndexFaces';
import { LogsDisplay } from '@/components/LogsDisplay';
import { VideoFaceSearch } from '@/components/VideoFaceSearch';
import { GetFaceSearch } from '@/components/GetFaceSearch';

export default function Home() {
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
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

                <CreateCollection addLog={addLog} setStatus={setStatus} />
                <IndexFaces addLog={addLog} setStatus={setStatus} />
                <VideoFaceSearch addLog={addLog} setStatus={setStatus} />
                <GetFaceSearch addLog={addLog} setStatus={setStatus} />
                <LogsDisplay logs={logs} status={status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
