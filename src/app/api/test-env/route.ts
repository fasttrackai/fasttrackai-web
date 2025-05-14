export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  return new Response(
    JSON.stringify({
      keyExists: !!apiKey,
      keyFirstChars: apiKey ? apiKey.substring(0, 10) + '...' : 'No key found',
      envVars: Object.keys(process.env).filter(key => 
        !key.includes('PATH') && 
        !key.includes('TEMP') && 
        !key.includes('TMP')
      )
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    }
  );
} 