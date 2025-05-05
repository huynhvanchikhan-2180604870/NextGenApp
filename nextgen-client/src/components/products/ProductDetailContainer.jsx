import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../../store/features/products/productSlice";
import ProductDetail from "./ProductDetail";

const ProductDetailContainer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.products);
  useEffect(() => {
    // Giả lập API call
    dispatch(fetchProduct(id));
  }, [id]);

  if (product === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#516349]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy sản phẩm
        </h2>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-[#516349] text-white rounded-lg hover:bg-[#516349]/90 transition"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return <ProductDetail product={product} relatedProducts={product} />;
};

export default ProductDetailContainer;
