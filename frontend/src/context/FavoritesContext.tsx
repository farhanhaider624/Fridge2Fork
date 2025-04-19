'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the type for a recipe
export interface Recipe {
  id?: string;
  title: string;
  imageUrl: string;
  cookingTime: string;
  servings: number;
  difficulty: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
}

// Define the context type
interface FavoritesContextType {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (recipe: Recipe) => void;
  isFavorite: (recipe: Recipe) => boolean;
}

// Create the context with default values
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

// Custom hook to use the favorites context
export const useFavorites = () => useContext(FavoritesContext);

// Provider component
export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage if available
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    }
    return [];
  });

  // Update localStorage when favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Add a recipe to favorites
  const addFavorite = (recipe: Recipe) => {
    // Generate a unique ID if not present
    const recipeWithId = recipe.id
      ? recipe
      : { ...recipe, id: `recipe-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` };

    setFavorites((prev) => [...prev, recipeWithId]);
  };

  // Remove a recipe from favorites
  const removeFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      // First try to filter by ID if available
      if (recipe.id) {
        const filtered = prev.filter(fav => fav.id !== recipe.id);
        // If we removed something, return the filtered list
        if (filtered.length < prev.length) return filtered;
      }

      // Otherwise filter by title
      return prev.filter(fav =>
        fav.title.toLowerCase().trim() !== recipe.title.toLowerCase().trim()
      );
    });
  };

  // Check if a recipe is in favorites
  const isFavorite = (recipe: Recipe) => {
    // First try to match by ID if available
    if (recipe.id) {
      const matchById = favorites.some(fav => fav.id === recipe.id);
      if (matchById) return true;
    }

    // If no ID match, try to match by title (more reliable than ID for recipes without explicit IDs)
    const matchByTitle = favorites.some(fav =>
      fav.title.toLowerCase().trim() === recipe.title.toLowerCase().trim()
    );

    return matchByTitle;
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
