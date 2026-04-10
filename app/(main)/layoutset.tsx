"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { useApp } from "./context/AppContext";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";

export default function LayoutSet({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <main className="flex-1 ml-16 flex flex-col min-h-screen relative">
        <Topbar
          setIsExpanded={setIsExpanded}
          openCart={() => setDrawerOpen(true)}
        />
        <div className="flex-1 w-full py-4 px-3">
          {children}
        </div>
        <Footer />
      </main>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
