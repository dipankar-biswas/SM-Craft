"use client";

import { useState } from "react";
import { Menu, ShoppingBag, Image as ImageIcon, Globe } from "lucide-react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useApp } from "../context/AppContext";

export const Sidebar = ({ isExpanded, setIsExpanded, categories }) => {
  const { language, setLanguage, isBn } = useApp();

  return (
    <>
      {/* Overlay - Full width background */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-40 transition-all duration-300 hidden lg:flex ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* Fixed Header - Top Section */}
        <div className="flex-shrink-0 px-2 pt-4 pb-3 border-b border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={() => setIsExpanded(true)}
            className="bg-[#0f4a47] hover:bg-[#0c3937] transition-colors relative flex items-center gap-3 ps-3 pe-2 py-2 w-full rounded-full text-white"
          >
            <div className="min-w-[24px] flex justify-center">
              <Menu size={24} />
            </div>
            <span
              className={`text-sm text-white font-medium whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              {isBn ? "মেনু" : "Menu"}
            </span>
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 custom-scrollbar">
          <nav className="flex flex-col gap-1 w-full">
            <Link
              href={`/products`}
              className="flex items-center gap-3 ps-3 pe-2 py-2.5 hover:bg-gray-50 rounded-lg transition-colors w-full"
            >
              <div className="min-w-[24px] flex justify-center">
                <ShoppingBag size={20} className="text-blue-500" />
              </div>
              <span
                className={`text-sm font-medium text-gray-700 whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {isBn ? "সব পণ্য" : "All Products"}
              </span>
            </Link>

            {/* Categories List */}
            {categories.map((item) => (
              <Link
                href={`${`/product-category/${item.slug}`}`}
                key={item.name}
                className="flex items-center gap-3 ps-3 pe-2 py-2.5 hover:bg-gray-50 rounded-lg transition-colors w-full"
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
                <span
                  className={`text-sm font-medium text-gray-700 whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "opacity-100" : "opacity-0 hidden"
                  }`}
                >
                  {isBn ? item.nameBn : item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Fixed Footer - Bottom Section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {isExpanded && (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span
                    className={isExpanded ? "opacity-100" : "opacity-0 hidden"}
                  >
                    {isBn ? "ভাষা নির্বাচন" : "Language"}
                  </span>
                </>
              )}
            </div>
            <span
              className={`text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 ${!isExpanded && "hidden"}`}
            >
              {language.toUpperCase()}
            </span>
          </div>

          <div
            className={`grid grid-cols-2 gap-1 p-1 bg-slate-50 rounded-lg border border-slate-100 ${!isExpanded && "hidden"}`}
          >
            <button
              onClick={() => setLanguage("en")}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                language === "en"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("bn")}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                language === "bn"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* Collapsed mode language indicator */}
          {!isExpanded && (
            <div className="flex justify-center">
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                title={
                  language === "en" ? "Switch to বাংলা" : "Switch to English"
                }
              >
                <Globe className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Custom Scrollbar Styles - Add to your global CSS or component */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f1f1f1;
        }
      `}</style>
    </>
  );
};
