// app/order-tracking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { taka } from "@/utils/currency";
import { useApp } from "../context/AppContext";
import { toBengaliNumber } from "@/utils/helpers";

interface OrderItem {
  productId: string;
  name: string;
  nameBn: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedColorBn?: string;
  selectedColorHex?: string;
  image?: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchMethod, setSearchMethod] = useState<"orderId" | "phone">(
    "orderId",
  );
  const { isBn } = useApp();

  // Check URL params on load
  useEffect(() => {
    const urlOrderId = searchParams.get("orderId");
    const urlPhone = searchParams.get("phone");

    if (urlOrderId) {
      setOrderId(urlOrderId);
      setSearchMethod("orderId");
      handleTrackOrder(urlOrderId);
    } else if (urlPhone) {
      setPhone(urlPhone);
      setSearchMethod("phone");
      handleTrackByPhone(urlPhone);
    }
  }, [searchParams]);

  const handleTrackOrder = async (trackingId?: string) => {
    const orderToTrack = trackingId || orderId;
    if (!orderToTrack) {
      setError("Please enter an order ID");
      return;
    }

    setLoading(true);
    setError("");
    setOrders([]);
    setSelectedOrder(null);

    try {
      const response = await fetch(`/api/orders/track?orderId=${orderToTrack}`);
      const data = await response.json();

      if (response.ok && data.order) {
        setSelectedOrder(data.order);
      } else {
        setError(data.error || "Order not found");
      }
    } catch (error) {
      setError("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackByPhone = async (phoneNumber?: string) => {
    const phoneToTrack = phoneNumber || phone;
    if (!phoneToTrack) {
      setError("Please enter your phone number");
      return;
    }

    if (phoneToTrack.length < 11) {
      setError("Please enter a valid 11-digit phone number");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedOrder(null);

    try {
      const response = await fetch(`/api/orders/track?phone=${phoneToTrack}`);
      const data = await response.json();

      if (response.ok && data.orders) {
        if (data.orders.length === 0) {
          setError("No orders found for this phone number");
        } else {
          setOrders(data.orders);
        }
      } else {
        setError(data.error || "Failed to fetch orders");
      }
    } catch (error) {
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrders([]);
  };

  const handleBackToSearch = () => {
    setSelectedOrder(null);
    setOrders([]);
    setError("");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "বিবেচনাধীন",
      confirmed: "কনফার্মড",
      processing: "প্রক্রিয়াকরণে",
      shipped: "পাঠানো হয়েছে",
      delivered: "ডেলিভারি সম্পন্ন",
      cancelled: "বাতিল করা হয়েছে",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "অপেক্ষমান",
      paid: "পরিশোধিত",
      failed: "ব্যর্থ",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-EN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateBn = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2c3e2f] mb-2">
            {isBn ? "অর্ডার ট্র্যাকিং" : "Order Tracking"}
          </h1>
          <p className="text-gray-600">
            {isBn
              ? "আপনার অর্ডারের সর্বশেষ অবস্থা জানুন"
              : "Know the latest status of your order."}
          </p>
        </div>

        {/* Search Section */}
        {!selectedOrder && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setSearchMethod("orderId")}
                className={`pb-2 px-4 font-medium transition-colors ${
                  searchMethod === "orderId"
                    ? "text-[#0f5c54] border-b-2 border-[#0f5c54]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {isBn ? "অর্ডার আইডি দ্বারা" : "By order ID"}
              </button>
              <button
                onClick={() => setSearchMethod("phone")}
                className={`pb-2 px-4 font-medium transition-colors ${
                  searchMethod === "phone"
                    ? "text-[#0f5c54] border-b-2 border-[#0f5c54]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {isBn ? "মোবাইল নম্বর দ্বারা" : "By mobile number"}
              </button>
            </div>

            {searchMethod === "orderId" ? (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {isBn ? "অর্ডার আইডি" : "Order ID"}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder={
                      isBn
                        ? "যেমন: ORD-20241215-1234"
                        : "Example: ORD-20241215-1234"
                    }
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] transition"
                    onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                  />
                  <button
                    onClick={() => handleTrackOrder()}
                    disabled={loading}
                    className="bg-[#0f5c54] hover:bg-[#0b4a43] text-white px-6 py-2.5 rounded-xl transition disabled:bg-gray-400"
                  >
                    {isBn
                      ? loading
                        ? "খুঁজছি..."
                        : "ট্র্যাক করুন"
                      : loading
                        ? "Looking for..."
                        : "Track"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {isBn
                    ? "আপনার অর্ডার কনফার্মেশন ইমেইলে অর্ডার আইডি পাবেন"
                    : "You will receive the order ID in your order confirmation email."}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {isBn ? "মোবাইল নম্বর" : "Mobile number"}
                </label>
                <div className="flex gap-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] transition"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleTrackByPhone()
                    }
                  />
                  <button
                    onClick={() => handleTrackByPhone()}
                    disabled={loading}
                    className="bg-[#0f5c54] hover:bg-[#0b4a43] text-white px-6 py-2.5 rounded-xl transition disabled:bg-gray-400"
                  >
                    {isBn
                      ? loading
                        ? "খুঁজছি..."
                        : "খুঁজুন"
                      : loading
                        ? "Looking for..."
                        : "Search"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {isBn
                    ? "অর্ডার করার সময় যে নম্বর ব্যবহার করেছেন সেটি দিন"
                    : "Enter the number you used when ordering."}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-[#0f5c54]"></i>
            <p className="mt-4 text-gray-600">
              {isBn
                ? "অর্ডার তথ্য সংগ্রহ করা হচ্ছে..."
                : "Collecting order information..."}
            </p>
          </div>
        )}

        {/* Orders List (for phone search) */}
        {!loading && orders.length > 0 && !selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {isBn ? "আপনার অর্ডারসমূহ" : "Your orders"} (
                {isBn
                  ? toBengaliNumber(orders.length.toString())
                  : orders.length}
                )
              </h2>
              <button
                onClick={handleBackToSearch}
                className="text-[#0f5c54] hover:underline text-sm"
              >
                <i className="fas fa-search mr-1"></i>{" "}
                {isBn ? "নতুন খুঁজুন" : "Find new"}
              </button>
            </div>

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition cursor-pointer"
                onClick={() => handleViewOrderDetails(order)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "অর্ডার আইডি" : "Order ID"}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {order.orderId}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      order.orderStatus,
                    )}`}
                  >
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <p className="text-gray-500">{isBn ? "তারিখ" : "Date"}</p>
                    <p className="text-gray-800">
                      {isBn
                        ? formatDateBn(order.createdAt)
                        : formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      {isBn ? "মোট মূল্য" : "Total price"}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      {isBn
                        ? toBengaliNumber(taka(order.total).toString())
                        : taka(order.total)}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    {isBn ? "আইটেম" : "Items"}:{" "}
                    {isBn
                      ? toBengaliNumber(order.items.length.toString())
                      : order.items.length}{" "}
                    {isBn ? "টি পণ্য" : "Products"}
                  </p>
                </div>

                <button className="mt-3 text-[#0f5c54] text-sm hover:underline">
                  {isBn ? "বিস্তারিত দেখুন" : "See details"}{" "}
                  <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Order Details */}
        {!loading && selectedOrder && (
          <div className="space-y-6">
            <button
              onClick={handleBackToSearch}
              className="text-[#0f5c54] hover:underline mb-4 inline-flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>{" "}
              {isBn ? "নতুন অর্ডার ট্র্যাক করুন" : "Track new orders"}
            </button>

            {/* Order Info Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#0a2f2a] to-[#1e4a46] px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-white font-bold text-xl">
                    {isBn ? "অর্ডার তথ্য" : "Order information"}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      selectedOrder.orderStatus,
                    )}`}
                  >
                    {getStatusText(selectedOrder.orderStatus)}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "অর্ডার আইডি" : "Order ID"}
                    </p>
                    <p className="font-semibold text-gray-800">
                      {selectedOrder.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "তারিখ" : "Date"}
                    </p>
                    <p className="text-gray-800">
                      {isBn ? formatDateBn(selectedOrder.createdAt) : formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "নাম" : "Name"}
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "মোবাইল" : "Mobile"}
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.customerPhone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">
                      {isBn ? "ঠিকানা" : "Address"}
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.customerAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "পেমেন্ট পদ্ধতি" : "Payment methods"}
                    </p>
                    <p className="text-gray-800">
                      {selectedOrder.paymentMethod === "cash_on_delivery"
                        ? "ক্যাশ অন ডেলিভারি"
                        : "অনলাইন পেমেন্ট"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {isBn ? "পেমেন্ট স্ট্যাটাস" : "Payment status"}
                    </p>
                    <p className="text-gray-800">
                      {getPaymentStatusText(selectedOrder.paymentStatus)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {isBn ? "অর্ডারকৃত পণ্যসমূহ" : "Ordered products"}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 border-b border-gray-100 pb-4 last:border-0"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {isBn ? item.nameBn : item.name}
                      </h4>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-500">
                          {isBn ? "সাইজ" : "Size"}: {item.selectedSize}
                        </p>
                      )}
                      {item.selectedColor && (
                        <p className="text-sm text-gray-500">
                          {isBn ? "রং" : "Color"}:{" "}
                          {isBn ? item.selectedColorBn : item.selectedColor}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {isBn ? "পরিমাণ" : "Quantity"}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {isBn
                          ? toBengaliNumber(
                              taka(item.price * item.quantity).toString(),
                            )
                          : taka(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isBn
                          ? toBengaliNumber(taka(item.price).toString())
                          : taka(item.price)}{" "}
                        ×{" "}
                        {isBn
                          ? toBengaliNumber(item.quantity.toString())
                          : item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                {isBn ? "মূল্য বিবরণী" : "Price list"}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isBn ? "সাবটোটাল" : "Subtotal"}
                  </span>
                  <span className="text-gray-800">
                    {isBn
                      ? toBengaliNumber(taka(selectedOrder.subtotal).toString())
                      : taka(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isBn ? "ডেলিভারি চার্জ" : "Delivery charges"}
                  </span>
                  <span className="text-gray-800">
                    {isBn
                      ? toBengaliNumber(
                          taka(selectedOrder.deliveryCharge).toString(),
                        )
                      : taka(selectedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-gray-800">
                      {isBn ? "মোট" : "Total"}
                    </span>
                    <span className="text-[#c15c3a]">
                      {isBn
                        ? toBengaliNumber(taka(selectedOrder.total).toString())
                        : taka(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <i className="fas fa-headset text-2xl text-[#d4a373]"></i>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {isBn ? "সাহায্য প্রয়োজন?" : "Need help?"}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {isBn
                      ? "অর্ডার সংক্রান্ত যেকোনো সমস্যায় আমাদের সাথে যোগাযোগ করুন"
                      : "Contact us for any order-related issues."}
                  </p>
                  <p className="text-lg font-bold text-[#0f5c54]">
                    <i className="fas fa-phone-alt mr-2"></i>{" "}
                    {isBn ? toBengaliNumber("01741571104") : "01741571104"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isBn
                      ? "সকাল ১০টা - রাত ৯টা (শুক্রবার বন্ধ)"
                      : "10am - 9pm (Closed on Fridays)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
