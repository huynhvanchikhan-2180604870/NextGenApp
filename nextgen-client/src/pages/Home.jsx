import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../assets/css/home.css";
import ProductList from "../components/products/ProductList";
import Carousel from "../components/widgets/ui/Carousel";
import { fetchBanners } from "../store/features/banners/bannersSlice";
import { fetchProducts } from "../store/features/products/productSlice";

const Home = () => {
  const { banners } = useSelector((state) => state.banners);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch banners
    if (!banners || banners.length === 0) {
      dispatch(fetchBanners());
    }

    if(!products || products.length === 0) {
      dispatch(fetchProducts());
    }
      // dispatch(fetchProducts());
    console.log("products: ", products);
    // Fetch products
  }, [dispatch]);
  return (
    <div className="pt-16 bg-gray-50">
      {/* Carousel Section */}
      <section className="mb-8 mt-6 rounded-2xl overflow-hidden w-full max-w-7xl mx-auto ">
        {banners && banners.length > 0 ? (
          <Carousel
            images={banners.map((banner) => ({
              // The banner.image already includes '/uploads/banners/' path
              url: `http://localhost:3000${banner.image}`,
              title: banner.title,
            }))}
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-2xl"></div>
        )}
      </section>
      {/* <Categories /> */}
      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sản phẩm mới</h2>

        {/* Products Grid - Now handles its own pagination */}
        <ProductList products={products} />
      </section>
    </div>
  );
};

export default Home;
