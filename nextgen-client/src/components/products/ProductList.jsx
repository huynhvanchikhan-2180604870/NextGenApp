import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import FilterPanel from "../category/FilterPanel";
import Card from "../widgets/card/Card";
import SortOptions from "../widgets/ui/SortOptions";

const ProductList = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState(9); // Changed from 16 to 9
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    subCategories: [],
    priceRanges: [],
  });

  // Handle responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setProductsPerPage(mobile ? 4 : 9); // Changed from 16 to 9 for desktop
      setCurrentPage(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Handle filter changes with multiple selections
  const handleFilterChange = ({ categories, subCategories, priceRanges }) => {
    setIsLoading(true);
    setActiveFilters({ categories, subCategories, priceRanges });

    setTimeout(() => {
      let filtered = [...products];

      // Apply category filters (OR logic within categories)
      if (categories && categories.length > 0) {
        filtered = filtered.filter((product) =>
          categories.some((cat) => product.category === cat)
        );
      }

      // Apply subcategory filters (OR logic within subcategories)
      if (subCategories && subCategories.length > 0) {
        filtered = filtered.filter((product) =>
          subCategories.some((subCat) => product.subCategory === subCat)
        );
      }

      // Apply price range filters (OR logic within price ranges)
      if (priceRanges && priceRanges.length > 0) {
        filtered = filtered.filter((product) => {
          const price = parseFloat(product.price);
          return priceRanges.some((rangeId) => {
            switch (rangeId) {
              case "under50":
                return price < 50000;
              case "50to100":
                return price >= 50000 && price < 100000;
              case "100to500":
                return price >= 100000 && price < 500000;
              case "500to1m":
                return price >= 500000 && price < 1000000;
              case "over1m":
                return price >= 1000000;
              default:
                return true;
            }
          });
        });
      }

      setFilteredProducts(filtered);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  // Handle sorting
  const handleSortChange = (sortType) => {
    setIsLoading(true);

    setTimeout(() => {
      let sorted = [...filteredProducts];

      switch (sortType) {
        case "priceAsc":
          sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "priceDesc":
          sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "popular":
          sorted.sort((a, b) => b.downloads - a.downloads);
          break;
        case "views":
          sorted.sort((a, b) => b.views - a.views);
          break;
        case "newest":
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }

      setFilteredProducts(sorted);
      setIsLoading(false);
    }, 500);
  };

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Enhanced No Results Component with active filters info
  const NoResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-6xl mb-4"
      >
        😢
      </motion.div>
      <motion.h3
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-xl font-medium text-gray-700 mb-2 text-center"
      >
        Không tìm thấy sản phẩm phù hợp
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 text-center"
      >
        Vui lòng thử lại với các tiêu chí lọc khác
      </motion.p>
      {(activeFilters.categories.length > 0 ||
        activeFilters.subCategories.length > 0 ||
        activeFilters.priceRanges.length > 0) && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() =>
            handleFilterChange({
              categories: [],
              subCategories: [],
              priceRanges: [],
            })
          }
          className="mt-4 px-4 py-2 bg-[#516349] text-white rounded-lg text-sm hover:bg-[#3d4a37] transition-colors"
        >
          Xóa tất cả bộ lọc
        </motion.button>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Filters Column */}
        <div className="space-y-6">
          <FilterPanel
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>

        {/* Products Column */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {filteredProducts.length} sản phẩm được tìm thấy
            </div>
            <SortOptions onSortChange={handleSortChange} />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#516349] border-t-transparent" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <NoResults />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentProducts.map((product) => (
                  <Card
                    key={product._id}
                    {...product}
                    product={product}
                    isNew={
                      Date.now() - new Date(product.createdAt) <
                      7 * 24 * 60 * 60 * 1000
                    }
                    image={`http://localhost:3000${product.image}`}
                    isHot={product.downloads > 400}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Trước
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        currentPage === index + 1
                          ? "bg-[#516349] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Tiếp
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
