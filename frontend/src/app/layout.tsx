import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { RecipesProvider } from "@/context/RecipesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fridge2Fork - Smart Recipe Generator",
  description: "Transform your available ingredients into personalized recipes with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecipesProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </RecipesProvider>
      </body>
    </html>
  );
}
