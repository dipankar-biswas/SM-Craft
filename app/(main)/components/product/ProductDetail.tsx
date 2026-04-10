"use client";
import { useState, useRef } from "react";
import {
  Star,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Eye,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Flame,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { taka } from "@/utils/currency";

const colors = [
  { name: "Taupe", hex: "#9b8576" },
  { name: "Navy", hex: "#2c3e6b" },
  { name: "Black", hex: "#1a1a1a" },
];

const sizes = ["L", "M", "S", "XL", "XS"];

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating
              ? "text-orange-400 fill-orange-400"
              : "text-gray-300 fill-gray-200"
          }
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-blue-500 ml-1">({count} reviews)</span>
      )}
    </div>
  );
}

export default function ProductDetail({ product }) {
  const { addToCart, addToWishlist } = useApp();

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("XL");
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showZoom, setShowZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(200); // 100% to 400%
  const imageContainerRef = useRef(null);
  const zoomLensRef = useRef(null);

  const productImages = [product.image, product.hoverImage];

  const goSlide = (direction: "prev" | "next") => {
    setActiveThumb((prev) => {
      if (direction === "prev") {
        return (prev - 1 + productImages.length) % productImages.length;
      }
      return (prev + 1) % productImages.length;
    });
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;

    // Clamp values between 0 and 100
    x = Math.min(Math.max(x, 0), 100);
    y = Math.min(Math.max(y, 0), 100);

    setZoomPosition({ x, y });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 50, 400));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 50, 100));
  };

  const currentImage = productImages[activeThumb];

  return (
    <div className="flex gap-6">
      {/* Image Gallery */}
      <div className="w-[420px] flex-shrink-0">
        {/* Zoom controls */}
        <div className="flex items-center justify-end gap-2 mb-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white rounded-full transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs font-medium text-gray-700 min-w-[45px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white rounded-full transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* Main image with zoom */}
        <div
          ref={imageContainerRef}
          className="relative border border-gray-200 rounded overflow-hidden bg-gray-50 mb-3 group cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
        >
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-[420px] object-cover object-top"
          />

          {/* Zoom lens effect */}
          {showZoom && zoomLevel > 100 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `url(${currentImage}) no-repeat`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: `${zoomLevel}%`,
                opacity: 0.95,
              }}
            />
          )}

          {/* Zoom indicator */}
          {showZoom && zoomLevel > 100 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {zoomLevel}% zoom
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            <span className="bg-[#095059] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              SALE
            </span>
          </div>

          <button
            onClick={() => goSlide("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#0e6e78] hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => goSlide("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#0e6e78] hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => goSlide("prev")}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-[#0e6e78] hover:text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={12} />
          </button>
          <div className="flex gap-1.5 overflow-hidden flex-1">
            {productImages.slice(0, 6).map((thumb, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className={`w-12 h-12 flex-shrink-0 border-2 rounded overflow-hidden transition-all ${
                  activeThumb === i
                    ? "border-orange-500"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <img
                  src={thumb}
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>
          <button
            onClick={() => goSlide("next")}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-[#0e6e78] hover:text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {/* Brand & Title */}
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
            {product.name}
          </h1>
          {/* Features */}
          <ul className="text-sm text-gray-600 space-y-1 mb-4 pl-4">
            <li className="list-disc">Anti-vibration Metal Hooks.</li>
            <li className="list-disc">
              Designed For Premium Sensitivity And Tactile Feel.
            </li>
            <li className="list-disc">
              Available In Various Sizes To Accommodate Different Hand Sizes.
            </li>
          </ul>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-3xl font-black text-gray-900">
            {taka(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-lg text-gray-500 line-through">
              {taka(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Qty + Add to cart */}
        <div className="flex items-center gap-3 mb-3 mt-8">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors border-r border-gray-300"
            >
              <Minus size={14} />
            </button>
            <span className="px-5 py-2 text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors border-l border-gray-300"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => addToCart({ ...product, quantity: qty })}
            className="flex-1 bg-[#095059] hover:bg-[#0e6e78] text-white font-bold py-2.5 rounded transition-colors text-sm"
          >
            Add To Cart
          </button>
        </div>

        {/* Buy Now */}
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded transition-colors text-sm mb-4">
          Buy Now
        </button>
      </div>

      <div className="">
        <table className="w-[300px] text-left text-sm text-gray-600 border border-gray-100 shadow-sm rounded">
          <tbody>
            <tr className="bg-gradient-to-r from-[#095059] to-[#e0e6e78] text-white">
              <th className="py-2 px-3 text-gray-800 w-[100px] font-bold text-white">
                বিবরণ
              </th>
              <td className="py-2 px-3 font-bold text-white">তথ্য</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800 w-[100px]">
                Brand
              </th>
              <td className="py-2 px-3">Creative</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800 w-[100px]">
                Category
              </th>
              <td className="py-2 px-3">Electronics</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800 w-[100px]">
                Color
              </th>
              <td className="py-2 px-3">Green</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800 w-[100px]">
                Rating
              </th>
              <td className="py-2 px-3">
                <StarRating rating={4} count={75} />
              </td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800 w-[100px]">
                Reviews
              </th>
              <td className="py-2 px-3">75</td>
            </tr>
            <tr className="border-t border-gray-100">
              <th className="py-2 px-3 font-medium text-gray-800 w-[100px]">
                Highlight
              </th>
              <td className="py-2 px-3">New Arrivals</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
