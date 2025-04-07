import { OpenAI } from "openai";
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";
import { mockChatMessages } from "@/lib/config/development";

export const runtime = "edge";

// Define the message type to match both user input and mock data
interface ChatMessage {
  role: string;
  content: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Use mock data if no API key is available (in any environment)
  if (!process.env.OPENAI_API_KEY) {
    console.log('Using mock data for OpenAI chat response - API key not found');
    
    // Simple logic to generate a mock response based on the user's last message
    const lastUserMessage = messages.filter((m: ChatMessage) => m.role === 'user').pop()?.content || '';
    
    let mockResponse = "I'm here to help with your AI integration questions.";
    
    // Find a relevant mock response if possible
    if (lastUserMessage.toLowerCase().includes('customer service')) {
      mockResponse = mockChatMessages.find((m) => 
        m.role === 'assistant' && 
        m.content.toLowerCase().includes('customer service')
      )?.content || mockResponse;
    } else if (lastUserMessage.toLowerCase().includes('industry')) {
      mockResponse = "Thank you for sharing that information. Could you tell me more about your annual revenue range? This will help me better assess the potential AI impact for your business.";
    } else if (lastUserMessage.toLowerCase().includes('revenue')) {
      mockResponse = "I see. Do you currently collect and store digital data about your operations, customers, or processes? This is important for understanding your AI readiness.";
    }
    
    // Create a ReadableStream to simulate streaming response
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(mockResponse));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
  
  // Use real OpenAI API
  try {
    console.log('Attempting to call OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: true
    });

    // Convert the stream to text
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    // Log detailed error information
    console.error('OpenAI API error details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });

    // Return a more informative error response
    return NextResponse.json(
      { 
        error: 'There was an error processing your request',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
