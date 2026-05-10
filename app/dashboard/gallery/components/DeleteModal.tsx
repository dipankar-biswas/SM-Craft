'use client';

import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { GalleryImage } from '@/types/gallery.types';

interface DeleteModalProps {
  image: GalleryImage;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function DeleteModal({ image, onConfirm, onClose }: DeleteModalProps) {
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
            Delete Image
          </h3>
          
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete "<strong>{image.title}</strong>"? 
            This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{image.title}</p>
                <p className="text-sm text-gray-500">{image.category}</p>
                <p className="text-xs text-gray-400">ID: {image.id}</p>
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
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}