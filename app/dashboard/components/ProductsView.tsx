import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ShoppingBag, 
  CheckCircle2,
  Search,
  Edit,
  X,
  Image as ImageIcon,
  Video,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Product, Category, Brand, Size, Color } from '../data/initialData';

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  sizes: Size[];
  colors: Color[];
  onAddProduct: (newProduct: Omit<Product, 'id' | 'sales'>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (id: string, updatedFields: Partial<Product>) => void;
  language: 'en' | 'bn';
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  categories,
  brands,
  sizes,
  colors,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  language
}) => {
  // Add Product Form States
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [multiImages, setMultiImages] = useState('');
  const [video, setVideo] = useState('');

  // Search & Pagination States
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Edit Modal States
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editCategory, setEditCategory] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editColors, setEditColors] = useState<string[]>([]);
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editMultiImages, setEditMultiImages] = useState('');
  const [editVideo, setEditVideo] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');

  const isBn = language === 'bn';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0 || !category || !brand) {
      setError(isBn ? 'নাম, মূল্য, ক্যাটাগরি এবং ব্র্যান্ড নির্বাচন করা আবশ্যক।' : 'Name, valid price, category, and brand are required.');
      return;
    }

    const multiImagesArr = multiImages
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    onAddProduct({
      name,
      price,
      stock,
      category,
      brand,
      sizes: selectedSizes,
      colors: selectedColors,
      description: description || 'New premium quality product from our collection.',
      image: image || 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600',
      multiImages: multiImagesArr.length > 0 ? multiImagesArr : undefined,
      video: video || undefined,
      status: 'Active'
    });

    // Reset Form
    setName('');
    setPrice(0);
    setStock(0);
    setCategory('');
    setBrand('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setDescription('');
    setImage('');
    setMultiImages('');
    setVideo('');
    setError('');

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditStock(product.stock);
    setEditCategory(product.category);
    setEditBrand(product.brand);
    setEditSizes(product.sizes || []);
    setEditColors(product.colors || []);
    setEditDescription(product.description || '');
    setEditImage(product.image || '');
    setEditMultiImages(product.multiImages ? product.multiImages.join(', ') : '');
    setEditVideo(product.video || '');
    setEditStatus(product.status || 'Active');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    const multiImagesArr = editMultiImages
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    onUpdateProduct(editProduct.id, {
      name: editName,
      price: editPrice,
      stock: editStock,
      category: editCategory,
      brand: editBrand,
      sizes: editSizes,
      colors: editColors,
      description: editDescription,
      image: editImage,
      multiImages: multiImagesArr.length > 0 ? multiImagesArr : undefined,
      video: editVideo || undefined,
      status: editStatus
    });

    setEditProduct(null);
  };

  const toggleSize = (sizeName: string, isEditing: boolean) => {
    if (isEditing) {
      setEditSizes((prev) =>
        prev.includes(sizeName) ? prev.filter((s) => s !== sizeName) : [...prev, sizeName]
      );
    } else {
      setSelectedSizes((prev) =>
        prev.includes(sizeName) ? prev.filter((s) => s !== sizeName) : [...prev, sizeName]
      );
    }
  };

  const toggleColor = (colorHex: string, isEditing: boolean) => {
    if (isEditing) {
      setEditColors((prev) =>
        prev.includes(colorHex) ? prev.filter((c) => c !== colorHex) : [...prev, colorHex]
      );
    } else {
      setSelectedColors((prev) =>
        prev.includes(colorHex) ? prev.filter((c) => c !== colorHex) : [...prev, colorHex]
      );
    }
  };

  const toggleProductStatus = (id: string, currentStatus?: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive';
    onUpdateProduct(id, { status: newStatus });
  };

  // Search & Pagination Logic
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isBn ? 'পণ্যসমূহ' : 'Product Inventory'}
          </h1>
          <p className="text-sm text-slate-500">
            {isBn ? 'পণ্য যোগ করুন, তালিকা দেখুন এবং স্টক ম্যানেজ করুন' : 'Add new items, manage variants, images, videos, and monitor stock levels'}
          </p>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">
              {isBn ? 'প্রতি পৃষ্ঠায়:' : 'Show:'}
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="relative flex-1 md:flex-initial md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={isBn ? 'পণ্য খুঁজুন...' : 'Search products...'}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD PRODUCT FORM */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            {isBn ? 'নতুন পণ্য তৈরি করুন' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {isBn ? 'পণ্যের নাম' : 'Product Name'} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Slim Fit Denim Shirt"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'মূল্য (৳)' : 'Price (BDT)'} *
                </label>
                <input
                  type="number"
                  value={price || ''}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'স্টক পরিমাণ' : 'Stock Quantity'}
                </label>
                <input
                  type="number"
                  value={stock || ''}
                  onChange={(e) => setStock(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'ক্যাটাগরি' : 'Category'} *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{isBn ? 'নির্বাচন করুন' : 'Select Category'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {isBn ? c.nameBn : c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'ব্র্যান্ড' : 'Brand'} *
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{isBn ? 'নির্বাচন করুন' : 'Select Brand'}</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Image Upload/Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                {isBn ? 'প্রধান ছবির ইউআরএল' : 'Main Image URL'}
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/main-image.jpg"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Multiple Images Upload/Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                {isBn ? 'একাধিক ছবি (কমা দিয়ে আলাদা করুন)' : 'Multi Images (Comma separated)'}
              </label>
              <input
                type="text"
                value={multiImages}
                onChange={(e) => setMultiImages(e.target.value)}
                placeholder="url1.jpg, url2.jpg"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Video Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-slate-400" />
                {isBn ? 'ভিডিও লিংক (ইউটিউব/ভিমিও)' : 'Video Link (YouTube/Vimeo)'}
              </label>
              <input
                type="text"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {isBn ? 'সাইজ ভেরিয়েন্ট' : 'Sizes'}
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const isSelected = selectedSizes.includes(s.name);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => toggleSize(s.name, false)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {isBn ? 'রং ভেরিয়েন্ট' : 'Colors'}
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const isSelected = selectedColors.includes(c.hex);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleColor(c.hex, false)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-slate-100"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {isBn ? 'পণ্যের বিবরণ' : 'Description'}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product details and specifications..."
                rows={3}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-xs text-rose-500">{error}</p>}
            
            {success && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{isBn ? 'পণ্য সফলভাবে যুক্ত হয়েছে!' : 'Product added successfully!'}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              {isBn ? 'সংরক্ষণ করুন' : 'Save Product'}
            </button>
          </form>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-slate-100 mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{isBn ? 'পণ্য' : 'Product'}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{isBn ? 'মূল্য ও স্টক' : 'Price & Stock'}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{isBn ? 'মিডিয়া' : 'Media'}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.length > 0 ? (
                  currentItems.map((product) => {
                    const isActive = product.status !== 'Inactive';
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{product.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">
                                  {product.category}
                                </span>
                                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                                  {product.brand}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-slate-800">৳{product.price.toLocaleString()}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Stock: {product.stock}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {product.multiImages && product.multiImages.length > 0 && (
                              <span className="flex items-center gap-1 text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                <ImageIcon className="w-3 h-3" /> {product.multiImages.length}
                              </span>
                            )}
                            {product.video && (
                              <span className="flex items-center gap-1 text-[11px] bg-rose-50 text-rose-600 px-2 py-1 rounded-md">
                                <Video className="w-3 h-3" /> 1
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleProductStatus(product.id, product.status)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                              isActive 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {isActive ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title={isBn ? 'সম্পাদনা করুন' : 'Edit'}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title={isBn ? 'মুছুন' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">
                      {isBn ? 'কোনো পণ্য পাওয়া যায়নি।' : 'No products found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-slate-500">
                {isBn ? `পৃষ্ঠা ${currentPage} এর ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
              </span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                >
                  {isBn ? 'পূর্ববর্তী' : 'Prev'}
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                >
                  {isBn ? 'পরবর্তী' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-800">
                {isBn ? 'পণ্য সম্পাদনা করুন' : 'Edit Product'}
              </h3>
              <button
                onClick={() => setEditProduct(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'পণ্যের নাম' : 'Product Name'} *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {isBn ? 'মূল্য (৳)' : 'Price (BDT)'} *
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {isBn ? 'স্টক পরিমাণ' : 'Stock Quantity'}
                  </label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {isBn ? 'ক্যাটাগরি' : 'Category'} *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{isBn ? 'নির্বাচন করুন' : 'Select Category'}</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {isBn ? c.nameBn : c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {isBn ? 'ব্র্যান্ড' : 'Brand'} *
                  </label>
                  <select
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{isBn ? 'নির্বাচন করুন' : 'Select Brand'}</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Toggle in Edit Modal */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'পণ্যের স্ট্যাটাস' : 'Product Status'}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditStatus('Active')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                      editStatus === 'Active'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {isBn ? 'সক্রিয় (Active)' : 'Active'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('Inactive')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                      editStatus === 'Inactive'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {isBn ? 'নিষ্ক্রিয় (Inactive)' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* Main Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  {isBn ? 'প্রধান ছবির ইউআরএল' : 'Main Image URL'}
                </label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Multiple Images */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  {isBn ? 'একাধিক ছবি (কমা দিয়ে আলাদা করুন)' : 'Multi Images (Comma separated)'}
                </label>
                <input
                  type="text"
                  value={editMultiImages}
                  onChange={(e) => setEditMultiImages(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-slate-400" />
                  {isBn ? 'ভিডিও লিংক (ইউটিউব/ভিমিও)' : 'Video Link (YouTube/Vimeo)'}
                </label>
                <input
                  type="text"
                  value={editVideo}
                  onChange={(e) => setEditVideo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sizes and Colors edit */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'সাইজ ভেরিয়েন্ট' : 'Sizes'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const isSelected = editSizes.includes(s.name);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleSize(s.name, true)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'রং ভেরিয়েন্ট' : 'Colors'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const isSelected = editColors.includes(c.hex);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleColor(c.hex, true)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-slate-100"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isBn ? 'পণ্যের বিবরণ' : 'Description'}
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  {isBn ? 'আপডেট করুন' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
