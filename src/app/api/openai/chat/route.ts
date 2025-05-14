import OpenAI from 'openai';

export const runtime = "edge";

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Check if API key is available and valid
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openai_api_key')) {
      console.error('OpenAI API key missing or invalid');
      return new Response(
        JSON.stringify({
          role: "assistant",
          content: "API configuration issue. Please contact the site administrator.",
          id: Date.now().toString()
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    const { messages } = await req.json();
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          role: "assistant",
          content: "Invalid or empty messages array.",
          id: Date.now().toString()
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Required for edge runtime
    });

    try {
      // Make the API request
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages.map((m: ChatMessage) => ({
          role: m.role as 'system' | 'user' | 'assistant',
          content: m.content
        })),
        temperature: 0.7,
        max_tokens: 600,
      });

      const response = completion.choices[0]?.message;
      
      if (!response || !response.content || response.content.trim() === '') {
        throw new Error('Empty response from OpenAI');
      }

      // Return the response
      return new Response(
        JSON.stringify({
          role: response.role,
          content: response.content,
          id: Date.now().toString()
        }),
        {
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          },
          status: 200
        }
      );
    } catch (openaiError) {
      console.error('OpenAI API request error:', openaiError);
      
      return new Response(
        JSON.stringify({
          role: "assistant",
          content: "I'm having trouble connecting to my knowledge base. Please try again in a moment.",
          id: Date.now().toString()
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('General error in OpenAI route handler:', error);
    
    return new Response(
      JSON.stringify({
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request.",
        id: Date.now().toString()
      }),
      {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        },
        status: 200
      }
    );
  }
}
