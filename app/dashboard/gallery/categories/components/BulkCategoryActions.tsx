'use client';

import { Trash2, Eye, EyeOff } from 'lucide-react';

interface BulkCategoryActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
}

export default function BulkCategoryActions({
  selectedCount,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate
}: BulkCategoryActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={onBulkActivate}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Eye className="w-5 h-5" />
        Activate ({selectedCount})
      </button>
      
      <button
        onClick={onBulkDeactivate}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <EyeOff className="w-5 h-5" />
        Deactivate ({selectedCount})
      </button>
      
      <button
        onClick={onBulkDelete}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
        Delete ({selectedCount})
      </button>
    </div>
  );
}