
import Breadcrumb from "../../components/product/Breadcrumb";
import ProductDetail from "../../components/product/ProductDetail";
import RelatedProducts from "../../components/product/RelatedProducts";
import { getProductDetails, getProductsByCategory } from "@/queries/products";

const ProductDetailsPage = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await getProductDetails(id);
  
  const products = await getProductsByCategory(product.category);
  products.splice(products.findIndex(p => p.id == product.id), 1); // Remove current product from related products

  return (
    <div className="container mx-auto w-full pb-12">
      <div className="flex gap-5">
        {/* Main Area */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <Breadcrumb title={product.name} />

          {/* Product Detail Section */}
          <div className="bg-white border border-gray-200 rounded p-5">
            <ProductDetail product={product} />
          </div>

          {/* Related Products */}
          <RelatedProducts products={products} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
