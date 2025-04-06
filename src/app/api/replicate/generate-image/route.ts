import { NextResponse } from "next/server";
import Replicate from "replicate";
import { mockImageGenerationPrompts } from "@/lib/config/development";

// Initialize Replicate client if the API token is available
const getReplicate = () => {
  if (process.env.REPLICATE_API_TOKEN) {
    return new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
  return null;
};

export async function POST(request: Request) {
  const { prompt } = await request.json();

  // Use mock data in development if no API token is available
  if (!process.env.REPLICATE_API_TOKEN && process.env.NODE_ENV === 'development') {
    console.log('Using mock data for Replicate image generation');
    
    // Generate a placeholder image URL based on the prompt
    const sanitizedPrompt = encodeURIComponent(prompt.slice(0, 30));
    
    // Return a placeholder image with the prompt as text
    const mockImageUrl = `https://placehold.co/600x400/9333ea/ffffff?text=${sanitizedPrompt}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json({ output: [mockImageUrl] }, { status: 200 });
  }

  // Use real Replicate API
  try {
    const replicate = getReplicate();
    
    if (!replicate) {
      throw new Error(
        "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
      );
    }

    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: prompt,
          image_dimensions: "512x512",
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
        },
      }
    );

    return NextResponse.json({ output }, { status: 200 });
  } catch (error) {
    console.error("Error from Replicate API:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
