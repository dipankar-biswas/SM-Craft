'use client'
import { taka } from "../../../utils/currency";
import { toBengaliNumber } from "../../../utils/helpers";
import Link from "next/link";
import { useApp } from "../context/AppContext";

export const ProductCard = ({ product }) => {
  const { isBn, addToCart } = useApp();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };


  return (
    <div 
      className="relative overflow-visible"
    >
      <div className="group rounded-lg overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg">
        {/* Badge */}
        {(product.isSale || product.discount) && (
          <span className="absolute top-3 left-3 bg-[#095059] text-white text-xs px-2 py-1 rounded-full z-10">
            -{product.discount || Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
        {product.isNew && !product.isSale && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
            {isBn ? 'নতুন' : 'NEW'}
          </span>
        )}

        <div className="relative h-[260px] sm:h-[380px] md:h-[240px] lg:h-[350px] overflow-hidden bg-[#fafafa]">
          <Link href={`/product/${product.id}`} className="absolute inset-0 h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0"
            />
            <img
              src={product.hoverImage || product.image}
              alt={`${product.name} alt`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-2000 group-hover:scale-110 group-hover:opacity-100"
            />
          </Link>
        </div>

        <div className="px-3 pb-3 pt-3 text-center">
          <Link href={`/product/${product.id}`} className="mx-auto text-[15px] line-clamp-2 font-semibold hover:text-[#095059] transition-all duration-300 leading-5 text-slate-700">
            {isBn ? product.nameBn : product.name}
          </Link>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {product.originalPrice && (
              <span className="text-[12px] text-gray-400 line-through">
                {isBn
                ? toBengaliNumber(product.originalPrice)
                : taka(product.originalPrice)
                }
              </span>
            )}
            <p className="text-[22px] font-semibold leading-none text-[#095059]">
              {isBn 
                ? toBengaliNumber(taka(product.price)) 
                : taka(product.price)
              }
            </p>
          </div>

          <div className="mt-0 overflow-hidden transition-all duration-300 mt-4">
            <button 
              onClick={handleAddToCart} 
              className="rounded bg-[#095059] hover:bg-[#0e6e78] transition-all duration-300 px-4 py-2 text-sm font-semibold text-white"
            >
              {isBn ? 'এখনই কিনুন' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};