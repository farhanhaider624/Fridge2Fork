import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
  try {
    // List available models
    const models = await genAI.listModels();
    console.log('Available models:', models);
    
    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error listing models:', error);
    return NextResponse.json(
      { error: 'Failed to list models', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 