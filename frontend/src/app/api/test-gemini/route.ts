import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET() {
  try {
    // Simple test prompt
    const prompt = 'Return a simple JSON response in this format: {"message": "Hello from Gemini!"}';
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log('Raw response text:', text);

    try {
      const data = JSON.parse(text.trim());
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Raw text that failed to parse:', text);
      return NextResponse.json(
        { error: 'Parse error', details: text },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'API error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 