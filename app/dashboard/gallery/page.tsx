'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Image as ImageIcon,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import ImageForm from './components/ImageForm';
import ImageTable from './components/ImageTable';
import DeleteModal from './components/DeleteModal';
import BulkActions from './components/BulkActions';
import { galleryService } from '@/services/galleryService';
import { GalleryImage, ApiResponse } from '@/types/gallery.types';
import { toast } from 'sonner';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; image: GalleryImage | null }>({
    show: false,
    image: null
  });
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalLikes: 0
  });

  // Fetch images
  const fetchImages = async () => {
    setLoading(true);
    const response = await galleryService.getImages({
      search: searchTerm || undefined,
      category: filterCategory === 'All' ? undefined : filterCategory,
      limit: 100
    });
    
    if (response.success && response.data) {
      setImages(response.data);
      setStats({
        total: response.data.length,
        published: response.data.filter(img => img.isActive !== false).length,
        draft: response.data.filter(img => img.isActive === false).length,
        totalLikes: response.data.reduce((sum, img) => sum + img.likes, 0)
      });
    } else {
      toast.error('Failed to fetch images');
    }
    setLoading(false);
  };

  // Fetch categories
  const fetchCategories = async () => {
    const response = await galleryService.getCategories();
    if (response.success && response.data) {
      setCategories(['All', ...response.data.map(cat => cat.name)]);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchCategories();
  }, [searchTerm, filterCategory]);

  // Handle add/edit image
  const handleSubmit = async (formData: any) => {
    try {
      if (editingImage) {
        // Update existing image
        const response = await galleryService.updateImage(editingImage.id, formData);
        if (response.success) {
          toast.success('Image updated successfully!');
          fetchImages();
          setShowForm(false);
          setEditingImage(null);
        } else {
          toast.error(response.error || 'Failed to update image');
        }
      } else {
        // Add new image
        const response = await galleryService.addImage(formData);
        if (response.success) {
          toast.success('Image added successfully!');
          fetchImages();
          setShowForm(false);
        } else {
          toast.error(response.error || 'Failed to add image');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteModal.image) return;
    
    try {
      const response = await galleryService.deleteImage(deleteModal.image.id);
      if (response.success) {
        toast.success('Image deleted successfully!');
        fetchImages();
        setDeleteModal({ show: false, image: null });
        setSelectedImages(prev => prev.filter(id => id !== deleteModal.image?.id));
      } else {
        toast.error(response.error || 'Failed to delete image');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) {
      toast.error('No images selected');
      return;
    }
    
    try {
      const response = await galleryService.bulkOperation({
        operation: 'delete',
        imageIds: selectedImages,
        data: null
      });
      
      if (response.success) {
        toast.success(`${selectedImages.length} images deleted successfully!`);
        fetchImages();
        setSelectedImages([]);
      } else {
        toast.error(response.error || 'Failed to delete images');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Handle bulk category update
  const handleBulkCategoryUpdate = async (category: string) => {
    if (selectedImages.length === 0) {
      toast.error('No images selected');
      return;
    }
    
    try {
      const response = await galleryService.bulkOperation({
        operation: 'updateCategory',
        imageIds: selectedImages,
        data: { category }
      });
      
      if (response.success) {
        toast.success(`${selectedImages.length} images updated to ${category}!`);
        fetchImages();
        setSelectedImages([]);
      } else {
        toast.error(response.error || 'Failed to update categories');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Export data
  const handleExport = () => {
    const exportData = images.map(img => ({
      ID: img.id,
      Title: img.title,
      Category: img.category,
      Likes: img.likes,
      Views: img.views || 0,
      Downloads: img.downloads || 0,
      CreatedAt: img.createdAt,
      Tags: img.tags?.join(', ')
    }));
    
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gallery-export-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export completed!');
  };

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ];
    return csvRows.join('\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
          <p className="text-gray-600 mt-2">Manage your image gallery, add new images, edit existing ones, and organize your collection.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Images</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Draft</p>
                <p className="text-2xl font-bold text-orange-600">{stats.draft}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Likes</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalLikes.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingImage(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Image
              </button>
              
              <BulkActions
                selectedCount={selectedImages.length}
                onBulkDelete={handleBulkDelete}
                onBulkCategoryUpdate={handleBulkCategoryUpdate}
                categories={categories.filter(c => c !== 'All')}
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <button
                onClick={handleExport}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Image Table */}
        <ImageTable
          images={images}
          loading={loading}
          selectedImages={selectedImages}
          onSelectImage={(id) => {
            setSelectedImages(prev =>
              prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedImages(images.map(img => img.id));
            } else {
              setSelectedImages([]);
            }
          }}
          onEdit={(image) => {
            setEditingImage(image);
            setShowForm(true);
          }}
          onDelete={(image) => {
            setDeleteModal({ show: true, image });
          }}
        />

        {/* Add/Edit Form Modal */}
        {showForm && (
          <ImageForm
            image={editingImage}
            categories={categories.filter(c => c !== 'All')}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingImage(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && deleteModal.image && (
          <DeleteModal
            image={deleteModal.image}
            onConfirm={handleDelete}
            onClose={() => setDeleteModal({ show: false, image: null })}
          />
        )}
      </div>
    </div>
  );
}