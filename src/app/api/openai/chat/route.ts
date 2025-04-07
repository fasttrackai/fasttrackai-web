import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";
import { mockChatMessages } from "@/lib/config/development";

export const runtime = "edge";

// Define the message type to match both user input and mock data
interface ChatMessage {
  role: string;
  content: string;
}

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
    
    // Return mocked streamed response
    return new Response(mockResponse, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  
  // Use real OpenAI API if key is available
  try {
    const result = await streamText({
      model: openai("gpt-4"),
      messages: convertToCoreMessages(messages),
      system: "You are a helpful AI assistant that specializes in AI integration for businesses. You provide concise, practical advice on how AI can improve various business processes.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return a more specific error message
    return NextResponse.json(
      { 
        error: 'There was an error processing your request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
