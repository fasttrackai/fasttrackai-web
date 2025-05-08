import OpenAI from 'openai';

export const runtime = "edge";

interface ChatMessage {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_openai_api_key')) {
      console.error('OpenAI API key missing or invalid');
      throw new Error('OpenAI API key not properly configured');
    }

    const { messages } = await req.json();
    
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid or empty messages array');
    }

    // Create OpenAI client with timeout configuration
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for edge runtime
      timeout: 15000 // 15 second timeout
    });

    // Make the API request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Reliable and cost-effective
      messages: messages.map((m: ChatMessage) => ({
        role: m.role as 'system' | 'user' | 'assistant',
        content: m.content
      })),
      temperature: 0.7,
      max_tokens: 600, // Slightly increased for more detailed responses
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

  } catch (error) {
    console.error('OpenAI API error:', error instanceof Error ? error.message : 'Unknown error');
    
    let errorMessage = "I apologize, but I encountered an error processing your request.";
    
    // Add more specific error messages based on common issues
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = "API configuration issue. Please contact the site administrator.";
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorMessage = "The request took too long to process. Please try again with a simpler question.";
      } else if (error.message.includes('rate limit')) {
        errorMessage = "Too many requests at once. Please try again in a moment.";
      }
    }
    
    return new Response(
      JSON.stringify({
        role: "assistant",
        content: errorMessage,
        id: Date.now().toString()
      }),
      {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        },
        status: 200 // Using 200 for client-friendly error handling
      }
    );
  }
}
