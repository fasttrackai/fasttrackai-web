import { anthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";
import { mockChatMessages } from "@/lib/config/development";

export const runtime = "edge";

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Use mock data in development if no API key is available
  if (!process.env.ANTHROPIC_API_KEY && process.env.NODE_ENV === 'development') {
    console.log('Using mock data for Anthropic chat response');
    
    // Simple logic to generate a mock response based on the user's last message
    const lastUserMessage = messages.filter((m: ChatMessage) => m.role === 'user').pop()?.content || '';
    
    let mockResponse = "I'm Claude, an AI assistant specializing in business AI integration strategies.";
    
    // Find a relevant mock response if possible
    if (lastUserMessage.toLowerCase().includes('customer service')) {
      mockResponse = mockChatMessages.find((m) => 
        m.role === 'assistant' && 
        m.content.toLowerCase().includes('customer service')
      )?.content || mockResponse;
    }
    
    // Return mocked streamed response
    return new Response(mockResponse, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  
  // Use real Anthropic API
  try {
    const result = await streamText({
      model: anthropic("claude-3-5-sonnet-20240620"),
      messages: convertToCoreMessages(messages),
      system: "You are Claude, an AI assistant that specializes in business AI integration. You provide strategic advice on how AI can transform business operations and increase company valuation.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Anthropic API error:', error);
    return NextResponse.json(
      { error: 'There was an error processing your request' },
      { status: 500 }
    );
  }
}
