import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRelatedProducts, sampleProducts } from "../../helpers/data/data";
import ProductDetail from "./ProductDetail";


const ProductDetailContainer = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API call
    const loadProduct = async () => {
      try {
        // Tìm sản phẩm theo id
        const foundProduct = sampleProducts.find((p) => p.id === id);
        setProduct(foundProduct);

        if (foundProduct) {
          // Lấy sản phẩm liên quan
          const related = getRelatedProducts(foundProduct);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
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

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
};

export default ProductDetailContainer;
