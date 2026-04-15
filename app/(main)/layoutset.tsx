"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { useApp } from "./context/AppContext";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { SidebarMobile } from "./components/SidebarMobile";

export default function LayoutSet({ children, categories, settings }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} categories={categories} />

      <main className="flex-1 ml-0 lg:ml-16 flex flex-col min-h-screen relative">
        <Topbar
          settings={settings}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          openCart={() => setDrawerOpen(true)}
          isMobileExpanded={isMobileExpanded}
          setIsMobileExpanded={setIsMobileExpanded}
        />
        <div className="flex-1 w-full py-4 px-3">{children}</div>
        <Footer settings={settings} />
      </main>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SidebarMobile isMobileExpanded={isMobileExpanded} setIsMobileExpanded={setIsMobileExpanded} categories={categories} />
      <ScrollToTop />
    </div>
  );
}
