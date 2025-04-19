/**
 * Generates an image URL for a recipe based on its title
 * Uses Unsplash Source API to get relevant food images
 * 
 * @param {string} recipeTitle - The title of the recipe
 * @returns {string} - URL to an image related to the recipe
 */
export function getRecipeImageUrl(recipeTitle) {
  if (!recipeTitle) return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop';
  
  // Clean the recipe title to create a better search term
  const searchTerm = recipeTitle
    .toLowerCase()
    .replace(/with.*$/, '') // Remove "with..." parts
    .replace(/and.*$/, '') // Remove "and..." parts
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim();
  
  // Use Unsplash Source API to get a relevant image
  // The width parameter ensures we get a reasonably sized image
  return `https://source.unsplash.com/800x600/?food,${encodeURIComponent(searchTerm)}`;
}

/**
 * Gets a backup image URL if the primary image fails to load
 * 
 * @returns {string} - URL to a generic food image
 */
export function getBackupImageUrl() {
  const backupImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
  ];
  
  // Return a random backup image from the array
  return backupImages[Math.floor(Math.random() * backupImages.length)];
}
