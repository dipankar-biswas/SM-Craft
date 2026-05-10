'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Eye, EyeOff } from 'lucide-react';
import { GalleryCategory, CategoryFormData } from '@/types/gallery.types';
import { categoryIcons, categoryColors } from '@/lib/categoryIcons';

interface CategoryFormProps {
  category?: GalleryCategory | null;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onClose: () => void;
}

export default function CategoryForm({ category, onSubmit, onClose }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: 'grid',
    isActive: true,
    order: 0,
    metaTitle: '',
    metaDescription: '',
    parentCategory: '',
    featuredImage: '',
    color: '#3B82F6'
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string>('');
  const [availableParentCategories, setAvailableParentCategories] = useState<GalleryCategory[]>([]);

  useEffect(() => {
    // Fetch parent categories
    const fetchParentCategories = async () => {
      const response = await fetch('/api/gallery/categories');
      const data = await response.json();
      if (data.success && data.data) {
        setAvailableParentCategories(
          data.data.filter((cat: GalleryCategory) => cat.id !== category?.id)
        );
      }
    };
    fetchParentCategories();

    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        icon: category.icon || 'grid',
        isActive: category.isActive !== false,
        order: category.order || 0,
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        parentCategory: category.parentCategory || '',
        featuredImage: category.featuredImage || '',
        color: category.color || '#3B82F6'
      });
      setPreviewImage(category.featuredImage || '');
    }
  }, [category]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = 'Meta title should be less than 60 characters';
    }
    
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description should be less than 160 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData(prev => ({ ...prev, metaTitle: slug }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setFormData(prev => ({ ...prev, featuredImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Embroidery, Wedding, Casual"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe what this category represents..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
              
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {categoryIcons.map((icon) => {
                    const IconComponent = icon.icon;
                    return (
                      <button
                        key={icon.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon: icon.value }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.icon === icon.value
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mx-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Color
                </label>
                <div className="flex gap-3 flex-wrap">
                  {categoryColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`w-10 h-10 rounded-full transition-all ${
                        formData.color === color.value
                          ? 'ring-2 ring-offset-2 ring-blue-500'
                          : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage('');
                          setFormData(prev => ({ ...prev, featuredImage: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload category image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="category-image"
                      />
                      <label
                        htmlFor="category-image"
                        className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        Choose Image
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category
                </label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentCategory: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Top Level)</option>
                  {availableParentCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
              
              {/* Status */}
              <div>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Category Status</p>
                    <p className="text-xs text-gray-500">Visible to public when active</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>
          
          {/* SEO Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Meta Title
                  </label>
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Generate from name
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.metaTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="SEO title for search engines"
                />
                {errors.metaTitle && (
                  <p className="text-red-500 text-xs mt-1">{errors.metaTitle}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={2}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.metaDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief description for search results"
                />
                {errors.metaDescription && (
                  <p className="text-red-500 text-xs mt-1">{errors.metaDescription}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {category ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}