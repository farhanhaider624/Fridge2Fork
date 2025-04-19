'use client';

import React, { createContext, useState, useContext } from 'react';
import { Recipe } from './FavoritesContext';

interface RecipesContextType {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  showGenerateMore: boolean;
  setShowGenerateMore: React.Dispatch<React.SetStateAction<boolean>>;
  recipeBatches: number[];
  setRecipeBatches: React.Dispatch<React.SetStateAction<number[]>>;
}

const RecipesContext = createContext<RecipesContextType>({
  recipes: [],
  setRecipes: () => {},
  ingredients: [],
  setIngredients: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
  showGenerateMore: false,
  setShowGenerateMore: () => {},
  recipeBatches: [],
  setRecipeBatches: () => {},
});

export const useRecipes = () => useContext(RecipesContext);

export const RecipesProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateMore, setShowGenerateMore] = useState(false);
  const [recipeBatches, setRecipeBatches] = useState<number[]>([]);

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        setRecipes,
        ingredients,
        setIngredients,
        isLoading,
        setIsLoading,
        error,
        setError,
        showGenerateMore,
        setShowGenerateMore,
        recipeBatches,
        setRecipeBatches,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};
