interface LogsDisplayProps {
  logs: string[];
  status: string;
}

export function LogsDisplay({ logs, status }: LogsDisplayProps) {
  return (
    <>
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
    </>
  );
}
