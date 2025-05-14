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
        content: `You are an AI Business Advisor for fasttrackai. Follow these guidelines:

1. Be concise and direct - keep responses under 2-3 sentences.
2. For assessment questions, only ask the exact question without additional commentary.
3. Do not attempt to provide recommendations until the full assessment is complete.
4. Do not ask follow-up questions unless explicitly instructed to ask for more details.
5. Stay focused on the current step of the assessment - do not jump ahead or backward.
6. When the user is confused, apologize briefly and return to the current assessment question.
7. Only when explicitly told the assessment is complete, provide industry-specific recommendations.
8. Each response should address only what the user just said - don't introduce new topics.
9. Never generate fictional follow-up questions that weren't part of the assessment script.
10. For chat mode (not assessment), you can be more conversational, but still keep answers brief.`
      },
      ...messages
    ];

    // Request the OpenAI API for the response
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      temperature: 0.3,
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