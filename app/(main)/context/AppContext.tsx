"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define types for product
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  hoverImage?: string;
  isSale?: boolean;
  isNew?: boolean;
  isOffer?: boolean;
  discount?: number;
  quantity?: number;
  countdown?: { days: number; hours: number; mins: number; secs: number };
}

// Define cart item type (extends product with quantity)
interface CartItem extends Product {
  quantity: number;
}

// Define context type
interface AppContextType {
  // Search
  search: string;
  setSearch: (value: string) => void;
  
  // Wishlist
  wishlist: Product[];
  setWishlist: (value: Product[]) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (value: boolean) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  
  // Compare
  compareList: Product[];
  setCompareList: (value: Product[]) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (value: boolean) => void;
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: number) => void;
  isInCompare: (id: number) => boolean;
  clearAllCompare: () => void;
  
  // Cart
  cart: CartItem[];
  setCart: (value: CartItem[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  cartTotal: number;
  cartCount: number;
  
  // Quick View
  activeProduct: Product | null;
  setActiveProduct: (value: Product | null) => void;
  isQuickViewOpen: boolean;
  setIsQuickViewOpen: (value: boolean) => void;
}

// Create context with default value
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  const addToCart = (product: Product) => {    
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const qtyNum = product.quantity ? Number(product.quantity) : 1;
      if (isNaN(qtyNum) || qtyNum <= 0) {
        return prev; // Don't add if quantity is invalid
      }
      return [...prev, { ...product, quantity: qtyNum }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
    setIsWishlistOpen(true);
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const isInCompare = (id: number) => compareList.some((item) => item.id === id);

  const addToCompare = (product: Product) => {
    if (!isInCompare(product.id) && compareList.length < 4) {
      setCompareList([...compareList, product]);
    }
    setIsCompareOpen(true);
  };

  const removeFromCompare = (id: number) => {
    setCompareList(compareList.filter((item) => item.id !== id));
  };

  const clearAllCompare = () => {
    setCompareList([]);
  };

  return (
    <AppContext.Provider
      value={{
        search,
        setSearch,
        
        wishlist,
        setWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,

        compareList,
        setCompareList,
        isCompareOpen,
        setIsCompareOpen,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearAllCompare,

        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,

        activeProduct,
        setActiveProduct,
        isQuickViewOpen,
        setIsQuickViewOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};