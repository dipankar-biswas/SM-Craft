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
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const { search, setSearch } = useApp();
  const router = useRouter();

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products/search?q=${encodeURIComponent(search)}`);
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
          placeholder="Search for products"
        />
      </div>
    </form>
  );
};

export const SidebarMobile = ({ isMobileExpanded, setIsMobileExpanded }) => {
  const categories = [
    {
      name: "All Products",
      icon: <ShoppingBag size={20} className="text-blue-500" />,
      slug: "products",
    },
    {
      name: "Eid Collection 2026",
      icon: <Store size={20} className="text-purple-500" />,
      slug: "eid-collection-2026",
    },
    {
      name: "Eid Exclusive 2026",
      icon: <ImageIcon size={20} className="text-pink-500" />,
      slug: "eid-exclusive-2026",
    },
    {
      name: "Katan Panjabi",
      icon: <Shirt size={20} className="text-blue-400" />,
      slug: "katan-panjabi",
    },
    {
      name: "Premium Koti",
      icon: <User size={20} className="text-green-500" />,
      slug: "premium-koti",
    },
    {
      name: "Embroidery Panjabi",
      icon: <Briefcase size={20} className="text-yellow-500" />,
      slug: "embroidery-panjabi",
    },
    {
      name: "Print Panjabi",
      icon: <Backpack size={20} className="text-blue-500" />,
      slug: "print-panjabi",
    },
  ];

  const [activeTab, setActiveTab] = useState("Categories");
  const tabs = ["Categories", "Menu"];

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
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col py-4 z-40 transition-all duration-300 block ${
          isMobileExpanded ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100">
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
              Panjabi Shop
            </div>
          </div>

          <button
            onClick={() => setIsMobileExpanded(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <Suspense
          fallback={
            <div className="flex-1 max-w-xl mx-8 relative">
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
              onClick={() => {
                setActiveTab(tab);
              }}
              className={`flex-1 text-center text-sm font-semibold transition-all duration-300 py-2 ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-500 hover:text-red-500 border-b-2 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Categories Section */}
        {activeTab === "Categories" ? (
          <div className="flex flex-col gap-2 w-full flex-1 overflow-y-auto pt-4 px-2">
            {categories.map((item) => (
              <Link
                href={`${item.slug === "products" ? `/${item.slug}` : `/product-category/${item.slug}`}`}
                key={item.name}
                onClick={() => setIsMobileExpanded(false)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors w-full"
              >
                <div className="min-w-[24px] flex justify-center">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          /* Menu Section */
          <div className="flex flex-col gap-2 w-full flex-1 overflow-y-auto pt-4 px-2">
            <Link
              href="/"
              onClick={() => setIsMobileExpanded(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors w-full"
            >
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Home
              </span>
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileExpanded(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors w-full"
            >
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                About Us
              </span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileExpanded(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors w-full"
            >
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Contact Us
              </span>
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileExpanded(false)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors w-full"
            >
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                All Products
              </span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};