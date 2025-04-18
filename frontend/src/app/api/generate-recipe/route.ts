import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    console.log('Received ingredients:', ingredients);

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid list of ingredients' },
        { status: 400 }
      );
    }

    const prompt = `Create 3 different recipes using these ingredients: ${ingredients.join(', ')}.
    Return the recipes in this exact JSON format:
    {
      "recipes": [
        {
          "title": "Recipe name 1",
          "ingredients": ["2 cups ingredient1", "1 tsp ingredient2"],
          "instructions": ["Step 1: Do this", "Step 2: Do that"],
          "cookingTime": "30 minutes",
          "servings": 4,
          "difficulty": "Easy"
        },
        {
          "title": "Recipe name 2",
          "ingredients": ["2 cups ingredient1", "1 tsp ingredient2"],
          "instructions": ["Step 1: Do this", "Step 2: Do that"],
          "cookingTime": "30 minutes",
          "servings": 4,
          "difficulty": "Easy"
        },
        {
          "title": "Recipe name 3",
          "ingredients": ["2 cups ingredient1", "1 tsp ingredient2"],
          "instructions": ["Step 1: Do this", "Step 2: Do that"],
          "cookingTime": "30 minutes",
          "servings": 4,
          "difficulty": "Easy"
        }
      ]
    }`;

    console.log('Sending prompt to Gemini:', prompt);

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log('Response text:', text);
      
      try {
        // Remove markdown code block formatting if present
        const cleanText = text.replace(/```json\n|\n```/g, '').trim();
        const data = JSON.parse(cleanText);
        console.log('Parsed recipe data:', data);

        // Add image URLs to each recipe
        const recipes = data.recipes.map((recipe: any) => ({
          ...recipe,
          imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
        }));

        return NextResponse.json({ recipes });
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw text that failed to parse:', text);
        return NextResponse.json(
          { error: 'Failed to parse recipe data', details: text },
          { status: 500 }
        );
      }
    } catch (generateError) {
      console.error('Content generation error:', generateError);
      return NextResponse.json(
        { error: 'Failed to generate content', details: generateError instanceof Error ? generateError.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Recipe generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 