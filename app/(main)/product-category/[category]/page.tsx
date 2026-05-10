import { getProductsByCategory } from "@/queries/products";
import { PageSet } from "./PageSet";
import { getCategoryBySlug } from "@/queries/categories";

const CategoryPage = async ({ params }) => {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.category;
  const category = await getCategoryBySlug(categorySlug);
  const products = await getProductsByCategory(categorySlug);
  

  return (
    <PageSet category={category} products={products} />
  );
};

export default CategoryPage;
