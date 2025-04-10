'use client';

import { useState } from 'react';

export default function TestEmail() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testEmail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-resend');
      const data = await response.json();
      setResult(data);
      
      if (!data.success) {
        setError(data.message || 'Failed to send email');
      }
    } catch (err) {
      setError('Error testing email: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Resend Email Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={testEmail}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-200 text-red-700 rounded">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-gray-100 border border-gray-200 rounded">
          <h3 className="font-bold mb-2">API Response</h3>
          <pre className="bg-white p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded">
        <h3 className="font-bold mb-2">Current Resend Configuration</h3>
        <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_RESEND_API_KEY_EXISTS ? '✅ Configured' : '❌ Not found'}</p>
        <p><strong>From Email:</strong> {process.env.NEXT_PUBLIC_EMAIL_FROM || 'Not configured as public env var'}</p>
        <p className="mt-4 text-sm text-gray-500">Note: For security, we only check if the API key exists, not its value.</p>
      </div>
    </div>
  );
} 