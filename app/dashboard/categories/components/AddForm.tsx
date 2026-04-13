"use client";
import React, { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { Category } from "../../data/initialData";
import { useApp } from "../../context/AppContext";

interface AddCategoryFormProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const AddForm: React.FC<AddCategoryFormProps> = ({
  categories,
  setCategories,
}) => {
  const { isBn } = useApp();

  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onAddCategory = (name: string, nameBn: string) => {
    const id = Date.now().toString();
    setCategories([...categories, { id, name, nameBn, itemCount: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nameBn.trim()) {
      setError(
        isBn
          ? "অনুগ্রহ করে বাংলা ও ইংরেজি দুটি নামই লিখুন।"
          : "Please enter both English and Bengali names.",
      );
      return;
    }

    onAddCategory(name.trim(), nameBn.trim());
    setName("");
    setNameBn("");
    setError("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 h-fit">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        {isBn ? "নতুন ক্যাটাগরি যোগ করুন" : "Add New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "ক্যাটাগরির নাম (ইংরেজি)" : "Category Name (English)"}
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
            {isBn ? "ক্যাটাগরির নাম (বাংলা)" : "Category Name (Bengali)"}
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
            <span>
              {isBn ? "সফলভাবে যোগ করা হয়েছে!" : "Category added successfully!"}
            </span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          {isBn ? "সংরক্ষণ করুন" : "Save Category"}
        </button>
      </form>
    </div>
  );
};

export default AddForm;
