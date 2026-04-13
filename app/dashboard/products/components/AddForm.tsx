"use client";
import React, { useState } from "react";
import {
  Plus,
  CheckCircle2,
  ImageIcon,
  Upload,
  Video,
  X,
  Bold,
  Italic,
  List,
  Heading,
  Link2,
  ChevronDown,
  Search,
} from "lucide-react";
import { Category, Brand, Size, Color, Product } from "../../data/initialData";
import { useApp } from "../../context/AppContext";

interface ProductFormProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  brands: Brand[];
  sizes: Size[];
  colors: Color[];
}

const AddForm: React.FC<ProductFormProps> = ({
  categories,
  brands,
  sizes,
  colors,
  products,
  setProducts,
}) => {
  const { isBn } = useApp();

  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");

  const [sizeSearch, setSizeSearch] = useState("");
  const [colorSearch, setColorSearch] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [multiImagePreviews, setMultiImagePreviews] = useState<string[]>([]);
  const [videoName, setVideoName] = useState("");
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onAddProduct = (newProduct: Omit<Product, "id" | "sales">) => {
    const id = Date.now().toString();
    setProducts([{ ...newProduct, id, sales: 0 }, ...products]);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMultiImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setMultiImagePreviews(urls);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoName(file.name);
    }
  };

  const addTextFormatting = (type: string, target: "en" | "bn") => {
    const formatChars: Record<string, [string, string]> = {
      bold: ["**", "**"],
      italic: ["*", "*"],
      heading: ["### ", ""],
      list: ["- ", ""],
      link: ["[", "](https://...)"],
    };
    const [prefix, suffix] = formatChars[type] || ["", ""];
    if (target === "en") {
      setDescription((prev) => prev + `\n${prefix}New Text${suffix}`);
    } else {
      setDescriptionBn((prev) => prev + `\n${prefix}নতুন টেক্সট${suffix}`);
    }
  };

  const filteredSizes = sizes.filter((s) =>
    s.name.toLowerCase().includes(sizeSearch.toLowerCase()),
  );
  const filteredColors = colors.filter(
    (c) =>
      c.name.toLowerCase().includes(colorSearch.toLowerCase()) ||
      c.nameBn.includes(colorSearch),
  );

  const toggleSize = (sizeName: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeName)
        ? prev.filter((s) => s !== sizeName)
        : [...prev, sizeName],
    );
  };

  const toggleColor = (colorHex: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorHex)
        ? prev.filter((c) => c !== colorHex)
        : [...prev, colorHex],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !brand) {
      setError(
        isBn
          ? "দয়া করে সমস্ত প্রয়োজনীয় ক্ষেত্রগুলি পূরণ করুন (*)"
          : "Please fill all required fields (*)",
      );
      return;
    }

    onAddProduct({
      name,
      nameBn: nameBn || name,
      price,
      stock,
      category,
      brand,
      sizes: selectedSizes,
      colors: selectedColors,
      description,
      descriptionBn: descriptionBn || description,
      image:
        imagePreview ||
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      multiImages:
        multiImagePreviews.length > 0 ? multiImagePreviews : undefined,
      video: videoName ? `video-${Date.now()}` : undefined,
      status: "Active",
    });

    setName("");
    setNameBn("");
    setPrice(0);
    setStock(0);
    setCategory("");
    setBrand("");
    setSelectedSizes([]);
    setSelectedColors([]);
    setDescription("");
    setDescriptionBn("");
    setImagePreview("");
    setMultiImagePreviews([]);
    setVideoName("");
    setError("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isBn ? "নতুন পণ্য যোগ করুন" : "Add New Product"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isBn
                ? "পণ্যের সমস্ত বিবরণ এবং মিডিয়া ফাইল আপলোড করুন"
                : "Enter all details and upload media files"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            {isBn
              ? "পণ্য সফলভাবে যোগ করা হয়েছে!"
              : "Product added successfully!"}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "পণ্যের নাম (ইংরেজি) *" : "Product Name (English) *"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "পণ্যের নাম (বাংলা)" : "Product Name (Bangla)"}
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "মূল্য (৳) *" : "Price (৳) *"}
                </label>
                <input
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "স্টক পরিমাণ" : "Stock Quantity"}
                </label>
                <input
                  type="number"
                  value={stock || ""}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "ব্র্যান্ড *" : "Brand *"}
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="">
                    {isBn
                      ? "-- ব্র্যান্ড নির্বাচন করুন --"
                      : "-- Select Brand --"}
                  </option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {isBn ? b.nameBn || b.name : b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "ক্যাটাগরি *" : "Category *"}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm"
                >
                  <option value="">
                    {isBn
                      ? "-- ক্যাটাগরি নির্বাচন করুন --"
                      : "-- Select Category --"}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {isBn ? c.nameBn || c.name : c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sizes & Colors Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "সাইজ" : "Sizes"}
                </label>
                <button
                  type="button"
                  onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-left text-sm"
                >
                  <span className="truncate text-gray-600">
                    {selectedSizes.length > 0
                      ? selectedSizes.join(", ")
                      : isBn
                        ? "সাইজ নির্বাচন করুন..."
                        : "Select sizes..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {sizeDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder={
                          isBn ? "সাইজ খুঁজুন..." : "Search sizes..."
                        }
                        value={sizeSearch}
                        onChange={(e) => setSizeSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 rounded-lg"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2 flex flex-wrap gap-1.5">
                      {filteredSizes.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => toggleSize(size.name)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${selectedSizes.includes(size.name) ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "রং" : "Colors"}
                </label>
                <button
                  type="button"
                  onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-left text-sm"
                >
                  <span className="truncate text-gray-600">
                    {selectedColors.length > 0
                      ? selectedColors.join(", ")
                      : isBn
                        ? "রং নির্বাচন করুন..."
                        : "Select colors..."}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {colorDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder={isBn ? "রং খুঁজুন..." : "Search colors..."}
                        value={colorSearch}
                        onChange={(e) => setColorSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 rounded-lg"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-2 flex flex-wrap gap-1.5">
                      {filteredColors.map((col) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => toggleColor(col.hex)}
                          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border ${selectedColors.includes(col.hex) ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: col.hex }}
                          />
                          {isBn ? col.nameBn || col.name : col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Editors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"}
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 border-b">
                    <button
                      type="button"
                      onClick={() => addTextFormatting("bold", "en")}
                      className="p-1 hover:bg-white rounded"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addTextFormatting("italic", "en")}
                      className="p-1 hover:bg-white rounded"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addTextFormatting("list", "en")}
                      className="p-1 hover:bg-white rounded"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-white border-0 focus:ring-0 focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"}
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1 bg-gray-50 px-3 py-2 border-b">
                    <button
                      type="button"
                      onClick={() => addTextFormatting("bold", "bn")}
                      className="p-1 hover:bg-white rounded"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addTextFormatting("italic", "bn")}
                      className="p-1 hover:bg-white rounded"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addTextFormatting("list", "bn")}
                      className="p-1 hover:bg-white rounded"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    className="w-full p-3 bg-white border-0 focus:ring-0 focus:outline-none text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? "প্রধান ছবি" : "Main Image"}
              </label>
              <div className="rounded-xl border border-dashed border-gray-300 px-6 py-6 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-28 w-28 object-cover rounded-xl mx-auto"
                  />
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="mt-4">
                  <label className="cursor-pointer bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                    <span>{isBn ? "ফাইল সিলেক্ট করুন" : "Upload a file"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? "একাধিক ছবি" : "Multiple Images"}
              </label>
              <div className="rounded-xl border border-dashed border-gray-300 px-6 py-6 text-center">
                {multiImagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {multiImagePreviews.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        className="h-14 w-14 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                <label className="cursor-pointer bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                  <span>
                    {isBn ? "ফাইল সিলেক্ট করুন" : "Upload multiple files"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultiImagesChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isBn ? "ভিডিও" : "Video"}
              </label>
              <div className="rounded-xl border border-dashed border-gray-300 px-6 py-6 text-center">
                {videoName && (
                  <div className="text-xs text-indigo-600 mb-3">
                    {videoName}
                  </div>
                )}
                <label className="cursor-pointer bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                  <span>
                    {isBn ? "ভিডিও ফাইল সিলেক্ট করুন" : "Select video file"}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            {isBn ? "পণ্য প্রকাশ করুন" : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
