"use client";
import React, { useState } from "react";
import {
  Trash2,
  ShieldCheck,
  Globe,
  Search,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Brand } from "../../data/initialData";
import { useApp } from "../../context/AppContext";

interface BrandListProps {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
}

const TableList: React.FC<BrandListProps> = ({ brands, setBrands }) => {
  const { isBn } = useApp();
  // Edit states
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editNameBn, setEditNameBn] = useState("");
  const [editCountry, setEditCountry] = useState("");

  // Search & Pagination states
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const onUpdateBrand = (id: string, updatedFields: Partial<Brand>) => {
    setBrands(brands.map((b) => b.id === id ? { ...b, ...updatedFields } : b));
  };

  const startEdit = (brand: Brand) => {
    setEditId(brand.id);
    setEditName(brand.name);
    setEditNameBn(brand.nameBn || "");
    setEditCountry(brand.country);
  };

  const saveEdit = (id: string) => {
    onUpdateBrand(id, {
      name: editName,
      nameBn: editNameBn,
      country: editCountry,
    });
    setEditId(null);
  };

  // Filter & Pagination logic
  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.nameBn && b.nameBn.includes(search)) ||
      b.country.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBrands.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const onDeleteBrand = (id: string) => {
    setBrands(brands.filter((b) => b.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between h-full min-h-[420px]">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isBn ? "সকল ব্র্যান্ডের তালিকা" : "Partners & Brands"}
            </h2>
            <span className="text-xs text-slate-500">
              {filteredBrands.length}{" "}
              {isBn ? "টি ব্র্যান্ড পাওয়া গেছে" : "brands found"}
            </span>
          </div>

          {/* Search Bar and Items per Page Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">
                {isBn ? "প্রতি পৃষ্ঠায়:" : "Show:"}
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                placeholder={isBn ? "ব্র্যান্ড খুঁজুন..." : "Search brands..."}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table layout for Brands */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn
                    ? "ব্র্যান্ডের নাম (ইংরেজি ও বাংলা)"
                    : "Brand Name (EN & BN)"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn ? "দেশ" : "Country"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn ? "স্ট্যাটাস" : "Status"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">
                  {isBn ? "অ্যাকশন" : "Action"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? (
                currentItems.map((brand) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {editId === brand.id ? (
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="English Name"
                          />
                          <input
                            type="text"
                            value={editNameBn}
                            onChange={(e) => setEditNameBn(e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Bangla Name"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                            {brand.name[0]}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800">
                              {brand.name}
                            </span>
                            {brand.nameBn && (
                              <span className="text-xs text-slate-500">
                                {brand.nameBn}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === brand.id ? (
                        <input
                          type="text"
                          value={editCountry}
                          onChange={(e) => setEditCountry(e.target.value)}
                          className="w-24 px-2 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>{brand.country}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          onUpdateBrand(brand.id, {
                            status:
                              brand.status === "Inactive"
                                ? "Active"
                                : "Inactive",
                          })
                        }
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors border ${
                          brand.status === "Inactive"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {brand.status === "Inactive"
                          ? isBn
                            ? "নিষ্ক্রিয়"
                            : "Inactive"
                          : isBn
                            ? "সক্রিয়"
                            : "Active"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editId === brand.id ? (
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => saveEdit(brand.id)}
                            className="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(brand)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteBrand(brand.id)}
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
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm text-slate-500"
                  >
                    {isBn
                      ? "কোনো ব্র্যান্ড পাওয়া যায়নি।"
                      : "No brands found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
          <span className="text-xs text-slate-500">
            {isBn ? "দেখাচ্ছে" : "Showing"} {startIndex + 1}{" "}
            {isBn ? "থেকে" : "to"}{" "}
            {Math.min(startIndex + itemsPerPage, filteredBrands.length)}{" "}
            {isBn ? "এর মধ্যে" : "of"} {filteredBrands.length}{" "}
            {isBn ? "টি এন্ট্রি" : "entries"}
          </span>
          <div className="flex gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {isBn ? "পূর্ববর্তী" : "Previous"}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
              {isBn ? "পরবর্তী" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableList;
