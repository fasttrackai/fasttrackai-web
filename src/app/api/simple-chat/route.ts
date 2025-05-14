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
        content: 'You are an AI Business Advisor for fasttrackai, specializing in helping businesses implement AI solutions. You provide guidance on AI strategy, implementation, and best practices. Your tone is professional, knowledgeable, and helpful. You avoid technical jargon unless necessary and focus on practical, business-oriented advice. When discussing fasttrackai services, emphasize the company\'s expertise in rapid AI implementation, enhanced business valuation, and M&A readiness through AI integration. Provide concise, actionable responses that demonstrate understanding of various industries and business challenges.'
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