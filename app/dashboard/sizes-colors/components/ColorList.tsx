'use client';
import React, { useState } from 'react';
import { Trash2, Search, Edit2, Check, X, Palette } from 'lucide-react';
import { Color } from '../../data/initialData';
import { useApp } from '../../context/AppContext';

interface ColorListProps {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
}

const ColorList: React.FC<ColorListProps> = ({ colors, setColors }) => {
  const { isBn } = useApp();

  const [editColorId, setEditColorId] = useState<string | null>(null);
  const [editColorName, setEditColorName] = useState('');
  const [editColorNameBn, setEditColorNameBn] = useState('');
  const [editColorHex, setEditColorHex] = useState('');

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const onUpdateColor = (id: string, updatedFields: Partial<Color>) => {
    setColors(colors.map((c) => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const filteredColors = colors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.nameBn && c.nameBn.includes(search)) ||
    c.hex.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredColors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentColors = filteredColors.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const startEditColor = (c: Color) => {
    setEditColorId(c.id);
    setEditColorName(c.name);
    setEditColorNameBn(c.nameBn || '');
    setEditColorHex(c.hex);
  };

  const saveEditColor = (id: string) => {
    onUpdateColor(id, { 
      name: editColorName, 
      nameBn: editColorNameBn, 
      hex: editColorHex 
    });
    setEditColorId(null);
  };

  const onDeleteColor = (id: string) => {
    setColors(colors.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full min-h-[500px]">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Palette className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            {isBn ? 'রঙ ম্যানেজমেন্ট' : 'Colors Palette Configuration'}
          </h2>
        </div>

        {/* Search & Table */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-3 w-full mb-4">
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
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={isBn ? 'রঙ খুঁজুন...' : 'Search colors...'}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {isBn ? 'রঙের নাম (ইংরেজি ও বাংলা)' : 'Color Name'}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                    {isBn ? 'হেক্স কোড' : 'Hex Code'}
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                    {isBn ? 'অ্যাকশন' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentColors.length > 0 ? (
                  currentColors.map((color) => (
                    <tr key={color.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        {editColorId === color.id ? (
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              value={editColorName}
                              onChange={(e) => setEditColorName(e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="English Name"
                            />
                            <input
                              type="text"
                              value={editColorNameBn}
                              onChange={(e) => setEditColorNameBn(e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="Bangla Name"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-slate-200 shadow-sm flex-shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex flex-col leading-tight">
                              <span className="font-semibold text-slate-700 text-sm">
                                {color.name}
                              </span>
                              {color.nameBn && (
                                <span className="text-[11px] text-slate-500">
                                  {color.nameBn}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                       </td>
                      <td className="px-4 py-3">
                        {editColorId === color.id ? (
                          <input
                            type="text"
                            value={editColorHex}
                            onChange={(e) => setEditColorHex(e.target.value)}
                            className="w-20 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-mono"
                          />
                        ) : (
                          <span className="font-mono text-xs bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-100">
                            {color.hex}
                          </span>
                        )}
                       </td>
                      <td className="px-4 py-3 text-right">
                        {editColorId === color.id ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => saveEditColor(color.id)}
                              className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditColorId(null)}
                              className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEditColor(color)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteColor(color.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                       </td>
                     </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-slate-500">
                      {isBn ? 'কোনো রঙ পাওয়া যায়নি।' : 'No colors found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
          <span className="text-xs text-slate-500">
            {isBn ? 'দেখাচ্ছে' : 'Showing'} {startIndex + 1} {isBn ? 'থেকে' : 'to'} {Math.min(startIndex + itemsPerPage, filteredColors.length)} {isBn ? 'এর মধ্যে' : 'of'} {filteredColors.length} {isBn ? 'টি' : 'entries'}
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {isBn ? 'পূর্ববর্তী' : 'Prev'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {isBn ? 'পরবর্তী' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorList;