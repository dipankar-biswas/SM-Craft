"use client";

import { taka } from "@/utils/currency";
import Link from "next/link";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const CheckoutPage = () => {
  const { cart } = useApp();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (method: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
    // Add your order submission logic here
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] font-['Inter',sans-serif] py-6 md:py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Grid: Left Form + Right Order Summary */}
        <div className=" gap-8">
          {/* LEFT COLUMN: Billing Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Support Info */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center gap-3 text-sm text-gray-500">
              <i className="fas fa-headset text-2xl text-[#d4a373]"></i>
              <div>
                অর্ডার সংক্রান্ত যেকোনো সাহায্যে কল করুন:{" "}
                <strong className="text-[#0f5c54]">01965-666777</strong> (সকাল
                ১০টা - রাত ৯টা)
              </div>
            </div>

            {/* Billing Form Card */}
            <div className="bg-white rounded-2xl shadow-md p-5 md:p-6 border border-gray-100">
              <div className="flex items-center gap-2 border-b border-amber-200 pb-3 mb-5">
                <i className="fas fa-map-marked-alt text-[#d4a373] text-xl"></i>
                <h2 className="text-xl md:text-2xl font-bold text-[#2c3e2f] font-serif tracking-tight">
                  ঠিকানা ও ডেলিভারি তথ্য
                </h2>
              </div>

              <p className="text-gray-500 text-sm mb-5 bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                <i className="fas fa-info-circle text-amber-500 mr-2"></i>
                অর্ডার করার পর আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন। সঠিক
                ঠিকানা ও মোবাইল নম্বর দিন।
              </p>

              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-sm">
                    আপনার নাম: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] transition"
                    required
                  />
                </div>

                {/* Complete Address */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-sm">
                    আপনার ঠিকানা: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="বাড়ির নম্বর, রাস্তা, এলাকা, জেলা"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] transition"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    <i className="fas fa-location-dot mr-1"></i> ডেলিভারি ঠিকানা
                    সঠিকভাবে দিন
                  </p>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5 text-sm">
                    মোবাইল নম্বর: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0১XXXXXXXXX"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] transition"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    অর্ডার আপডেটের জন্য সক্রিয় নম্বর দিন
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 sticky top-6 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0a2f2a] to-[#1e4a46] px-5 py-4">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <i className="fas fa-shopping-bag"></i> অর্ডার সামারি
                </h3>
              </div>

              <div className="p-5 space-y-5">
                {/* Product List */}
                <div>
                  <div className="flex justify-between text-sm font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-2">
                    <span>পণ্য</span>
                    <span>সাবটোটাল</span>
                  </div>
                  <div className="space-y-3">
                    {cart.map((product, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between text-gray-700 border-b border-gray-100 pb-2 ${idx === cart.length - 1 ? "border-b-0" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${product.id}`}
                            className="text-sm font-medium"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover"
                            />
                          </Link>
                          <div className="text-sm font-medium">
                            <Link href={`/product/${product.id}`} className="hover:text-[#0e6e78] transition-colors">
                              {product.name}
                            </Link>{" "}
                            <span className="text-gray-500">
                              x {product.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold">
                          {taka(product.price * product.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotal and Shipment */}
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-gray-800 font-medium">
                    <span>সব পণ্যের মোট</span>
                    <span>{taka(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>
                      <i className="fas fa-shipping-fast"></i> ডেলিভারি চার্জ
                    </span>
                    <span>৳ 0</span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 ml-5">
                    <i className="fas fa-box"></i> একটি কুরিয়ার প্যাকেজ (১-৩
                    ব্যবসায়িক দিন)
                  </p>
                  <div className="flex justify-between text-lg font-bold text-[#c15c3a] pt-2 border-t border-dashed border-gray-200 mt-1">
                    <span>মোট পরিশোধ্য</span>
                    <span>{taka(subtotal)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <i className="fas fa-info-circle"></i> ক্যাশ অন ডেলিভারি বা
                    অনলাইন পেমেন্ট
                  </p>
                </div>

                {/* Terms Note */}
                <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-3 text-center">
                  <i className="fas fa-shield-alt"></i> অর্ডার কনফার্ম করার আগে
                  দয়া করে ঠিকানা ও পণ্যের বিবরণ চেক করুন।
                </div>
              </div>

              <div className="px-4 py-2">
                <button
                  type="submit"
                  className="w-full bg-[#0f5c54] hover:bg-[#0b4a43] text-white font-bold py-3 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 text-base"
                >
                  <i className="fas fa-check-circle"></i> অর্ডার কনফার্ম করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
