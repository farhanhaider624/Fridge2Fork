'use client';

import Link from 'next/link';
import { UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <span className="text-blue-500">🍴</span> Recipe2Fork
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/favorites" className="text-gray-600 hover:text-gray-900">
            Favorites
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <UserIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
