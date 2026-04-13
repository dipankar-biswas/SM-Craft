'use client';
import React, { useState } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Product } from '../../data/initialData';
import { useApp } from '../../context/AppContext';

interface TableListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onEditProduct: (product: Product) => void;
}

const TableList: React.FC<TableListProps> = ({ 
  products, setProducts, onUpdateProduct, onEditProduct
}) => {
  const { isBn } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const onUpdateStatus = (id: string, status: "Active" | "Inactive") => {
    onUpdateProduct(id, { status });
  };


  const onDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">{isBn ? 'প্রতি পৃষ্ঠায় দেখান:' : 'Show items:'}</span>
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={100}>100</option>
          </select>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input type="text" placeholder={isBn ? 'পণ্য অনুসন্ধান করুন...' : 'Search products...'} value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
              <th className="p-4">{isBn ? 'পণ্যের ছবি ও নাম' : 'Product & Info'}</th>
              <th className="p-4">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
              <th className="p-4">{isBn ? 'ব্র্যান্ড' : 'Brand'}</th>
              <th className="p-4">{isBn ? 'সাইজ ও রং' : 'Sizes & Colors'}</th>
              <th className="p-4">{isBn ? 'মূল্য ও স্টক' : 'Price & Stock'}</th>
              <th className="p-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
              <th className="p-4">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                    <div>
                      <div className="font-semibold text-gray-900 line-clamp-1">{isBn ? product.nameBn || product.name : product.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{isBn ? product.descriptionBn || product.description : product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{product.category}</td>
                <td className="p-4 text-gray-600">{product.brand}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">{isBn ? 'সাইজ:' : 'Sizes:'} {product.sizes.length ? product.sizes.join(', ') : 'N/A'}</span>
                    <div className="flex gap-1 items-center">
                      <span className="text-xs text-gray-500">{isBn ? 'রং:' : 'Colors:'}</span>
                      {product.colors.map((hex, i) => (
                        <span key={i} className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-900">৳{product.price}</div>
                  <div className="text-xs text-gray-500">{isBn ? 'স্টক:' : 'Stock:'} {product.stock}</div>
                </td>
                <td className="p-4">
                  <button onClick={() => onUpdateStatus(product.id, product.status === 'Active' ? 'Inactive' : 'Active')}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${product.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {product.status === 'Active' ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEditProduct(product)} className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteProduct(product.id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">{isBn ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50/50">
          <div className="text-gray-500">
            {isBn ? 'দেখাচ্ছে' : 'Showing'} <span className="font-semibold text-gray-900">{filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> 
            {isBn ? 'থেকে' : 'to'} <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> 
            {isBn ? 'মোট' : 'of'} <span className="font-semibold text-gray-900">{filteredProducts.length}</span> {isBn ? 'এন্ট্রিস' : 'entries'}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-medium">
              {isBn ? 'পূর্ববর্তী' : 'Previous'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-semibold transition-all ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {pageNum}
              </button>
            ))}
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-gray-700 font-medium">
              {isBn ? 'পরবর্তী' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableList;