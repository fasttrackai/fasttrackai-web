import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    // Provide a mock key for development if no API key is available
    if (!process.env.DEEPGRAM_API_KEY && process.env.NODE_ENV === 'development') {
        console.log('Using mock data for Deepgram API');
        return NextResponse.json({
            key: "mock-deepgram-api-key-for-development",
            isMock: true
        });
    }

    // Use real API key in production
    return NextResponse.json({
        key: process.env.DEEPGRAM_API_KEY || "",
    });
}
