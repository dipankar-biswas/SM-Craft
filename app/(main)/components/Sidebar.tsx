"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

export const Sidebar = ({ isExpanded, setIsExpanded }) => {

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

  return (
    <>
      {/* Overlay - Full width background */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          // onMouseEnter={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col py-4 z-40 transition-all duration-300 hidden lg:block ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        <div className="px-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={() => setIsExpanded(true)}
            // onMouseLeave={() => setIsExpanded(false)}
            className="bg-[#0f4a47] hover:bg-[#0c3937] transition-colors relative flex items-center gap-3 ps-3 pe-2 py-2 w-full rounded-full text-white"
          >
            {/* {isExpanded ? <ChevronLeft size={24} /> : <Menu size={24} />} */}
            <div className="min-w-[24px] flex justify-center">
              <Menu size={24} />
            </div>
            <span
              className={`text-sm text-white font-medium text-gray-700 whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              MENU
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-2 w-full flex-1 overflow-y-auto pt-2 px-2">
          {categories.map((item) => (
            <Link              
              href={`${item.slug === 'products' ? `/${item.slug}` : `/product-category/${item.slug}`}`}
              key={item.name}
              className="flex items-center gap-3 ps-3 pe-2 py-2 hover:bg-gray-50 rounded-lg transition-colors w-full"
            >
              <div className="min-w-[24px] flex justify-center">
                {item.icon}
              </div>
              <span
                className={`text-sm font-medium text-gray-700 whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Sidebar Header */}
        {/* <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100">
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
            onClick={closeSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div> */}
        {/* Sidebar Footer (Optional) */}
        {/* <div className="border-t border-gray-100 pt-4 px-4">
          <button className="w-full bg-[#0f4a47] text-white py-2.5 rounded-lg hover:bg-[#0c3937] transition-colors text-sm font-medium">
            Sign In / Sign Up
          </button>
        </div> */}
      </aside>
    </>
  );
};
