import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Check if API key is present (mock check, usually handled by SDK/Env)
  // If no key is configured, the SDK will throw. We can catch it or just let it fail.
  // For this demo, I'll add a fallback if the SDK call fails, or just assume it works.
  // But to be safe for the user's immediate testing without keys:
  
  try {
    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      system: "You are a helpful veterinary AI assistant. Provide triage advice but always disclaim that you are not a real vet. Structure your response with clear headings if needed.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.warn("AI SDK Error (likely missing key), falling back to mock stream:", error);
    
    // Fallback mock stream for demo purposes
    const stream = new ReadableStream({
      async start(controller) {
        const mockResponse = "I'm currently running in demo mode because the AI API key hasn't been configured yet. \n\nTo fix this, please add your `OPENAI_API_KEY` to the `.env` file.\n\nHowever, I can still simulate a response! Based on what you told me, I recommend monitoring your pet's symptoms. If they worsen, please consult a real veterinarian immediately.";
        const encoder = new TextEncoder();
        
        // Simulate streaming
        const chunks = mockResponse.split(" ");
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(`0:"${chunk} "\n`));
          await new Promise(r => setTimeout(r, 50));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
