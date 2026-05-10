'use client';

import { useState } from 'react';
import { X, AlertTriangle, FolderTree, Loader2 } from 'lucide-react';
import { GalleryCategory } from '@/types/gallery.types';

interface DeleteCategoryModalProps {
  category: GalleryCategory;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function DeleteCategoryModal({ category, onConfirm, onClose }: DeleteCategoryModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Category
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete the category "<strong>{category.name}</strong>"?
          </p>
          
          {category.imageCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    This category contains {category.imageCount} images
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Deleting this category will not delete the images, but they will need to be reassigned to another category.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{category.name}</p>
                <p className="text-sm text-gray-500">{category.imageCount || 0} images</p>
                <p className="text-xs text-gray-400">ID: {category.id}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}