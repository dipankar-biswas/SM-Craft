"use client";

import { Suspense, useState } from "react";
import {
  Menu,
  ShoppingBag,
  Store,
  Image as ImageIcon,
  Shirt,
  User,
  Briefcase,
  Backpack,
  ChevronLeft,
  X,
  Search,
  Globe,
  Home,
  Info,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

const SearchInput = () => {
  const { search, setSearch, isBn } = useApp();
  const router = useRouter();

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products/search?q=${encodeURIComponent(search)}`);
      setIsMobileExpanded(false); // Close sidebar after search
    }
  };

  return (
    <form onSubmit={onSearch} className="w-full p-2">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-[#0d4750] focus:border-transparent block pl-12 p-3 shadow-sm placeholder-gray-400"
          placeholder={isBn ? "পণ্য খুঁজুন..." : "Search for products"}
        />
      </div>
    </form>
  );
};

export const SidebarMobile = ({ 
  isMobileExpanded, 
  setIsMobileExpanded, 
  categories = [] // ডায়নামিক ক্যাটাগরি প্রপস
}) => {
  const { isBn, language, setLanguage } = useApp();
  const [activeTab, setActiveTab] = useState("Categories");
  const tabs = [isBn ? "ক্যাটাগরি" : "Categories", isBn ? "মেনু" : "Menu"];

  // Navigation menu items
  const menuItems = [
    { name: isBn ? "হোম" : "Home", slug: "/", icon: Home },
    { name: isBn ? "আমাদের সম্পর্কে" : "About Us", slug: "/about", icon: Info },
    { name: isBn ? "যোগাযোগ করুন" : "Contact Us", slug: "/contact", icon: Mail },
    { name: isBn ? "সব পণ্য" : "All Products", slug: "/products", icon: ShoppingBag },
  ];

  return (
    <>
      {/* Overlay - Full width background */}
      {isMobileExpanded && (
        <div
          onClick={() => setIsMobileExpanded(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
        />
      )}
      
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-40 transition-all duration-300 block ${
          isMobileExpanded ? "w-80" : "w-0 overflow-hidden"
        }`}
      >
        {/* Fixed Header Section */}
        <div className="flex-shrink-0">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="relative flex flex-col items-center justify-center">
              <div className="flex items-center gap-0.5">
                <span className="text-black text-2xl font-black tracking-tighter">
                  SM
                </span>
                <div className="relative flex items-end mx-1">
                  <span className="text-black text-2xl font-black z-20">A</span>
                  <div className="absolute -left-2 -bottom-1 w-[14px] h-[24px] border-r-[4px] border-b-[4px] border-red-600 rounded-br-full rotate-12 -z-10"></div>
                  <div className="absolute -left-3 -bottom-2 w-[18px] h-[28px] border-r-[3px] border-b-[3px] border-green-500 rounded-br-full rotate-6 -z-20"></div>
                </div>
                <span className="text-black text-2xl font-black tracking-tighter">
                  RT
                </span>
              </div>
              <div className="bg-white px-2 py-0.5 rounded-full shadow-sm text-red-600 font-bold text-[8px] uppercase tracking-[0.2em] -mt-1">
                {isBn ? "পাঞ্জাবি শপ" : "Panjabi Shop"}
              </div>
            </div>

            <button
              onClick={() => setIsMobileExpanded(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Search Input */}
          <Suspense
            fallback={
              <div className="flex-1 max-w-xl mx-2 relative">
                <div className="w-full h-12 bg-gray-100 rounded-full animate-pulse"></div>
              </div>
            }
          >
            <SearchInput />
          </Suspense>

          {/* Tabs Container */}
          <div className="flex w-full border-b border-gray-100 px-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab === "Categories" || tab === "ক্যাটাগরি" ? "Categories" : "Menu")}
                className={`flex-1 text-center text-sm font-semibold transition-all duration-300 py-2.5 ${
                  (activeTab === "Categories" && (tab === "Categories" || tab === "ক্যাটাগরি")) ||
                  (activeTab === "Menu" && (tab === "Menu" || tab === "মেনু"))
                    ? "text-red-500 border-b-2 border-red-500"
                    : "text-gray-500 hover:text-red-500 border-b-2 border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {/* Categories Section */}
          {activeTab === "Categories" ? (
            <div className="flex flex-col gap-1 w-full px-2">
              {categories.length > 0 ? (
                categories.map((item) => (
                  <Link
                    href={`/product-category/${item.slug}`}
                    key={item._id || item.id || item.name}
                    onClick={() => setIsMobileExpanded(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors w-full"
                  >
                    <div className="min-w-[24px] flex justify-center">
                      {item.image && item.image.startsWith("/") ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-5 h-5 object-contain rounded"
                        />
                      ) : (
                        <Icon
                          name={item.icon}
                          size={20}
                          color={item.iconColor || "#3B82F6"}
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {isBn ? item.nameBn : item.name}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  {isBn ? "কোন ক্যাটাগরি নেই" : "No categories found"}
                </div>
              )}
            </div>
          ) : (
            /* Menu Section */
            <div className="flex flex-col gap-1 w-full px-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.slug}
                    href={item.slug}
                    onClick={() => setIsMobileExpanded(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors w-full"
                  >
                    <div className="min-w-[24px] flex justify-center">
                      <IconComponent size={20} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Fixed Footer Section */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white p-4">
          {/* Language Selector */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">
                {isBn ? "ভাষা নির্বাচন" : "Language"}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage("en")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  language === "en"
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  language === "bn"
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center pt-2">
            <p className="text-[10px] text-gray-400">
              Version 1.0.0 | © 2024
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};