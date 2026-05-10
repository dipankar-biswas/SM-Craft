'use client'
import { useApp } from "../../context/AppContext";
import { ProductCard } from "../ProductCard";


export default function RelatedProducts({ products }) {
  const { isBn } = useApp();
  
  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{isBn ? 'সম্পর্কিত পণ্য' : 'Related products'}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
