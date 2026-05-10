'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  FolderTree,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import CategoryForm from './components/CategoryForm';
import CategoryTable from './components/CategoryTable';
import DeleteCategoryModal from './components/DeleteCategoryModal';
import BulkCategoryActions from './components/BulkCategoryActions';
import { galleryService } from '@/services/galleryService';
import { GalleryCategory, CategoryStats } from '@/types/gallery.types';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; category: GalleryCategory | null }>({
    show: false,
    category: null
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [stats, setStats] = useState<CategoryStats>({
    totalCategories: 0,
    activeCategories: 0,
    totalImagesInCategories: 0,
    mostPopularCategory: '',
    categoriesWithMostImages: []
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    const response = await galleryService.getCategories();
    
    if (response.success && response.data) {
      let filteredCategories = response.data;
      
      // Apply search filter
      if (searchTerm) {
        filteredCategories = filteredCategories.filter(cat =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filterStatus !== 'all') {
        filteredCategories = filteredCategories.filter(cat =>
          filterStatus === 'active' ? cat.isActive : !cat.isActive
        );
      }
      
      setCategories(filteredCategories);
      
      // Update stats
      const totalImages = filteredCategories.reduce((sum, cat) => sum + (cat.imageCount || 0), 0);
      const mostPopular = filteredCategories.reduce((prev, current) => 
        (prev.imageCount > current.imageCount) ? prev : current
      );
      
      setStats({
        totalCategories: filteredCategories.length,
        activeCategories: filteredCategories.filter(cat => cat.isActive).length,
        totalImagesInCategories: totalImages,
        mostPopularCategory: mostPopular?.name || 'N/A',
        categoriesWithMostImages: filteredCategories
          .sort((a, b) => (b.imageCount || 0) - (a.imageCount || 0))
          .slice(0, 5)
          .map(cat => ({ name: cat.name, count: cat.imageCount || 0 }))
      });
    } else {
      toast.error('Failed to fetch categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [searchTerm, filterStatus]);

  // Handle add/edit category
  const handleSubmit = async (formData: any) => {
    try {
      if (editingCategory) {
        // Update existing category
        const response = await galleryService.updateCategory(editingCategory.id, formData);
        if (response.success) {
          toast.success('Category updated successfully!');
          fetchCategories();
          setShowForm(false);
          setEditingCategory(null);
        } else {
          toast.error(response.error || 'Failed to update category');
        }
      } else {
        // Add new category
        const response = await galleryService.createCategory(formData);
        if (response.success) {
          toast.success('Category added successfully!');
          fetchCategories();
          setShowForm(false);
        } else {
          toast.error(response.error || 'Failed to add category');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Handle delete category
  const handleDelete = async () => {
    if (!deleteModal.category) return;
    
    try {
      const response = await galleryService.deleteCategory(deleteModal.category.id);
      if (response.success) {
        toast.success('Category deleted successfully!');
        fetchCategories();
        setDeleteModal({ show: false, category: null });
        setSelectedCategories(prev => prev.filter(id => id !== deleteModal.category?.id));
      } else {
        toast.error(response.error || 'Failed to delete category');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) {
      toast.error('No categories selected');
      return;
    }
    
    try {
      const response = await galleryService.bulkDeleteCategories(selectedCategories);
      if (response.success) {
        toast.success(`${selectedCategories.length} categories deleted successfully!`);
        fetchCategories();
        setSelectedCategories([]);
      } else {
        toast.error(response.error || 'Failed to delete categories');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (isActive: boolean) => {
    if (selectedCategories.length === 0) {
      toast.error('No categories selected');
      return;
    }
    
    try {
      const response = await galleryService.bulkUpdateCategoryStatus(selectedCategories, isActive);
      if (response.success) {
        toast.success(`${selectedCategories.length} categories ${isActive ? 'activated' : 'deactivated'}!`);
        fetchCategories();
        setSelectedCategories([]);
      } else {
        toast.error(response.error || 'Failed to update categories');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Export categories data
  const handleExport = () => {
    const exportData = categories.map(cat => ({
      ID: cat.id,
      Name: cat.name,
      Slug: cat.slug,
      Description: cat.description,
      Icon: cat.icon,
      'Image Count': cat.imageCount,
      Status: cat.isActive ? 'Active' : 'Inactive',
      Order: cat.order,
      'Created At': cat.createdAt,
      'Updated At': cat.updatedAt
    }));
    
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `categories-export-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export completed!');
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your gallery categories, organize images, and improve navigation.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Category
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCategories}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FolderTree className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Categories</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCategories}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Images</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalImagesInCategories.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ImageIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Most Popular</p>
              <p className="text-lg font-semibold text-gray-800 truncate">{stats.mostPopularCategory}</p>
            </div>
          </div>
        </div>

        {/* Top Categories List */}
        {stats.categoriesWithMostImages.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Categories by Images</h3>
            <div className="space-y-3">
              {stats.categoriesWithMostImages.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(cat.count / stats.categoriesWithMostImages[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{cat.count} images</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <BulkCategoryActions
              selectedCount={selectedCategories.length}
              onBulkDelete={handleBulkDelete}
              onBulkActivate={() => handleBulkStatusUpdate(true)}
              onBulkDeactivate={() => handleBulkStatusUpdate(false)}
            />
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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

        {/* Category Table */}
        <CategoryTable
          categories={categories}
          loading={loading}
          selectedCategories={selectedCategories}
          onSelectCategory={(id) => {
            setSelectedCategories(prev =>
              prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            );
          }}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedCategories(categories.map(cat => cat.id));
            } else {
              setSelectedCategories([]);
            }
          }}
          onEdit={(category) => {
            setEditingCategory(category);
            setShowForm(true);
          }}
          onDelete={(category) => {
            setDeleteModal({ show: true, category });
          }}
          onStatusToggle={async (category) => {
            await galleryService.updateCategory(category.id, { isActive: !category.isActive });
            fetchCategories();
            toast.success(`Category ${!category.isActive ? 'activated' : 'deactivated'}`);
          }}
        />

        {/* Add/Edit Category Form Modal */}
        {showForm && (
          <CategoryForm
            category={editingCategory}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && deleteModal.category && (
          <DeleteCategoryModal
            category={deleteModal.category}
            onConfirm={handleDelete}
            onClose={() => setDeleteModal({ show: false, category: null })}
          />
        )}
      </div>
    </div>
  );
}