'use client';

import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2, 
  FolderTree,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { GalleryCategory } from '@/types/gallery.types';
import { categoryIcons } from '@/lib/categoryIcons';

interface CategoryTableProps {
  categories: GalleryCategory[];
  loading: boolean;
  selectedCategories: string[];
  onSelectCategory: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (category: GalleryCategory) => void;
  onDelete: (category: GalleryCategory) => void;
  onStatusToggle: (category: GalleryCategory) => void;
}

export default function CategoryTable({
  categories,
  loading,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  onEdit,
  onDelete,
  onStatusToggle
}: CategoryTableProps) {
  const [sortField, setSortField] = useState<keyof GalleryCategory>('order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
        <p className="text-gray-500">Get started by creating your first category.</p>
      </div>
    );
  }

  const sortedCategories = [...categories].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'createdAt') {
      aValue = new Date(aValue as any).getTime();
      bValue = new Date(bValue as any).getTime();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: keyof GalleryCategory) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof GalleryCategory }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const getIconComponent = (iconName: string) => {
    const icon = categoryIcons.find(i => i.value === iconName);
    return icon ? icon.icon : categoryIcons[0].icon;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === categories.length && categories.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                <button
                  onClick={() => handleSort('order')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Order <SortIcon field="order" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Icon</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Category Name <SortIcon field="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Images</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Created <SortIcon field="createdAt" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCategories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              
              return (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => onSelectCategory(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {category.order}
                  </td>
                  <td className="px-4 py-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color || '#3B82F6', color: 'white' }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      {category.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {category.imageCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onStatusToggle(category)}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                        category.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.isActive ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(category)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}