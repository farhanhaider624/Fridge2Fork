import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon, AdjustmentsHorizontalIcon, HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { getRecipeImageUrl, getBackupImageUrl } from '@/utils/imageUtils';
import { useFavorites, Recipe } from '@/context/FavoritesContext';

interface RecipeCardProps {
  recipe: Recipe;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function RecipeCard({ recipe, isExpanded, onToggle }: RecipeCardProps) {
  const { favorites, isFavorite, addFavorite, removeFavorite } = useFavorites();
  // Use local state to track liked status
  const [isLiked, setIsLiked] = useState(isFavorite(recipe));

  // Update local state when favorites change
  useEffect(() => {
    setIsLiked(isFavorite(recipe));
  }, [favorites, recipe, isFavorite]);

  // Debug output to console
  console.log(`Recipe: ${recipe.title}, isLiked: ${isLiked}`);
  console.log(`Total favorites: ${favorites.length}`);
  if (favorites.length > 0) {
    console.log(`First favorite: ${favorites[0].title}`);
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    e.preventDefault(); // Prevent any default behavior

    console.log(`Like button clicked for: ${recipe.title}`);
    console.log(`Current isLiked state: ${isLiked}`);

    if (isLiked) {
      console.log(`Removing from favorites: ${recipe.title}`);
      removeFavorite(recipe);
      setIsLiked(false); // Immediately update UI
    } else {
      // Ensure recipe has an ID before adding to favorites
      const recipeWithId = recipe.id
        ? recipe
        : { ...recipe, id: `recipe-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };

      console.log(`Adding to favorites: ${recipeWithId.title} with ID: ${recipeWithId.id}`);
      addFavorite(recipeWithId);
      setIsLiked(true); // Immediately update UI
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex flex-col h-full">
        <div className="relative h-48">
          <img
            src={recipe.imageUrl || getRecipeImageUrl(recipe.title)}
            alt={recipe.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              // If the image fails to load, use a backup image
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = getBackupImageUrl();
            }}
          />
          <button
            onClick={handleLikeClick}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            type="button"
          >
            {isLiked ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartOutline className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-1">{recipe.title}</h3>

          {recipe.description && (
            <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
          )}

          <div className="flex gap-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {recipe.cookingTime}
            </span>
            <span className="flex items-center gap-1">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              {recipe.difficulty}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            {recipe.description || `A delicious ${recipe.title.toLowerCase()} made with ${recipe.ingredients.slice(0, 3).join(', ')}.`}
          </p>

          <div className="mt-auto pt-4">
            <button
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Recipe
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 max-h-[400px] overflow-y-auto"
          >
            <div className="space-y-6 p-4">
              <div>
                <h4 className="font-semibold mb-3 text-gray-800 border-b pb-2">Ingredients</h4>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-800 border-b pb-2">Instructions</h4>
                <ol className="list-decimal list-outside ml-5 space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
              <button
                onClick={onToggle}
                className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mt-4"
              >
                Close Recipe
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}