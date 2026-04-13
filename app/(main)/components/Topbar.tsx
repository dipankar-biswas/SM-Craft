"use client";

import { AlignLeft, Menu, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { Suspense } from "react";

// SearchInput আলাদা কম্পোনেন্ট
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
    <form
      onSubmit={onSearch}
      className="flex-1 max-w-xl mx-8 relative hidden lg:block"
    >
      <div className="relative flex items-center w-full">
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

export const Topbar = ({
  isExpanded,
  setIsExpanded,
  openCart,
  isMobileExpanded,
  setIsMobileExpanded
}) => {
  const { cart } = useApp();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header
      className={`sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 py-3 lg:py-4 shadow-sm transition-all duration-300 ${
        isSticky ? "shadow-md" : "shadow-sm"
      }`}
    >
      <button
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
        className="flex lg:hidden"
      >
        <div className="min-w-[24px] flex justify-center">
          <Menu size={24} />
        </div>
      </button>

      {/* Left Section */}
      <div className="flex items-center gap-8">
        <Logo />

        <button
          onClick={() => setIsExpanded(true)}
          className="hidden md:flex items-center gap-2 bg-[#0d4750] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#0a3840] transition-colors whitespace-nowrap ml-4 shadow-sm"
        >
          <AlignLeft size={20} />
          <span>All Categories</span>
        </button>
      </div>

      {/* Middle Search Section - Suspense added */}
      <Suspense
        fallback={
          <div className="flex-1 max-w-xl mx-8 relative hidden lg:block">
            <div className="w-full h-12 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
        }
      >
        <SearchInput />
      </Suspense>

      {/* Right Navigation & Cart */}
      <div className="flex items-center gap-8 text-sm font-medium text-gray-700">
        <nav className="hidden xl:flex items-center gap-6">
          <Link href="/" className="text-[#0d4750] hover:text-[#0d4750]/80">
            Home
          </Link>
          <Link href="/about" className="hover:text-[#0d4750]">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-[#0d4750]">
            Contact Us
          </Link>
          <Link href="/products" className="hover:text-[#0d4750]">
            All Products
          </Link>
        </nav>

        <div className="relative cursor-pointer" onClick={openCart}>
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors">
            <ShoppingCart size={22} />
          </div>
          <span className="absolute top-0 right-0 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full transform translate-x-1/4 -translate-y-1/4 shadow-sm">
            {cart.length}
          </span>
        </div>
      </div>
    </header>
  );
};
