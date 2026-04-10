import { getProducts } from "@/queries/datalist";
import Breadcrumb from "../components/product/Breadcrumb";
import { ProductCard } from "../components/ProductCard";

const TermsPage = async () => {
  const products = await getProducts();

  return (
    <section className="">
      <div className="container mx-auto w-full mb-12">
        <Breadcrumb title={"All Products"} />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TermsPage;
