// app/order-success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { toBengaliNumber } from "@/utils/helpers";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const { isBn } = useApp();

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (!id) {
      router.push("/");
    } else {
      setOrderId(id);
    }
  }, [searchParams, router]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-green-500 text-4xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isBn ? 'অর্ডার সফল হয়েছে!' : 'Order was successful!'}
          </h1>
          <p className="text-gray-600">
            {isBn ? 'আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।' : 'Your order has been successfully completed.'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">{isBn ? 'আপনার অর্ডার নম্বর' : 'Your order number'}</p>
          <p className="text-xl font-bold text-[#0f5c54]">{orderId}</p>
        </div>

        <div className="space-y-3 mb-6 text-left">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <i className="fas fa-clock text-[#d4a373] mt-0.5"></i>
            <span>{isBn ? 'আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে।' : 'Our representative will contact you soon.'}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <i className="fas fa-phone-alt text-[#d4a373] mt-0.5"></i>
            <span>{isBn ? 'যেকোনো সমস্যায় কল করুন' : 'Call for any problems.'}: <strong className="text-[#0f5c54]">{isBn ? toBengaliNumber('01741571104') : '01741571104'}</strong></span>
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-[#0f5c54] hover:bg-[#0b4a43] text-white font-semibold py-3 rounded-xl transition text-center"
          >
            <i className="fas fa-home mr-2"></i>
            {isBn ? 'হোম পেজে ফিরে যান' : 'Return to home page'}
          </Link>
          <Link
            href={`/order-tracking?phone=${encodeURIComponent("")}`}
            className="block w-full border border-[#0f5c54] text-[#0f5c54] hover:bg-[#0f5c54] hover:text-white font-semibold py-3 rounded-xl transition text-center"
          >
            <i className="fas fa-truck mr-2"></i>
            {isBn ? 'অর্ডার ট্র্যাক করুন' : 'Tracking order'}
          </Link>
        </div>
      </div>
    </div>
  );
}