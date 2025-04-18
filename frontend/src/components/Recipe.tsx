'use client';

import { motion } from 'framer-motion';

export interface RecipeType {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
  servings?: number;
  difficulty?: string;
  imageUrl?: string;
}

interface RecipeProps {
  recipe: RecipeType;
}

export default function Recipe({ recipe }: RecipeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {recipe.imageUrl && (
        <div className="w-full h-64 relative">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          {recipe.title}
        </motion.h2>

        {(recipe.cookingTime || recipe.servings || recipe.difficulty) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mb-4 text-sm text-gray-600"
          >
            {recipe.cookingTime && (
              <div>
                <span className="font-semibold">Time:</span> {recipe.cookingTime}
              </div>
            )}
            {recipe.servings && (
              <div>
                <span className="font-semibold">Servings:</span> {recipe.servings}
              </div>
            )}
            {recipe.difficulty && (
              <div>
                <span className="font-semibold">Difficulty:</span> {recipe.difficulty}
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {recipe.ingredients.map((ingredient, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {ingredient}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            {recipe.instructions.map((instruction, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="leading-relaxed"
              >
                {instruction}
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </motion.div>
  );
} 