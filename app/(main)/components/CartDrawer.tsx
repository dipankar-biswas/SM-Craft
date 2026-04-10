'use client'
import { Truck, X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { taka } from "@/utils/currency";
import { useApp } from "../context/AppContext";

export const CartDrawer = ({ open, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useApp();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition duration-300 ${open ? "opacity-100" : "opacity-0"}`} 
      />
      
      {/* Drawer */}
      <aside className={`absolute right-0 top-0 h-full w-full max-w-[380px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-5 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#095059]" />
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <span className="bg-gray-100 text-gray-600 text-sm px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* Free Shipping Banner */}
          {/* <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center mb-5">
            <Truck className="mx-auto mb-2 h-5 w-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Congratulations! Your order is eligible for FREE Delivery.
            </p>
          </div> */}

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="text-[#095059] font-medium hover:underline"
              >
                Continue Shopping →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white border border-gray-100 rounded-lg p-2 hover:shadow-md transition-shadow">
                  {/* Product Image */}
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-16 w-16 rounded-lg border border-gray-200 object-cover" 
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`} onClick={onClose} className="font-medium text-gray-800 hover:text-[#095059] transition-colors duration-200 mb-1 line-clamp-2 text-sm">
                      {item.name}
                    </Link>
                    <p className="text-[#095059] font-bold text-md">
                      {taka(item.price)}
                      <span className="text-[12px] text-gray-400 font-normal ml-1">
                        x {item.quantity}
                      </span>
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-1 border border-gray-300 inline-flex rounded">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 border-r border-gray-300 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 border-l border-gray-300 hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-gray-400 hover:text-red-500 transition-colors self-start"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed Bottom */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 bg-white sticky bottom-0">
            {/* Subtotal */}
            <div className="p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-semibold">Subtotal</span>
                <span className="text-xl font-bold text-[#095059]">
                  {taka(subtotal)}
                </span>
              </div>
              {/* <p className="text-xs text-gray-500">
                * Shipping and taxes calculated at checkout
              </p> */}
            </div>
            
            {/* Buttons */}
            <div className="p-3 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/cart" 
                  onClick={onClose} 
                  className="border-2 border-gray-800 text-gray-800 font-medium py-1 px-2 rounded-lg text-center hover:bg-[#0e6e78] hover:text-white transition-all duration-200"
                >
                  View Cart
                </Link>
                <Link 
                  href="/checkout" 
                  onClick={onClose} 
                  className="bg-[#095059] text-white font-medium py-1 px-2 rounded-lg text-center hover:bg-[#0e6e78] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Checkout
                </Link>
              </div>
              
              {/* Secure Checkout Badge */}
              {/* <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure Checkout</span>
                <span>•</span>
                <span>SSL Encrypted</span>
              </div> */}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};