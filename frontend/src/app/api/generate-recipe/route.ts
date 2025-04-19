import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRecipeImageUrl } from '@/utils/imageUtils';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: Request) {
  try {
    const { ingredients, existingRecipes = [] } = await request.json();
    console.log('Received ingredients:', ingredients);
    console.log('Existing recipes count:', existingRecipes.length);

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide a valid list of ingredients' },
        { status: 400 }
      );
    }

    // Build a prompt that will generate diverse recipes
    let prompt = `Create 3 different recipes using these ingredients: ${ingredients.join(', ')}.
    `;

    // If there are existing recipes, ask for different ones
    if (existingRecipes.length > 0) {
      prompt += `\nMake sure these recipes are DIFFERENT from the following existing recipes:\n`;
      existingRecipes.forEach((recipe: any, index: number) => {
        prompt += `${index + 1}. ${recipe.title}\n`;
      });
      prompt += `\nCreate completely different types of dishes that are not similar to the ones above.\n`;
    }

    prompt += `Return the recipes in this exact JSON format:
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

        // Add image URLs to each recipe based on their titles
        const recipes = data.recipes.map((recipe: any) => ({
          ...recipe,
          imageUrl: getRecipeImageUrl(recipe.title),
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