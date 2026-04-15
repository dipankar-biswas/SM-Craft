'use client'

import { ProductCard } from "./ProductCard";
import { useApp } from "../context/AppContext";
import Link from "next/link";

export const HomeProduct = ({ categorywiseproducts }) => {
    const { isBn } = useApp();

  return (
    <section className="py-8">
        {categorywiseproducts.filter(cat => cat.slug !== "products" && cat.products.length > 0).map((category, idx) => (
          <div key={idx} className="container mx-auto w-full px-4 mb-12">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                {/* {category.icon} */}
                <h2 className="text-xl font-semibold text-gray-600">
                  {isBn ? category.nameBn : category.name}
                </h2>
              </div>
              <div className="flex gap-2">
                <Link href={`${`/product-category/${category.slug}`}`} className="rounded-full bg-[#095059] hover:bg-[#0e6e78] text-white text-sm font-semibold px-4 py-2 flex items-center justify-center transition-colors duration-300">
                  {isBn ? 'সব দেখুন' : 'View All'}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </section>
  );
};