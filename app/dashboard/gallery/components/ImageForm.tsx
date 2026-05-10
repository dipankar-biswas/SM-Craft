// ImageForm.tsx - সম্পূর্ণ আপডেটেড কোড
'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { GalleryImage } from '@/types/gallery.types';
import { toast } from 'sonner';

interface ImageFormProps {
  image?: GalleryImage | null;
  categories: string[];
  onSubmit: (data: FormData) => Promise<void>; // FormData টাইপ করুন
  onClose: () => void;
}

export default function ImageForm({ image, categories, onSubmit, onClose }: ImageFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    alt: '',
    src: '',
    category: categories[0] || '',
    tags: [] as string[],
    isActive: true,
    description: ''
  });
  
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title,
        alt: image.alt,
        src: image.src,
        category: image.category,
        tags: image.tags || [],
        isActive: image.isActive !== false,
        description: image.description || ''
      });
    }
  }, [image]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!selectedFile && !image) {
      newErrors.image = 'Please select an image';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    // FormData তৈরি করুন
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('alt', formData.alt);
    submitData.append('category', formData.category);
    submitData.append('tags', JSON.stringify(formData.tags));
    submitData.append('description', formData.description);
    submitData.append('isActive', String(formData.isActive));
    
    // ফাইল যোগ করুন (যদি থাকে)
    if (selectedFile) {
      submitData.append('image', selectedFile);
    }
    
    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setUploading(true);
    
    // Create a local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, src: reader.result as string }));
      setUploading(false);
      toast.success('Image loaded successfully');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {image ? 'Edit Image' : 'Add New Image'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image * {uploading && <span className="text-blue-500 ml-2">Loading...</span>}
            </label>
            
            <div className="flex flex-col items-center gap-4">
              {/* Preview Area */}
              <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
                {formData.src ? (
                  <img
                    src={formData.src}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No image selected</p>
                  </div>
                )}
              </div>
              
              {/* Upload Button */}
              <div className="w-full max-w-md">
                <label className="block">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{formData.src ? 'Change Image' : 'Choose Image'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Supported formats: JPG, PNG, GIF, WEBP (Max 5MB)
                </p>
                {errors.image && (
                  <p className="text-red-500 text-xs text-center mt-1">{errors.image}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter image title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          
          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SEO friendly description"
            />
            <p className="text-xs text-gray-500 mt-1">Helps with SEO and accessibility</p>
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add tags (e.g., nature, landscape)..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {formData.tags.length === 0 && (
                <p className="text-gray-400 text-sm">No tags added yet</p>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image description..."
            />
          </div>
          
          {/* Status */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Published (visible to public)</span>
            </label>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {image ? 'Update Image' : 'Add Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}