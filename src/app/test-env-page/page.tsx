'use client';

import { useState, useEffect } from 'react';

export default function TestEnvPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAIResponse, setOpenAIResponse] = useState<any>(null);
  const [openAIError, setOpenAIError] = useState<string | null>(null);
  const [openAILoading, setOpenAILoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/test-env');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const testOpenAI = async () => {
    setOpenAILoading(true);
    setOpenAIResponse(null);
    setOpenAIError(null);
    
    try {
      const response = await fetch('/api/openai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Hello, are you working?' }
          ]
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      setOpenAIResponse(result);
    } catch (e) {
      setOpenAIError(e instanceof Error ? e.message : 'Unknown error');
      console.error('Error testing OpenAI:', e);
    } finally {
      setOpenAILoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      {loading ? (
        <p>Loading environment data...</p>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">Error: {error}</p>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Environment Data:</h2>
          <p><strong>API Key Exists:</strong> {data.keyExists ? 'Yes' : 'No'}</p>
          <p><strong>API Key Preview:</strong> {data.keyFirstChars}</p>
          <div>
            <strong>Available Environment Variables:</strong>
            <ul className="list-disc pl-5">
              {data.envVars.map((key: string) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <button 
          onClick={testOpenAI}
          disabled={openAILoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {openAILoading ? 'Testing...' : 'Test OpenAI API'}
        </button>
      </div>
      
      {openAIError && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2">OpenAI Test Error:</h2>
          <p className="text-red-700">{openAIError}</p>
        </div>
      )}
      
      {openAIResponse && (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">OpenAI Test Response:</h2>
          <pre className="bg-white p-3 rounded border">{JSON.stringify(openAIResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 