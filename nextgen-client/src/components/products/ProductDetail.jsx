import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaAngleRight,
  FaCoins,
  FaDownload,
  FaHeart,
  FaInfoCircle,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaTools,
} from "react-icons/fa";
import Card from "../widgets/card/Card";
import Carousel from "../widgets/ui/Carousel";

const ProductDetail = ({ product, relatedProducts }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [hoveredTech, setHoveredTech] = useState(null);

  const handlePurchase = () => {
    // Handle purchase logic
    setPurchased(true);
  };

  const handleDownload = () => {
    // Handle download logic
  };

  const handleTechClick = (e, tech) => {
    e.stopPropagation();
    // Handle technology click - maybe filter related products or navigate to tech category
    console.log(`Technology clicked: ${tech}`);
  };

  const tabs = [
    { id: "description", label: "Mô tả", icon: <FaInfoCircle /> },
    { id: "installation", label: "Hướng dẫn cài đặt", icon: <FaTools /> },
    { id: "reviews", label: "Đánh giá", icon: <FaStar /> },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-[100px] px-4 py-8 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images & Video */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-4"
          >
            <Carousel
              images={product.images.map((banner) => ({
                // The banner.image already includes '/uploads/banners/' path
                url: `http://localhost:3000${banner}`,
                title: banner.title,
              }))}
            />
            {/* <Carousel images={product.images} /> */}
          </motion.div>

          {product.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-4"
            >
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={product.videoUrl}
                  title="Video giới thiệu sản phẩm"
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Product Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">
                {product.name}
              </h1>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                {isLiked ? (
                  <FaHeart className="text-[#516349] text-2xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-2xl" />
                )}
              </button>
            </div>

            {/* Technology Tags with Animation */}
            <div className="flex flex-wrap gap-2 mt-3">
              {product.technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  className={`
                    px-3 py-1 text-sm rounded-full cursor-pointer
                    transition-all duration-300 transform
                    ${
                      hoveredTech === tech
                        ? "bg-[#516349] text-white scale-110 shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-[#516349]/10 hover:text-[#516349]"
                    }
                  `}
                  onMouseEnter={() => setHoveredTech(tech)}
                  onMouseLeave={() => setHoveredTech(null)}
                  onClick={(e) => handleTechClick(e, tech)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>

            <p className="mt-4 text-gray-600">{product.shortDescription}</p>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <FaDownload className="text-gray-400" />
                <span>{product.downloads} lượt tải</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCoins className="text-yellow-500" />
                <span className="text-2xl font-bold text-[#516349]">
                  {product.price.toLocaleString()}đ
                </span>
              </div>
            </div>

            {/* Purchase/Download Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={purchased ? handleDownload : handlePurchase}
              className="w-full mt-6 py-3 px-6 bg-[#516349] text-white rounded-lg flex items-center justify-center gap-2 group hover:bg-[#516349]/90 transition"
            >
              {purchased ? (
                <>
                  <FaDownload className="text-xl group-hover:scale-110 transition" />
                  <span>Tải xuống ngay</span>
                </>
              ) : (
                <>
                  <FaShoppingCart className="text-xl group-hover:scale-110 transition" />
                  <span>Mua ngay</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? "text-[#516349] border-b-2 border-[#516349]"
                      : "text-gray-500 hover:text-[#516349]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 ">
              {activeTab === "description" && (
                <div
                  className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-ul:text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {activeTab === "installation" && (
                <div
                  className=" prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-pre:bg-gray-50 prose-pre:p-4 prose-pre:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: product.installation }}
                />
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b pb-6 last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium">{review.name}</h4>
                          <div className="flex items-center gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      {relatedProducts?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Sản phẩm tương tự
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-gray-500">
                <span>•</span>
                <span className="text-sm">
                  Dựa trên {product.category.name} và{" "}
                  {product.technologies.join(", ")}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-[#516349] hover:text-[#516349]/80 font-medium"
            >
              Xem tất cả
              <FaAngleRight className="text-lg" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                {...relatedProduct}
                product={relatedProduct}
                isNew={
                  Date.now() - new Date(relatedProduct.createdAt) <
                  7 * 24 * 60 * 60 * 1000
                }
                isHot={relatedProduct.downloads > 400}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default ProductDetail;
