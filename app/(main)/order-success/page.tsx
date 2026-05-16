// app/order-success/page.tsx (Clear cart here, not in server action)
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { toBengaliNumber } from "@/utils/helpers";
import { toast } from "sonner";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isBn, clearCart } = useApp();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const id = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");
    
    if (!id) {
      router.push("/");
      return;
    }
    
    setOrderId(id);
    
    // ✅ Clear cart here (client-side)
    const clearUserCart = async () => {
      try {
        // Clear cart from context/localStorage
        clearCart();
        
        // Clear all cart-related storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem("cart");
          localStorage.removeItem("guest_cart");
          sessionStorage.removeItem("checkoutFormData");
          sessionStorage.removeItem("pendingCheckout");
          sessionStorage.removeItem("pendingStripeCheckout");
        }
        
        // If Stripe payment, verify with backend
        if (sessionId) {
          const verifyResponse = await fetch("/api/stripe/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId, orderId: id }),
          });
          
          const verifyData = await verifyResponse.json();
          
          if (!verifyData.success) {
            console.warn("Payment verification failed:", verifyData.message);
          }
        }
        
        toast.success(isBn ? "অর্ডার সফল হয়েছে!" : "Order successful!");
        setIsProcessing(false);
        
      } catch (error) {
        console.error("Error clearing cart:", error);
        setIsProcessing(false);
        // Still show success even if cart clear fails
        toast.success(isBn ? "অর্ডার সফল হয়েছে!" : "Order successful!");
      }
    };
    
    clearUserCart();
    
  }, [searchParams, router, clearCart, isBn]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-spinner fa-spin text-blue-500 text-4xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isBn ? "প্রক্রিয়াকরণ..." : "Processing..."}
          </h1>
          <p className="text-gray-600">
            {isBn 
              ? "আপনার অর্ডার কনফার্ম করা হচ্ছে..." 
              : "Confirming your order..."}
          </p>
        </div>
      </div>
    );
  }

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
            {isBn ? 'অর্ডার সফল হয়েছে!' : 'Order Successful!'}
          </h1>
          <p className="text-gray-600">
            {isBn ? 'আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে।' : 'Your order has been successfully completed.'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">{isBn ? 'আপনার অর্ডার নম্বর' : 'Your Order Number'}</p>
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
            {isBn ? 'হোম পেজে ফিরে যান' : 'Return to Home'}
          </Link>
          <Link
            href={`/order-tracking?orderId=${orderId}`}
            className="block w-full border border-[#0f5c54] text-[#0f5c54] hover:bg-[#0f5c54] hover:text-white font-semibold py-3 rounded-xl transition text-center"
          >
            <i className="fas fa-truck mr-2"></i>
            {isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}
          </Link>
        </div>
      </div>
    </div>
  );
}