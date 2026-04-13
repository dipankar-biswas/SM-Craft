"use client";
import React, { useState } from "react";
import { Plus, Ruler } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Size } from "../../data/initialData";

interface AddSizeFormProps {
  sizes: Size[];
  setSizes: React.Dispatch<React.SetStateAction<Size[]>>;
}

const AddSizeForm: React.FC<AddSizeFormProps> = ({ sizes, setSizes }) => {
  const { isBn } = useApp();

  const [sizeName, setSizeName] = useState("");
  const [error, setError] = useState("");

  const onAddSize = (name: string) => {
    const id = Date.now().toString();
    setSizes([...sizes, { id, name }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeName.trim()) {
      setError(isBn ? "সাইজের নাম দিন" : "Enter a size value");
      return;
    }
    onAddSize(sizeName.trim());
    setSizeName("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
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
        {isBn ? "যোগ" : "Add"}
      </button>
      {error && (
        <p className="text-xs text-rose-500 absolute -bottom-5">{error}</p>
      )}
    </form>
  );
};

export default AddSizeForm;
