'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon } from 'lucide-react';
import { GalleryImage } from '@/types/gallery.types';

interface ImageTableProps {
  images: GalleryImage[];
  loading: boolean;
  selectedImages: number[];
  onSelectImage: (id: number) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (image: GalleryImage) => void;
  onDelete: (image: GalleryImage) => void;
}

export default function ImageTable({
  images,
  loading,
  selectedImages,
  onSelectImage,
  onSelectAll,
  onEdit,
  onDelete
}: ImageTableProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
        <p className="text-gray-500">Get started by adding your first image.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedImages.length === images.length && images.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stats</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {images.map((image) => (
              <tr key={image.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}
                    onChange={() => onSelectImage(image.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    {!imageErrors[image.id] ? (
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [image.id]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{image.title}</p>
                    <p className="text-sm text-gray-500">{image.alt}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {image.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">❤️ {image.likes} likes</p>
                    <p className="text-gray-600">👁️ {image.views || 0} views</p>
                    <p className="text-gray-600">⬇️ {image.downloads || 0} downloads</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {image.isActive !== false ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      <Eye className="w-3 h-3" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      <EyeOff className="w-3 h-3" />
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(image)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(image)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}