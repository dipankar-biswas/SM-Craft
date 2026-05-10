"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
  // Add these new properties
  selectedColor?: string;
  selectedSize?: string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
  description?: string;
  nameBn?: string; // Add Bengali name support
}

// Define cart item type (extends product with quantity)
interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

// Define context type
interface AppContextType {
  // Language
  language: "en" | "bn";
  setLanguage: (value: "en" | "bn") => void;
  isBn: boolean;
  changeLanguage: (value: string) => void;

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
  clearCart: () => void; // Add clearCart function
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
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const isBn = language === "bn";
  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  const addToCart = (product: Product) => {
    console.log(product);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let newCart;

      if (existing) {
        newCart = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        const qtyNum = product.quantity ? Number(product.quantity) : 1;
        if (isNaN(qtyNum) || qtyNum <= 0) {
          return prev; // Don't add if quantity is invalid
        }
        newCart = [...prev, { ...product, quantity: qtyNum }];
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) => {
        const newCart = prev.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        );
        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

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
    0,
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const isInCompare = (id: number) =>
    compareList.some((item) => item.id === id);

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
        language,
        setLanguage,
        isBn,
        changeLanguage,

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
        clearCart, // Add clearCart to the context value
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
