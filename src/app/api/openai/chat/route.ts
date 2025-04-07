import OpenAI from 'openai';

export const runtime = "edge";

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API Key available:', !!apiKey); // Log if API key exists

    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { messages } = await req.json();
    console.log('Received messages:', JSON.stringify(messages)); // Log received messages

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.openai.com/v1'
    });

    console.log('Making OpenAI API request...'); // Log before API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a more reliable model for testing
      messages: messages.map((m: ChatMessage) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content
      })),
      temperature: 0.7,
      max_tokens: 1000
    });
    console.log('OpenAI API request successful'); // Log after API call

    const response = completion.choices[0]?.message;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    console.log('Sending response:', response); // Log response being sent
    return new Response(
      JSON.stringify({
        role: response.role,
        content: response.content,
        id: Date.now().toString()
      }),
      {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store' // Prevent caching
        },
        status: 200
      }
    );

  } catch (error) {
    // Detailed error logging
    console.error('Chat API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    
    // Return a user-friendly error message
    return new Response(
      JSON.stringify({
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again in a moment.",
        id: Date.now().toString()
      }),
      {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store' // Prevent caching
        },
        status: 200 // Keep 200 to prevent client-side issues
      }
    );
  }
}
