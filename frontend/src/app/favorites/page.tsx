'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetail from '@/components/RecipeDetail';
import { useFavorites } from '@/context/FavoritesContext';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number | null>(null);

  const handleSelectRecipe = (index: number) => {
    setSelectedRecipeIndex(index);
  };

  const handleBackToList = () => {
    setSelectedRecipeIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {selectedRecipeIndex !== null ? (
          <div className="max-w-4xl mx-auto">
            <RecipeDetail
              recipe={favorites[selectedRecipeIndex]}
              onBack={handleBackToList}
            />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Favorite Recipes</h1>

            {favorites.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-500 mb-4 text-5xl">❤️</div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
                <p className="text-gray-600 mb-4">
                  Start adding recipes to your favorites by clicking the heart icon on any recipe card.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {favorites.map((recipe, index) => (
                      <div key={index} className="w-full">
                        <RecipeCard
                          recipe={recipe}
                          isExpanded={false}
                          onToggle={() => handleSelectRecipe(index)}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
