import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HeartIcon, ShareIcon, PrinterIcon, ClockIcon, UserIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface RecipeCardProps {
  recipe: {
    title: string;
    imageUrl: string;
    cookingTime: string;
    servings: number;
    difficulty: string;
    ingredients: string[];
    instructions: string[];
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export default function RecipeCard({ recipe, isExpanded, onToggle }: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: recipe.title,
        text: `Check out this recipe for ${recipe.title}!`,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Sharing failed:', error);
    }
  };

  const adjustServings = (multiplier: number) => {
    setServingMultiplier(multiplier);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 group">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <ShareIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <PrinterIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {recipe.cookingTime}
          </span>
          <span className="flex items-center gap-1">
            <UserIcon className="w-4 h-4" />
            {recipe.servings * servingMultiplier} servings
          </span>
          <span className="flex items-center gap-1">
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            {recipe.difficulty}
          </span>
        </div>
        
        {isExpanded && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Adjust servings:</span>
            <button
              onClick={() => adjustServings(Math.max(0.5, servingMultiplier - 0.5))}
              className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              -
            </button>
            <span className="text-sm font-medium">{servingMultiplier}x</span>
            <button
              onClick={() => adjustServings(servingMultiplier + 0.5)}
              className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={onToggle}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-gray-700">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 