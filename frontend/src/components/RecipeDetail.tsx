'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ClockIcon, UserIcon, HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { getRecipeImageUrl, getBackupImageUrl } from '@/utils/imageUtils';
import { useFavorites, Recipe } from '@/context/FavoritesContext';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

export default function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();
  // Use local state to track liked status
  const [isLiked, setIsLiked] = useState(isFavorite(recipe));

  // Update local state when favorites change
  useEffect(() => {
    setIsLiked(isFavorite(recipe));
  }, [favorites, recipe, isFavorite]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLiked) {
      removeFavorite(recipe);
      setIsLiked(false); // Immediately update UI
    } else {
      // Ensure recipe has an ID before adding to favorites
      const recipeWithId = recipe.id
        ? recipe
        : { ...recipe, id: `recipe-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };

      addFavorite(recipeWithId);
      setIsLiked(true); // Immediately update UI
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg overflow-hidden shadow-md"
    >
      <div className="relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
        </button>

        <div className="h-64 relative">
          <img
            src={recipe.imageUrl || getRecipeImageUrl(recipe.title)}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // If the image fails to load, use a backup image
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = getBackupImageUrl();
            }}
          />
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
          <button
            onClick={handleLikeClick}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            type="button"
          >
            {isLiked ? (
              <HeartSolid className="w-6 h-6 text-red-500" />
            ) : (
              <HeartOutline className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6 text-gray-600">
          <span className="flex items-center gap-1">
            <ClockIcon className="w-5 h-5" />
            {recipe.cookingTime}
          </span>
          <span className="flex items-center gap-1">
            <UserIcon className="w-5 h-5" />
            {recipe.servings} servings
          </span>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Instructions</h2>
          <ol className="space-y-6">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <p className="text-gray-700">
                    {instruction}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </motion.div>
  );
}
