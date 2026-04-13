"use client";
import React, { useState } from "react";
import { Folder, Trash2, Tag, Search, Edit2, Check, X } from "lucide-react";
import { Category } from "../../data/initialData";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoryListProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    nameBn: string;
    icon: string;
    image?: string;
    slug: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

const TableList: React.FC<CategoryListProps> = ({
  categories,
  setCategories,
}) => {
  const { isBn } = useApp();
  const router = useRouter();

  // Edit states
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editNameBn, setEditNameBn] = useState<string>("");

  // Loading states
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);

  // Search & Pagination states
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const onUpdateCategory = async (
    id: string,
    updatedFields: Partial<Category>,
  ) => {
    setIsUpdating(id);

    try {
      const res = await fetch("/api/category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...updatedFields,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            (isBn
              ? "ক্যাটাগরি আপডেট করতে ব্যর্থ"
              : "Failed to update category"),
        );
      }

      if (data.success && data.data) {
        setCategories(
          categories.map((c) =>
            c._id === id || c.id === id
              ? {
                  ...c,
                  name: data.data.name,
                  nameBn: data.data.nameBn,
                  icon: data.data.icon,
                  image: data.data.image,
                  active: data.data.active,
                }
              : c,
          ),
        );
        toast.success(
          data.message ||
            (isBn
              ? "ক্যাটাগরি সফলভাবে আপডেট হয়েছে!"
              : "Category updated successfully!"),
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : isBn
            ? "ক্যাটাগরি আপডেট করতে ব্যর্থ"
            : "Failed to update category",
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    setIsTogglingStatus(id);

    try {
      const res = await fetch("/api/category", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          active: !currentStatus,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            (isBn ? "স্ট্যাটাস আপডেট করতে ব্যর্থ" : "Failed to update status"),
        );
      }

      if (data.success) {
        setCategories(
          categories.map((c) =>
            c._id === id || c.id === id ? { ...c, active: data.active } : c,
          ),
        );
        toast.success(
          data.message ||
            (isBn
              ? "স্ট্যাটাস সফলভাবে আপডেট হয়েছে!"
              : "Status updated successfully!"),
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : isBn
            ? "স্ট্যাটাস আপডেট করতে ব্যর্থ"
            : "Failed to update status",
      );
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const onDeleteCategory = async (id: string) => {
    if (!id) {
      toast.error(
        isBn ? "ক্যাটাগরি আইডি পাওয়া যায়নি" : "Category ID not found",
      );
      return;
    }

    // Confirm before delete
    const confirmDelete = confirm(
      isBn
        ? "আপনি কি এই ক্যাটাগরিটি ডিলিট করতে চান?"
        : "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) return;

    setIsDeleting(id);

    try {
      const res = await fetch("/api/category", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete category");
      }

      const data = await res.json();

      if (data.success) {
        // Update local state
        setCategories(categories.filter((c) => c._id !== id && c.id !== id));

        toast.success(
          data.message ||
            (isBn
              ? "ক্যাটাগরি ডিলিট成功了!"
              : "Category deleted successfully!"),
        );
        router.refresh();

        // Adjust current page if needed
        const currentCategoryList = filteredCategories.filter(
          (c) => c._id !== id && c.id !== id,
        );
        if (currentCategoryList.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        toast.error(
          data.error ||
            (isBn
              ? "ক্যাটাগরি ডিলিট করতে ব্যর্থ"
              : "Failed to delete category"),
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : isBn
            ? "ক্যাটাগরি ডিলিট করতে ব্যর্থ"
            : "Failed to delete category",
      );
    } finally {
      setIsDeleting(null);
    }
  };

  // Filter & Pagination logic
  const filteredCategories = categories.filter(
    (c: Category) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.nameBn && c.nameBn.toLowerCase().includes(search.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleEdit = (category: Category) => {
    setEditId(category._id || category.id || null);
    setEditName(category.name);
    setEditNameBn(category.nameBn);
  };

  const handleSaveEdit = async (id: string) => {
    if (editName.trim() && editNameBn.trim()) {
      await onUpdateCategory(id, {
        name: editName.trim(),
        nameBn: editNameBn.trim(),
      });
      setEditId(null);
    } else {
      toast.error(isBn ? "নাম দুটি পূরণ করুন" : "Please fill both names");
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditNameBn("");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col justify-between h-full min-h-[420px]">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isBn ? "সকল ক্যাটাগরির তালিকা" : "Available Categories"}
            </h2>
            <span className="text-xs text-slate-500">
              {filteredCategories.length}{" "}
              {isBn ? "টি ক্যাটাগরি পাওয়া গেছে" : "categories found"}
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
                onChange={handleItemsPerPageChange}
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
                placeholder={
                  isBn ? "ক্যাটাগরি খুঁজুন..." : "Search categories..."
                }
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
                  {isBn ? "ক্যাটাগরির নাম" : "Category Name"}
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                  {isBn ? "মোট পণ্য" : "Item Count"}
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
                currentItems.map((category: Category) => (
                  <tr
                    key={category._id || category.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      {editId === (category._id || category.id) ? (
                        <div className="flex flex-col gap-1.5 w-full">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="English Name"
                            className="px-2 py-1 border border-slate-300 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                            disabled={
                              isUpdating === (category._id || category.id)
                            }
                          />
                          <input
                            type="text"
                            value={editNameBn}
                            onChange={(e) => setEditNameBn(e.target.value)}
                            placeholder="বাংলা নাম"
                            className="px-2 py-1 border border-slate-300 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                            disabled={
                              isUpdating === (category._id || category.id)
                            }
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            {category.image && category.image.startsWith("/") ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-4 h-4 object-contain"
                              />
                            ) : (
                              (() => {
                                const Icon = category.icon;
                                return <Icon className="w-10 h-10" />;
                              })()
                            )}
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
                        {category.itemCount || 0} {isBn ? "টি" : "Items"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() =>
                          onToggleStatus(
                            category._id || category.id || "",
                            category.active !== false,
                          )
                        }
                        disabled={
                          isTogglingStatus === (category._id || category.id)
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          category.active === false
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        }`}
                      >
                        {isTogglingStatus === (category._id || category.id) ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mx-2" />
                        ) : category.active === false ? (
                          isBn ? (
                            "নিষ্ক্রিয়"
                          ) : (
                            "Inactive"
                          )
                        ) : isBn ? (
                          "সক্রিয়"
                        ) : (
                          "Active"
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {editId === (category._id || category.id) ? (
                          <>
                            <button
                              onClick={() =>
                                handleSaveEdit(
                                  category._id || category.id || "",
                                )
                              }
                              disabled={
                                isUpdating === (category._id || category.id)
                              }
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                              title="Save"
                            >
                              {isUpdating === (category._id || category.id) ? (
                                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={
                                isUpdating === (category._id || category.id)
                              }
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded hover:bg-indigo-50 transition-all"
                            title="Edit category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            onDeleteCategory(category._id || category.id || "")
                          }
                          disabled={
                            isDeleting === (category._id || category.id)
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-all disabled:opacity-50"
                          title="Delete category"
                        >
                          {isDeleting === (category._id || category.id) ? (
                            <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-sm text-slate-500"
                  >
                    {isBn
                      ? "কোনো ক্যাটাগরি পাওয়া যায়নি।"
                      : "No categories found matching your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredCategories.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <p className="text-xs text-slate-500">
            {isBn ? "দেখানো হচ্ছে" : "Showing"}{" "}
            <span className="font-semibold text-slate-700">
              {startIndex + 1}
            </span>{" "}
            {isBn ? "থেকে" : "to"}{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(startIndex + itemsPerPage, filteredCategories.length)}
            </span>{" "}
            {isBn ? "সর্বমোট" : "of"}{" "}
            <span className="font-semibold text-slate-700">
              {filteredCategories.length}
            </span>{" "}
            {isBn ? "টি" : "entries"}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isBn ? "পূর্ববর্তী" : "Prev"}
            </button>

            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNumber = idx + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white shadow"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="text-slate-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
