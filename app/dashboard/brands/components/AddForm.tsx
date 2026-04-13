"use client";
import React, { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Brand } from "../../data/initialData";

interface AddFormProps {
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
}

const AddForm: React.FC<AddFormProps> = ({ brands, setBrands }) => {
  const { isBn } = useApp();
  
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onAddBrand = (name: string, nameBn: string, country: string) => {
    const id = Date.now().toString();
    setBrands([...brands, { id, name, nameBn, country }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nameBn.trim() || !country.trim()) {
      setError(
        isBn
          ? "অনুগ্রহ করে সব ক্ষেত্র পূরণ করুন।"
          : "Please fill in all fields.",
      );
      return;
    }

    onAddBrand(name.trim(), nameBn.trim(), country.trim());
    setName("");
    setNameBn("");
    setCountry("");
    setError("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-1 h-fit">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        {isBn ? "নতুন ব্র্যান্ড যোগ করুন" : "Add New Brand"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "ব্র্যান্ডের নাম (ইংরেজি)" : "Brand Name (English)"}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apex"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "ব্র্যান্ডের নাম (বাংলা)" : "Brand Name (Bangla)"}
          </label>
          <input
            type="text"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            placeholder="উদাঃ এপেক্স"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "মূল দেশ" : "Country of Origin"}
          </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Bangladesh"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {error && <p className="text-xs text-rose-500">{error}</p>}

        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              {isBn ? "সফলভাবে যোগ করা হয়েছে!" : "Brand added successfully!"}
            </span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          {isBn ? "সংরক্ষণ করুন" : "Save Brand"}
        </button>
      </form>
    </div>
  );
};

export default AddForm;
