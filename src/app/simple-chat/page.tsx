'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

export default function SimpleChat() {
  const [apiKey, setApiKey] = useState(process.env.OPENAI_API_KEY || '');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/openai/chat',
    onFinish: () => {
      console.log('Chat finished');
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const checkApiKey = async () => {
    try {
      const res = await fetch('/api/test-env');
      const data = await res.json();
      console.log('API Key Status:', data);
      setApiKeyStatus(data.keyExists ? 'valid' : 'invalid');
    } catch (error) {
      console.error('Error checking API key:', error);
      setApiKeyStatus('invalid');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Chat Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-medium mb-2">API Key Status</h2>
        <button 
          onClick={checkApiKey}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Check API Key
        </button>
        
        {apiKeyStatus !== 'unknown' && (
          <div className={`mt-2 p-2 rounded ${apiKeyStatus === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            API Key is {apiKeyStatus === 'valid' ? 'valid' : 'invalid or missing'}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto border rounded p-4 mb-4">
        {messages.map((m, index) => (
          <div 
            key={index}
            className={`mb-3 p-3 rounded-lg ${
              m.role === 'user' ? 'bg-blue-100 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            <div className="text-sm font-semibold mb-1">{m.role === 'user' ? 'You' : 'AI'}</div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          className="flex-1 p-2 border rounded"
        />
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
} 