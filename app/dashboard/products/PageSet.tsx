// PageSet.tsx
"use client";
import React, { useState } from "react";
import { Product, Category, Brand, Size, Color } from "../data/initialData";
import AddList from "./components/AddForm";
import TableList from "./components/TableList";
import EditModal from "./components/EditModal";

interface PageSetProps {
  productsResponse: Product[];
  categoriesResponse: Category[];
  brandsResponse: Brand[];
  sizesResponse: Size[];
  colorsResponse: Color[];
}

export const PageSet: React.FC<PageSetProps> = ({ 
  productsResponse, 
  categoriesResponse, 
  brandsResponse, 
  sizesResponse, 
  colorsResponse 
}) => {
  const [products, setProducts] = useState<Product[]>(productsResponse);
  const [categories] = useState<Category[]>(categoriesResponse);
  const [brands] = useState<Brand[]>(brandsResponse);
  const [sizes] = useState<Size[]>(sizesResponse);
  const [colors] = useState<Color[]>(colorsResponse);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const onUpdateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(products.map((p) => 
      (p._id === id || p.id === id) ? { ...p, ...updatedFields } : p
    ));
  };

  return (
    <div className="space-y-8">
      <AddList
        categories={categories}
        brands={brands}
        sizes={sizes}
        colors={colors}
        products={products}
        setProducts={setProducts}
      />
      <TableList
        products={products}
        setProducts={setProducts}
        onEditProduct={setEditingProduct}
      />
      {editingProduct && (
        <EditModal
          product={editingProduct}
          categories={categories}
          brands={brands}
          sizes={sizes}
          colors={colors}
          onUpdate={onUpdateProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};