'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeCard from '@/components/RecipeCard';
import IngredientInput from '@/components/IngredientInput';
import Header from '@/components/Header';
import LoadingAnimation from '@/components/LoadingAnimation';
import RecipeDetail from '@/components/RecipeDetail';
import { useRecipes } from '@/context/RecipesContext';

export default function Home() {
  // Use global state from context
  const {
    recipes, setRecipes,
    ingredients, setIngredients,
    isLoading, setIsLoading,
    error, setError,
    showGenerateMore, setShowGenerateMore,
    recipeBatches, setRecipeBatches
  } = useRecipes();

  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number | null>(null);

  const handleAddIngredient = (ingredient: string) => {
    setIngredients([...ingredients, ingredient]);
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
    setSelectedRecipeIndex(null); // Reset selected recipe when generating new recipes

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          existingRecipes: [] // No existing recipes for initial generation
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipes');
      }

      setRecipes(data.recipes);
      setRecipeBatches([data.recipes.length]); // Track the number of recipes in the first batch
      setShowGenerateMore(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecipe = (index: number) => {
    setSelectedRecipeIndex(index);
  };

  const handleBackToList = () => {
    setSelectedRecipeIndex(null);
  };

  const handleGenerateMore = async () => {
    // Keep the existing recipes and add more
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          existingRecipes: recipes // Pass existing recipes to avoid duplicates
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipes');
      }

      // Append new recipes to existing ones
      setRecipes([...recipes, ...data.recipes]);

      // Keep track of batches internally (might be useful for future features)
      setRecipeBatches([...recipeBatches, data.recipes.length]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {selectedRecipeIndex !== null ? (
          <div className="max-w-4xl mx-auto">
            <RecipeDetail
              recipe={recipes[selectedRecipeIndex]}
              onBack={handleBackToList}
            />
          </div>
        ) : (
          <>
            <div className="max-w-6xl mx-auto mb-8">
              <IngredientInput
                ingredients={ingredients}
                onAddIngredient={handleAddIngredient}
                onRemoveIngredient={handleRemoveIngredient}
                onGenerateRecipe={handleGenerateRecipes}
                isLoading={isLoading}
              />

              {error && (
                <p className="text-red-500 mt-4 text-center">{error}</p>
              )}
            </div>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto"
              >
                <LoadingAnimation />
              </motion.div>
            )}

            <AnimatePresence>
              {!isLoading && recipes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-6xl mx-auto"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Possible Recipes ({recipes.length})</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {recipes.map((recipe, index) => (
                      <div key={index} className="w-full">
                        <RecipeCard
                          recipe={recipe}
                          isExpanded={false}
                          onToggle={() => handleSelectRecipe(index)}
                        />
                      </div>
                    ))}
                  </div>

                  {showGenerateMore && (
                    <div className="flex justify-center mb-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerateMore}
                        className="px-6 py-2 bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Generate More
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}
