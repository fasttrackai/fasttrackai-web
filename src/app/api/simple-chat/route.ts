import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Extract the messages from the body of the request
    const { messages } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    
    if (!apiKey || apiKey.trim() === '') {
      return new Response(
        JSON.stringify({
          error: 'Missing OpenAI API key. Please add it to your environment variables.'
        }),
        { status: 400 }
      );
    }

    // Create an OpenAI client
    const openai = new OpenAI({
      apiKey
    });

    // Add an AI advisor system prompt
    const enhancedMessages = [
      {
        role: 'system',
        content: 'You are an AI Business Advisor for fasttrackai. Be concise and direct - keep responses under 3 sentences when possible. Avoid lengthy explanations. Focus on actionable insights for AI implementation. When discussing fasttrackai services, emphasize rapid implementation, enhanced business valuation, and M&A readiness through AI integration.'
      },
      ...messages
    ];

    // Request the OpenAI API for the response
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      temperature: 0.7,
      max_tokens: 800,
      messages: enhancedMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in simple-chat API route:', error);
    
    // Return a more detailed error response
    return new Response(
      JSON.stringify({
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        id: Date.now().toString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 