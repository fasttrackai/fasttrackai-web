'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

export default function SimpleChatTest() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/simple-chat',
    onError: (err) => {
      console.error('Chat error:', err);
    }
  });

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Chat Test (Alternative API)</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          <strong>Error:</strong> {error.message}
        </div>
      )}
      
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
        
        {isLoading && (
          <div className="flex justify-center items-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          className="flex-1 p-2 border rounded"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-blue-300"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
} 