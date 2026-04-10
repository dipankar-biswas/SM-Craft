"use client";
import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree, 
  Award, 
  Ruler, 
  Globe, 
  Menu,
  X,
  Store,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  initialProducts, 
  initialCategories, 
  initialBrands, 
  initialSizes, 
  initialColors, 
  initialOrders,
  Product,
  Category,
  Brand,
  Size,
  Color
} from './data/initialData';

import { DashboardHome } from './components/DashboardHome';
import { ProductsView } from './components/ProductsView';
import { CategoriesView } from './components/CategoriesView';
import { BrandsView } from './components/BrandsView';
import { SizesColorsView } from './components/SizesColorsView';

type Tab = 'dashboard' | 'products' | 'categories' | 'brands' | 'sizes-colors';

export default function LayoutSet() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for CRUD actions
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [sizes, setSizes] = useState<Size[]>(initialSizes);
  const [colors, setColors] = useState<Color[]>(initialColors);

  // Handlers
  const addProduct = (newProduct: Omit<Product, 'id' | 'sales'>) => {
    const id = Date.now().toString();
    setProducts([{ ...newProduct, id, sales: 0 }, ...products]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const addCategory = (name: string, nameBn: string) => {
    const id = Date.now().toString();
    setCategories([...categories, { id, name, nameBn, itemCount: 0 }]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const addBrand = (name: string, country: string) => {
    const id = Date.now().toString();
    setBrands([...brands, { id, name, country }]);
  };

  const deleteBrand = (id: string) => {
    setBrands(brands.filter((b) => b.id !== id));
  };

  const addSize = (name: string) => {
    const id = Date.now().toString();
    setSizes([...sizes, { id, name }]);
  };

  const deleteSize = (id: string) => {
    setSizes(sizes.filter((s) => s.id !== id));
  };

  const addColor = (name: string, hex: string) => {
    const id = Date.now().toString();
    setColors([...colors, { id, name, hex }]);
  };

  const deleteColor = (id: string) => {
    setColors(colors.filter((c) => c.id !== id));
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(products.map((p) => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(categories.map((c) => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const updateBrand = (id: string, updatedFields: Partial<Brand>) => {
    setBrands(brands.map((b) => b.id === id ? { ...b, ...updatedFields } : b));
  };

  const updateSize = (id: string, updatedFields: Partial<Size>) => {
    setSizes(sizes.map((s) => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const updateColor = (id: string, updatedFields: Partial<Color>) => {
    setColors(colors.map((c) => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const isBn = language === 'bn';

  const menuItems = [
    { id: 'dashboard', name: isBn ? 'ড্যাশবোর্ড' : 'Dashboard', icon: LayoutDashboard },
    { id: 'products', name: isBn ? 'পণ্য (Products)' : 'Products', icon: ShoppingBag },
    { id: 'categories', name: isBn ? 'ক্যাটাগরি' : 'Categories', icon: FolderTree },
    { id: 'brands', name: isBn ? 'ব্র্যান্ড' : 'Brands', icon: Award },
    { id: 'sizes-colors', name: isBn ? 'সাইজ ও রঙ' : 'Sizes & Colors', icon: Ruler },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg text-white">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">BD Store Admin</h2>
              <span className="text-[10px] text-slate-400">Next.js Inspired</span>
            </div>
          </div>

          <button 
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge / Context */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-slate-400">Signed in as</p>
              <p className="text-sm font-semibold truncate">Store Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Language Selector */}
        <div className="p-4 border-t border-white/10 bg-slate-950/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Language / ভাষা</span>
            </div>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
              {language.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
            <button
              onClick={() => setLanguage('en')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                language === 'en' ? 'bg-white text-slate-900 shadow' : 'text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                language === 'bn' ? 'bg-white text-slate-900 shadow' : 'text-slate-400'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600 border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-800">
                {isBn ? 'ই-কমার্স ড্যাশবোর্ড' : 'E-Commerce Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" />
              {isBn ? 'নেক্সট.জেএস এবং টেলউইন্ড ভিত্তিক' : 'Tailwind + Next.js Stack'}
            </span>

            {/* Visit Store Button Mock */}
            <a 
              href="#"
              className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-blue-200"
            >
              <span>{isBn ? 'স্টোর দেখুন' : 'Visit Store'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Dashboard Content area */}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardHome 
              products={products}
              orders={initialOrders}
              language={language}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView 
              products={products}
              categories={categories}
              brands={brands}
              sizes={sizes}
              colors={colors}
              onAddProduct={addProduct}
              onDeleteProduct={deleteProduct}
              onUpdateProduct={updateProduct}
              language={language}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView 
              categories={categories}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
              onUpdateCategory={updateCategory}
              language={language}
            />
          )}

          {activeTab === 'brands' && (
            <BrandsView 
              brands={brands}
              onAddBrand={addBrand}
              onDeleteBrand={deleteBrand}
              onUpdateBrand={updateBrand}
              language={language}
            />
          )}

          {activeTab === 'sizes-colors' && (
            <SizesColorsView 
              sizes={sizes}
              colors={colors}
              onAddSize={addSize}
              onDeleteSize={deleteSize}
              onUpdateSize={updateSize}
              onAddColor={addColor}
              onDeleteColor={deleteColor}
              onUpdateColor={updateColor}
              language={language}
            />
          )}
        </main>
      </div>
    </div>
  );
}
