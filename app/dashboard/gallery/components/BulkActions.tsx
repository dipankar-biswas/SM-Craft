'use client';

import { useState } from 'react';
import { Trash2, FolderTree, ChevronDown } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkCategoryUpdate: (category: string) => void;
  categories: string[];
}

export default function BulkActions({
  selectedCount,
  onBulkDelete,
  onBulkCategoryUpdate,
  categories
}: BulkActionsProps) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={onBulkDelete}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
        Delete ({selectedCount})
      </button>
      
      <div className="relative">
        <button
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FolderTree className="w-5 h-5" />
          Change Category ({selectedCount})
          <ChevronDown className="w-4 h-4" />
        </button>
        
        {showCategoryMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowCategoryMenu(false)}
            />
            <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-[200px]">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    onBulkCategoryUpdate(category);
                    setShowCategoryMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}