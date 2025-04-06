import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = 'edge';

const systemPrompt = `You are an AI business advisor helping qualify potential clients for AI integration services. 
Your goal is to gather information about their business and needs through a friendly, professional conversation.
Ask follow-up questions based on their responses to better understand their needs.
Keep responses concise and focused on understanding their business challenges and AI opportunities.
After gathering information, guide them towards scheduling a consultation.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
} 