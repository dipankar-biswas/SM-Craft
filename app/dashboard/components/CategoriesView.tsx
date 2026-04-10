import React, { useState } from 'react';
import { Folder, Plus, Trash2, Tag, CheckCircle2, Search, Edit2, Check, X } from 'lucide-react';
import { Category } from '../data/initialData';

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: (name: string, nameBn: string) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateCategory: (id: string, updatedFields: Partial<Category>) => void;
  language: 'en' | 'bn';
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
  language
}) => {
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNameBn, setEditNameBn] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Search & Pagination states
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isBn = language === 'bn';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nameBn.trim()) {
      setError(isBn ? 'অনুগ্রহ করে বাংলা ও ইংরেজি দুটি নামই লিখুন।' : 'Please enter both English and Bengali names.');
      return;
    }

    onAddCategory(name.trim(), nameBn.trim());
    setName('');
    setNameBn('');
    setError('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Filter & Pagination logic
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameBn.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset page to 1 on searching
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isBn ? 'ক্যাটাগরি সমূহ' : 'Categories Management'}
          </h1>
          <p className="text-sm text-slate-500">
            {isBn ? 'আপনার দোকানের সব পণ্যের শ্রেণীবিভাগ ও লিস্ট' : 'Create, view, and organize product categories'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Category Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            {isBn ? 'নতুন ক্যাটাগরি যোগ করুন' : 'Add New Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {isBn ? 'ক্যাটাগরির নাম (ইংরেজি)' : 'Category Name (English)'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Winter Collection"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {isBn ? 'ক্যাটাগরির নাম (বাংলা)' : 'Category Name (Bengali)'}
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="উদাঃ শীতকালীন সংগ্রহ"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {error && <p className="text-xs text-rose-500">{error}</p>}
            
            {success && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{isBn ? 'সফলভাবে যোগ করা হয়েছে!' : 'Category added successfully!'}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm"
            >
              {isBn ? 'সংরক্ষণ করুন' : 'Save Category'}
            </button>
          </form>
        </div>

        {/* Categories List, Search, and Pagination */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between h-full min-h-[420px]">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {isBn ? 'সকল ক্যাটাগরির তালিকা' : 'Available Categories'}
                </h2>
                <span className="text-xs text-slate-500">
                  {filteredCategories.length} {isBn ? 'টি ক্যাটাগরি পাওয়া গেছে' : 'categories found'}
                </span>
              </div>

              {/* Search Bar and Items per Page Selector */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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

                <div className="relative flex-1 sm:flex-initial sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder={isBn ? 'ক্যাটাগরি খুঁজুন...' : 'Search categories...'}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Table layout for Categories */}
            <div className="overflow-x-auto rounded-xl border border-slate-100 mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                      {isBn ? 'ক্যাটাগরির নাম' : 'Category Name'}
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                      {isBn ? 'মোট পণ্য' : 'Item Count'}
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                      {isBn ? 'স্ট্যাটাস' : 'Status'}
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                      {isBn ? 'অ্যাকশন' : 'Action'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentItems.length > 0 ? (
                    currentItems.map((category) => (
                      <tr key={category.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 py-3.5">
                          {editId === category.id ? (
                            <div className="flex flex-col gap-1.5 w-full">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="English Name"
                                className="px-2 py-1 border border-slate-300 rounded text-sm w-full"
                              />
                              <input
                                type="text"
                                value={editNameBn}
                                onChange={(e) => setEditNameBn(e.target.value)}
                                placeholder="বাংলা নাম"
                                className="px-2 py-1 border border-slate-300 rounded text-sm w-full"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Folder className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">
                                  {isBn ? category.nameBn : category.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {isBn ? category.name : category.nameBn}
                                </p>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium text-slate-600 flex items-center gap-1 w-fit border border-slate-200">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {category.itemCount} {isBn ? 'টি' : 'Items'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => onUpdateCategory(category.id, { status: category.status === 'Inactive' ? 'Active' : 'Inactive' })}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              category.status === 'Inactive'
                                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            }`}
                          >
                            {category.status === 'Inactive' ? (isBn ? 'নিষ্ক্রিয়' : 'Inactive') : (isBn ? 'সক্রিয়' : 'Active')}
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {editId === category.id ? (
                              <>
                                <button
                                  onClick={() => {
                                    if (editName.trim() && editNameBn.trim()) {
                                      onUpdateCategory(category.id, { name: editName.trim(), nameBn: editNameBn.trim() });
                                      setEditId(null);
                                    }
                                  }}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                                  title="Save"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditId(null)}
                                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditId(category.id);
                                  setEditName(category.name);
                                  setEditNameBn(category.nameBn);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-all"
                                title="Edit category"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => onDeleteCategory(category.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-all"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-sm text-slate-500">
                        {isBn ? 'কোনো ক্যাটাগরি পাওয়া যায়নি।' : 'No categories found matching your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {filteredCategories.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
              <p className="text-xs text-slate-500">
                {isBn ? 'দেখানো হচ্ছে' : 'Showing'}{' '}
                <span className="font-semibold text-slate-700">
                  {startIndex + 1}
                </span>{' '}
                {isBn ? 'থেকে' : 'to'}{' '}
                <span className="font-semibold text-slate-700">
                  {Math.min(startIndex + itemsPerPage, filteredCategories.length)}
                </span>{' '}
                {isBn ? 'সর্বমোট' : 'of'}{' '}
                <span className="font-semibold text-slate-700">
                  {filteredCategories.length}
                </span>{' '}
                {isBn ? 'টি' : 'entries'}
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isBn ? 'পূর্ববর্তী' : 'Previous'}
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                        currentPage === pageNumber
                          ? 'bg-slate-900 text-white shadow'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isBn ? 'পরবর্তী' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
