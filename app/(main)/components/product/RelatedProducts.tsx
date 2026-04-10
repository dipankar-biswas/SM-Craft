'use client'
import { ProductCard } from "../ProductCard";


export default function RelatedProducts({ products }) {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Related products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
