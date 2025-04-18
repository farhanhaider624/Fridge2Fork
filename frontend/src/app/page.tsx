'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeCard from '@/components/RecipeCard';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState<number | null>(null);

  const handleAddIngredient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      setIngredients([...ingredients, e.currentTarget.value.trim()]);
      e.currentTarget.value = '';
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExpandedRecipeIndex(null); // Reset expanded state when generating new recipes

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipes');
      }

      setRecipes(data.recipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRecipe = (index: number) => {
    setExpandedRecipeIndex(expandedRecipeIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Fridge2Fork</h1>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Ingredients</h2>
            <input
              type="text"
              placeholder="Type an ingredient and press Enter"
              onKeyDown={handleAddIngredient}
              className="w-full p-2 border rounded mb-4"
            />
            
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredients.map((ingredient, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {ingredient}
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>

            <button
              onClick={handleGenerateRecipes}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Generating Recipes...' : 'Generate Recipes'}
            </button>

            {error && (
              <p className="text-red-500 mt-4 text-center">{error}</p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {recipes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {recipes.map((recipe, index) => (
                <div key={index} className="w-full">
                  <RecipeCard 
                    recipe={recipe}
                    isExpanded={expandedRecipeIndex === index}
                    onToggle={() => handleToggleRecipe(index)}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
