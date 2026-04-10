import React, { useState } from 'react';
import { Palette, Ruler, Plus, Trash2, Search, Edit2, Check, X } from 'lucide-react';
import { Size, Color } from '../data/initialData';

interface SizesColorsViewProps {
  sizes: Size[];
  colors: Color[];
  onAddSize: (name: string) => void;
  onDeleteSize: (id: string) => void;
  onUpdateSize: (id: string, updatedFields: Partial<Size>) => void;
  onAddColor: (name: string, hex: string) => void;
  onDeleteColor: (id: string) => void;
  onUpdateColor: (id: string, updatedFields: Partial<Color>) => void;
  language: 'en' | 'bn';
}

export const SizesColorsView: React.FC<SizesColorsViewProps> = ({
  sizes,
  colors,
  onAddSize,
  onDeleteSize,
  onAddColor,
  onDeleteColor,
  language
}) => {
  // Add Size/Color States
  const [sizeName, setSizeName] = useState('');
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#3B82F6');

  const [errorSize, setErrorSize] = useState('');
  const [errorColor, setErrorColor] = useState('');

  // Search & Pagination States - Sizes
  const [sizeSearch, setSizeSearch] = useState('');
  const [sizePage, setSizePage] = useState(1);
  const [sizesPerPage, setSizesPerPage] = useState(10);

  // Search & Pagination States - Colors
  const [colorSearch, setColorSearch] = useState('');
  const [colorPage, setColorPage] = useState(1);
  const [colorsPerPage, setColorsPerPage] = useState(10);

  const isBn = language === 'bn';

  const handleAddSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeName.trim()) {
      setErrorSize(isBn ? 'সাইজের নাম দিন' : 'Enter a size value');
      return;
    }
    onAddSize(sizeName.trim());
    setSizeName('');
    setErrorSize('');
  };

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorName.trim() || !colorHex.trim()) {
      setErrorColor(isBn ? 'রঙের নাম এবং কোড দিন' : 'Enter color name and hex code');
      return;
    }
    onAddColor(colorName.trim(), colorHex.trim());
    setColorName('');
    setColorHex('#3B82F6');
    setErrorColor('');
  };

  // Filter & Pagination logic - Sizes
  const filteredSizes = sizes.filter((s) =>
    s.name.toLowerCase().includes(sizeSearch.toLowerCase())
  );
  const totalSizePages = Math.ceil(filteredSizes.length / sizesPerPage);
  const sizeStartIndex = (sizePage - 1) * sizesPerPage;
  const currentSizes = filteredSizes.slice(sizeStartIndex, sizeStartIndex + sizesPerPage);

  const handleSizeSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizeSearch(e.target.value);
    setSizePage(1);
  };

  // Filter & Pagination logic - Colors
  const filteredColors = colors.filter((c) =>
    c.name.toLowerCase().includes(colorSearch.toLowerCase()) ||
    c.hex.toLowerCase().includes(colorSearch.toLowerCase())
  );
  const totalColorPages = Math.ceil(filteredColors.length / colorsPerPage);
  const colorStartIndex = (colorPage - 1) * colorsPerPage;
  const currentColors = filteredColors.slice(colorStartIndex, colorStartIndex + colorsPerPage);

  const handleColorSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorSearch(e.target.value);
    setColorPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isBn ? 'সাইজ ও রঙসমূহ' : 'Sizes & Colors Configuration'}
          </h1>
          <p className="text-sm text-slate-500">
            {isBn ? 'পণ্যের সাইজ ভ্যারিয়েন্ট ও রঙের কোড নিয়ন্ত্রণ করুন' : 'Manage your product variant dimensions and custom color palette'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SIZES CONFIGURATION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full min-h-[500px]">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Ruler className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                {isBn ? 'সাইজ ম্যানেজমেন্ট' : 'Sizes Configuration'}
              </h2>
            </div>

            {/* Add Size Form */}
            <form onSubmit={handleAddSize} className="flex gap-2 mb-6">
              <input
                type="text"
                value={sizeName}
                onChange={(e) => setSizeName(e.target.value)}
                placeholder="e.g. S, M, XL, 42"
                className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {isBn ? 'যোগ' : 'Add'}
              </button>
            </form>
            {errorSize && <p className="text-xs text-rose-500 mb-4">{errorSize}</p>}

            {/* Sizes Search & Table */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-3 w-full mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 font-medium">
                    {isBn ? 'প্রতি পৃষ্ঠায়:' : 'Show:'}
                  </label>
                  <select
                    value={sizesPerPage}
                    onChange={(e) => {
                      setSizesPerPage(Number(e.target.value));
                      setSizePage(1);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    value={sizeSearch}
                    onChange={handleSizeSearchChange}
                    placeholder={isBn ? 'সাইজ খুঁজুন...' : 'Search sizes...'}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                        {isBn ? 'সাইজের নাম' : 'Size Label'}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                        {isBn ? 'অ্যাকশন' : 'Action'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentSizes.length > 0 ? (
                      currentSizes.map((size) => (
                        <tr key={size.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-700 text-sm">{size.name}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => onDeleteSize(size.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                          {isBn ? 'কোনো সাইজ পাওয়া যায়নি।' : 'No sizes found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination - Sizes */}
          {filteredSizes.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
              <span className="text-xs text-slate-500">
                {sizeStartIndex + 1}-{Math.min(sizeStartIndex + sizesPerPage, filteredSizes.length)} / {filteredSizes.length}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSizePage((p) => Math.max(1, p - 1))}
                  disabled={sizePage === 1}
                  className="px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  {isBn ? 'পূর্ববর্তী' : 'Prev'}
                </button>
                {Array.from({ length: totalSizePages }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setSizePage(idx + 1)}
                    className={`w-6 h-6 rounded text-xs font-semibold flex items-center justify-center transition-all ${
                      sizePage === idx + 1
                        ? 'bg-amber-600 text-white shadow'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setSizePage((p) => Math.min(totalSizePages, p + 1))}
                  disabled={sizePage === totalSizePages}
                  className="px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  {isBn ? 'পরবর্তী' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* COLORS CONFIGURATION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full min-h-[500px]">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                {isBn ? 'রঙ ম্যানেজমেন্ট' : 'Color Swatches'}
              </h2>
            </div>

            {/* Add Color Form */}
            <form onSubmit={handleAddColor} className="flex flex-col sm:flex-row gap-2 mb-6">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="e.g. Olive Green"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-slate-200 p-0.5 self-center"
                />
              </div>
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {isBn ? 'যোগ' : 'Add'}
              </button>
            </form>
            {errorColor && <p className="text-xs text-rose-500 mb-4">{errorColor}</p>}

            {/* Colors Search & Table */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-3 w-full mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500 font-medium">
                    {isBn ? 'প্রতি পৃষ্ঠায়:' : 'Show:'}
                  </label>
                  <select
                    value={colorsPerPage}
                    onChange={(e) => {
                      setColorsPerPage(Number(e.target.value));
                      setColorPage(1);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                    value={colorSearch}
                    onChange={handleColorSearchChange}
                    placeholder={isBn ? 'রঙ খুঁজুন...' : 'Search colors...'}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                        {isBn ? 'রঙের নাম' : 'Color Name'}
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                        {isBn ? 'হেক্স কোড' : 'Hex'}
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
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded border border-slate-200 shadow-sm flex-shrink-0"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="font-bold text-slate-700 text-sm">{color.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              {color.hex}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => onDeleteColor(color.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                          {isBn ? 'কোনো রঙ পাওয়া যায়নি।' : 'No colors found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination - Colors */}
          {filteredColors.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
              <span className="text-xs text-slate-500">
                {colorStartIndex + 1}-{Math.min(colorStartIndex + colorsPerPage, filteredColors.length)} / {filteredColors.length}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setColorPage((p) => Math.max(1, p - 1))}
                  disabled={colorPage === 1}
                  className="px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  {isBn ? 'পূর্ববর্তী' : 'Prev'}
                </button>
                {Array.from({ length: totalColorPages }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setColorPage(idx + 1)}
                    className={`w-6 h-6 rounded text-xs font-semibold flex items-center justify-center transition-all ${
                      colorPage === idx + 1
                        ? 'bg-pink-600 text-white shadow'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setColorPage((p) => Math.min(totalColorPages, p + 1))}
                  disabled={colorPage === totalColorPages}
                  className="px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
