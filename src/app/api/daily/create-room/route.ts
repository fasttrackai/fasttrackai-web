import { NextResponse } from 'next/server';

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';

export async function POST() {
  // Use mock data in development if no API key is available
  if (!DAILY_API_KEY && process.env.NODE_ENV === 'development') {
    console.log('Using mock data for Daily.co room creation');
    
    // Create a mock room URL with a random ID
    const mockRoomId = Math.random().toString(36).substring(2, 10);
    const mockRoomUrl = `https://mock-daily-domain.daily.co/${mockRoomId}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json({ 
      url: mockRoomUrl,
      isMock: true
    });
  }
  
  if (!DAILY_API_KEY) {
    return NextResponse.json(
      { error: 'Daily.co API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Create a new room
    const response = await fetch(`${DAILY_API_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          enable_screenshare: true,
          enable_chat: true,
          start_video_off: false,
          start_audio_off: false,
          exp: Math.round(Date.now() / 1000) + 3600, // Room expires in 1 hour
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Daily.co room');
    }

    const data = await response.json();
    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    return NextResponse.json(
      { error: 'Failed to create video call room' },
      { status: 500 }
    );
  }
} 