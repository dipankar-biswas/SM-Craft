"use client";
import { ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Link from "next/link";


export default function Breadcrumb({ titleBn, title }) {
  const { isBn } = useApp();
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
      <Link href="/" className="hover:text-orange-500 transition-colors">
        {isBn ? 'হোম' : 'Home'}
      </Link>
      <ChevronRight size={12} className="text-gray-400" />
      <span className="flex items-center gap-1">
        <span className="text-gray-400">{isBn ? titleBn : title}</span>
      </span>
    </nav>
  );
}
