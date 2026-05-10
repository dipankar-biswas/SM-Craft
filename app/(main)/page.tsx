import { getCategoriesWiseProducts } from "@/queries/products";
import { Banner } from "./components/Banner";
import { HomeProduct } from "./components/HomeProduct";

export const Home = async() => {
  const categorywiseproducts = await getCategoriesWiseProducts();
  

  return (
    <>
      <Banner />

      <HomeProduct categorywiseproducts={categorywiseproducts} />
    </>
  );
}

export default Home;
