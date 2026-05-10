"use client";
import Breadcrumb from "../../components/product/Breadcrumb";
import { ProductCard } from "../../components/ProductCard";
import { useApp } from "../../context/AppContext";

export const PageSet = ({ category, products }) => {
  const { isBn } = useApp();

  // Validate category parameter
  if (!category) {
    return (
      <div className="container mx-auto text-center py-12">
        <p className="text-red-500">Invalid category</p>
      </div>
    );
  }

  return (
    <section>
      <div className="container mx-auto w-full mb-12 px-4">
        <Breadcrumb titleBn={category.nameBn} title={category.name} />

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {`${isBn ? 'কোন পণ্য খুঁজে পাওয়া যায়নি' : 'No products found in'} ${isBn ? category.nameBn : category.name} ${
                isBn ? "বিভাগ" : "category"
              }.`}
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Showing {products.length} product
              {products.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products.length > 10 && (
              <div className="text-center mt-8">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
