"use client";

import { taka } from "@/utils/currency";
import Link from "next/link";
import { useApp } from "../context/AppContext";

const CartPage = () => {
  const { isBn, cart, updateQuantity, removeFromCart } = useApp();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 5;
  

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4 grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* Cart Items Section - Using Table */}
        <section className="rounded border border-gray-200 bg-white p-4 overflow-x-auto">
          <h1 className="text-4xl text-[22px] font-semibold text-gray-800">
            Cart Summary
          </h1>

          <div className="mt-4 rounded border border-green-300 bg-green-50 p-3 text-sm text-green-700">
            Use GET20OFF coupon code to get 20% off on minimum order above $100
          </div>

          {cart.length === 0 ? (
            <div className="mt-8 text-center py-12">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link
                href="/"
                className="inline-block rounded bg-[#095059] px-6 py-2 text-white hover:bg-[#0e6e78] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">
                      {isBn ? 'সাইজ ও রং' : 'Sizes & Color'}
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">
                      Subtotal
                    </th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-700"></th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {cart.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Info */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-md border border-gray-200"
                          />
                          <Link
                            href={`/product/${item.id}`}
                            className="text-sm text-gray-700 hover:text-[#0e6e78] transition-colors font-medium"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-gray-500">
                              {isBn ? "সাইজ:" : "Size:"}
                            </span>
                            {item.selectedSize ? (
                                <span
                                  className="text-xs px-1.5 py-0.5 bg-gray-100 rounded"
                                >
                                  {item.selectedSize}
                                </span>
                            ) : (
                              <span className="text-xs text-gray-400">N/A</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs text-gray-500">
                              {isBn ? "রং:" : "Colors:"}
                            </span>
                            {item.selectedColor && item.selectedColor.length > 0 ? (
                                <span
                                  className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                                  style={{ backgroundColor: item.selectedColor }}
                                />
                            ) : (
                              <span className="text-xs text-gray-400">N/A</span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Price */}
                      <td className="py-4 px-2">
                        <span className="font-semibold text-[#095059]">
                          {taka(item.price)}
                        </span>
                      </td>

                      {/* Quantity Controls */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2 rounded border border-gray-300 w-fit">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="border-r border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-300 px-3 py-1 text-gray-700 font-semibold"
                          >
                            -
                          </button>
                          <span className="text-sm w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="border-l border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-300 px-3 py-1 text-gray-700 font-semibold"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="py-4 px-2">
                        <span className="font-semibold text-[#095059]">
                          {taka(item.price * item.quantity)}
                        </span>
                      </td>

                      {/* Remove Button */}
                      <td className="py-4 px-2 text-center">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 p-2 hover:text-red-700 transition-colors font-bold text-xl"
                          aria-label="Remove item"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Cart Totals Section */}
        <section className="rounded border border-gray-200 bg-white p-4 h-fit">
          <h2 className="text-3xl text-[22px] font-semibold">Cart totals</h2>

          <div className="mt-4 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{taka(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shipping</span>
              <div className="text-end">
                <div className="font-medium">ডেলিভারী চার্জ ফ্রি</div>
                <div className="font-medium">Shipping to Dhaka</div>
                <span className="font-medium">
                  {shipping === 0 ? taka(0) : taka(shipping)}
                  {shipping > 0 && (
                    <span className="text-xs text-gray-400 block">
                      Free shipping on orders over $100
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-semibold">
              <span>Total</span>
              <span className="text-[#095059]">
                {taka(subtotal + shipping)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded bg-[#095059] py-3 text-center font-semibold text-white hover:bg-[#0e6e78] transition-colors"
          >
            Proceed To Checkout
          </Link>

          <Link
            href="/"
            className="mt-3 block text-center text-sm text-gray-500 hover:text-[#0e6e78] transition-colors"
          >
            ← Continue Shopping
          </Link>
        </section>
      </div>
    </div>
  );
};

export default CartPage;
