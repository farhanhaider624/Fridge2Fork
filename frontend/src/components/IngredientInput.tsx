'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface IngredientInputProps {
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (index: number) => void;
  onGenerateRecipe: () => void;
  ingredients: string[];
  isLoading?: boolean;
}

export default function IngredientInput({
  onAddIngredient,
  onRemoveIngredient,
  onGenerateRecipe,
  ingredients,
  isLoading = false
}: IngredientInputProps) {
  const [ingredient, setIngredient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) {
      onAddIngredient(ingredient.trim());
      setIngredient('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">What's in your kitchen?</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Enter an ingredient (e.g. chicken, tomatoes, pasta)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-4 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add</span>
          </motion.button>
        </div>
      </motion.div>

      {ingredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            <AnimatePresence>
              {ingredients.map((ing, index) => (
                <motion.div
                  key={`${ing}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full flex items-center gap-1"
                >
                  <span>{ing}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemoveIngredient(index)}
                    className="text-gray-500 hover:text-gray-700 ml-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGenerateRecipe}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                <span>Generating Recipes...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Recipes</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}