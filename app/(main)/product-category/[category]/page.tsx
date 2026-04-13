import Breadcrumb from "../../components/product/Breadcrumb";
import { ProductCard } from "../../components/ProductCard";
import { getProductsByCategory } from "@/queries/datalist";

const CategoryPage = async ({ params }) => {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  const products = await getProductsByCategory(category);

  // Validate category parameter
  if (!category || typeof category !== "string") {
    return (
      <div className="container mx-auto text-center py-12">
        <p className="text-red-500">Invalid category</p>
      </div>
    );
  }

  // Format category name for display
  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <section>
      <div className="container mx-auto w-full mb-12 px-4">
        <Breadcrumb title={formattedCategory} />

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products found in "{formattedCategory}" category.
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

export default CategoryPage;
