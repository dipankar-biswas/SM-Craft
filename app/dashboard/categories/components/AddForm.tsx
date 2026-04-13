"use client";
import React, { useState, useRef } from "react";
import { 
  Plus, 
  CheckCircle2, 
  ShoppingBag, 
  Store, 
  Image, 
  Shirt, 
  User, 
  Briefcase, 
  Backpack,
  Home,
  Gift,
  Sparkles,
  Package,
  Layers,
  Tag,
  Star,
  Heart,
  Camera,
  Music,
  Book,
  Laptop,
  Phone,
  Watch,
  Gem,
  Crown,
  Rocket,
  Upload,
  X,
  Trash2
} from "lucide-react";
import { Category } from "../../data/initialData";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";

interface AddCategoryFormProps {
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
    slug: string;
    icon: string;
    image?: string;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

// Available icons list
const availableIcons = [
  { name: "ShoppingBag", icon: ShoppingBag, color: "text-blue-500" },
  { name: "Store", icon: Store, color: "text-purple-500" },
  { name: "Image", icon: Image, color: "text-pink-500" },
  { name: "Shirt", icon: Shirt, color: "text-blue-400" },
  { name: "User", icon: User, color: "text-green-500" },
  { name: "Briefcase", icon: Briefcase, color: "text-yellow-500" },
  { name: "Backpack", icon: Backpack, color: "text-orange-500" },
  { name: "Home", icon: Home, color: "text-indigo-500" },
  { name: "Gift", icon: Gift, color: "text-red-500" },
  { name: "Sparkles", icon: Sparkles, color: "text-amber-500" },
  { name: "Package", icon: Package, color: "text-teal-500" },
  { name: "Layers", icon: Layers, color: "text-cyan-500" },
  { name: "Tag", icon: Tag, color: "text-emerald-500" },
  { name: "Star", icon: Star, color: "text-yellow-500" },
  { name: "Heart", icon: Heart, color: "text-rose-500" },
  { name: "Camera", icon: Camera, color: "text-gray-500" },
  { name: "Music", icon: Music, color: "text-indigo-500" },
  { name: "Book", icon: Book, color: "text-blue-600" },
  { name: "Laptop", icon: Laptop, color: "text-gray-700" },
  { name: "Phone", icon: Phone, color: "text-green-600" },
  { name: "Watch", icon: Watch, color: "text-slate-600" },
  { name: "Gem", icon: Gem, color: "text-purple-600" },
  { name: "Crown", icon: Crown, color: "text-amber-600" },
  { name: "Rocket", icon: Rocket, color: "text-red-500" },
];

const AddForm: React.FC<AddCategoryFormProps> = ({
  categories,
  setCategories,
}) => {
  const { isBn } = useApp();

  const [name, setName] = useState<string>("");
  const [nameBn, setNameBn] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("ShoppingBag");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [uploadMethod, setUploadMethod] = useState<"icon" | "image">("icon");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.icon : ShoppingBag;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(isBn ? "শুধু ইমেজ ফাইল সাপোর্টেড" : "Only image files are supported");
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error(isBn ? "ইমেজ সাইজ 2MB এর কম হতে হবে" : "Image size must be less than 2MB");
        return;
      }
      
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError(isBn ? "ক্যাটাগরির নাম (ইংরেজি) দিন" : "Enter category name (English)");
      return;
    }
    
    if (!nameBn.trim()) {
      setError(isBn ? "ক্যাটাগরির নাম (বাংলা) দিন" : "Enter category name (Bangla)");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    let formData;
    let headers = {};

    if (uploadMethod === "image" && selectedImage) {
      // Use FormData for image upload
      formData = new FormData();
      formData.append("name", name.trim());
      formData.append("nameBn", nameBn.trim());
      formData.append("image", selectedImage);
      headers = {}; // Let browser set Content-Type for FormData
    } else {
      // Use JSON for icon upload
      formData = JSON.stringify({
        name: name.trim(),
        nameBn: nameBn.trim(),
        icon: selectedIcon,
      });
      headers = { "Content-Type": "application/json" };
    }

    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isBn ? "ক্যাটাগরি সংরক্ষণ করতে ব্যর্থ" : "Failed to save category"));
      }

      // Add the new category to the list
      if (data.success && data.data) {
        const newCategory: Category = {
          _id: data.data._id,
          id: data.data._id,
          name: data.data.name,
          nameBn: data.data.nameBn,
          icon: data.data.icon,
          image: data.data.image,
          slug: data.data.slug,
          active: data.data.active,
          itemCount: 0,
        };
        
        setCategories([...categories, newCategory]);
        toast.success(data.message || (isBn ? "ক্যাটাগরি সফলভাবে সংরক্ষণ হয়েছে!" : "Category saved successfully!"));
        
        // Clear form only on success
        setName("");
        setNameBn("");
        setSelectedIcon("ShoppingBag");
        setSelectedImage(null);
        setImagePreview("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(isBn ? "ক্যাটাগরি সংরক্ষণ করতে ব্যর্থ" : "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      const errorMessage = error instanceof Error ? error.message : (isBn ? "ক্যাটাগরি সংরক্ষণ করতে ব্যর্থ" : "Failed to save category");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const SelectedIcon = getIconComponent(selectedIcon);

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
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "ক্যাটাগরির নাম (বাংলা)" : "Category Name (Bangla)"}
          </label>
          <input
            type="text"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
            placeholder="উদাঃ শীতকালীন সংগ্রহ"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50"
            disabled={isLoading}
          />
        </div>

        {/* Upload Method Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            {isBn ? "আপলোড পদ্ধতি" : "Upload Method"}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setUploadMethod("icon")}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                uploadMethod === "icon"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {isBn ? "আইকন" : "Icon"}
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod("image")}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                uploadMethod === "image"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Image className="w-4 h-4" />
              {isBn ? "ইমেজ" : "Image"}
            </button>
          </div>
        </div>

        {/* Icon Selection Field */}
        {uploadMethod === "icon" && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {isBn ? "আইকন সিলেক্ট করুন" : "Select Icon"}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center gap-2 bg-white"
                disabled={isLoading}
              >
                <SelectedIcon className="w-5 h-5 text-blue-500" />
                <span className="flex-1 text-left">{selectedIcon}</span>
                <Plus className="w-4 h-4 text-slate-400" />
              </button>

              {showIconPicker && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-1 p-2">
                    {availableIcons.map((icon) => {
                      const IconComponent = icon.icon;
                      return (
                        <button
                          key={icon.name}
                          type="button"
                          onClick={() => {
                            setSelectedIcon(icon.name);
                            setShowIconPicker(false);
                          }}
                          className={`p-2 rounded-lg hover:bg-slate-100 transition-colors flex flex-col items-center gap-1 ${
                            selectedIcon === icon.name ? "bg-blue-50 ring-2 ring-blue-500" : ""
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 ${icon.color}`} />
                          <span className="text-[10px] text-slate-600">{icon.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Upload Field */}
        {uploadMethod === "image" && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {isBn ? "ক্যাটাগরি ইমেজ আপলোড করুন" : "Upload Category Image"}
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    {isBn ? "ইমেজ সিলেক্ট করতে ক্লিক করুন" : "Click to select image"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PNG, JPG, GIF (Max 2MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-32 mx-auto rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
            {error}
          </p>
        )}

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
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isBn ? "সংরক্ষণ করুন" : "Save Category"}
        </button>
      </form>
    </div>
  );
};

export default AddForm;