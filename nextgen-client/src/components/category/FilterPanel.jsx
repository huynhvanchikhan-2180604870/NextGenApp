import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/features/categories/categorySlice";

const priceRanges = [
  { id: "under50", label: "Dưới 50.000đ", value: [0, 50000] },
  { id: "50to100", label: "50.000đ - 100.000đ", value: [50000, 100000] },
  { id: "100to500", label: "100.000đ - 500.000đ", value: [100000, 500000] },
  { id: "500to1m", label: "500.000đ - 1.000.000đ", value: [500000, 1000000] },
  { id: "over1m", label: "Trên 1.000.000đ", value: [1000000, Infinity] },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const FilterPanel = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  const hasSelectedSubcategories = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.children.some((subCat) =>
      selectedSubCategories.includes(subCat._id)
    );
  };

  const handleCategoryChange = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    const isSelected = selectedCategories.includes(categoryId);

    let newCategories;
    let newSubCategories = [...selectedSubCategories];

    if (isSelected) {
      newCategories = selectedCategories.filter((id) => id !== categoryId);
      newSubCategories = selectedSubCategories.filter(
        (id) => !category.children.some((child) => child._id === id)
      );
    } else {
      newCategories = [...selectedCategories, categoryId];
    }

    setSelectedCategories(newCategories);
    setSelectedSubCategories(newSubCategories);
    updateFilters(newCategories, newSubCategories, selectedPriceRanges);
  };

  const handleSubCategoryChange = (subCategoryId) => {
    const newSelection = selectedSubCategories.includes(subCategoryId)
      ? selectedSubCategories.filter((id) => id !== subCategoryId)
      : [...selectedSubCategories, subCategoryId];

    setSelectedSubCategories(newSelection);
    updateFilters(selectedCategories, newSelection, selectedPriceRanges);
  };

  const handlePriceRangeSelect = (rangeId) => {
    const newSelection = selectedPriceRanges.includes(rangeId)
      ? selectedPriceRanges.filter((id) => id !== rangeId)
      : [...selectedPriceRanges, rangeId];

    setSelectedPriceRanges(newSelection);
    updateFilters(selectedCategories, selectedSubCategories, newSelection);
  };

  const handleReset = () => {
    setIsResetting(true);
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedPriceRanges([]);
    updateFilters([], [], []);

    setTimeout(() => {
      setIsResetting(false);
    }, 500);
  };

  const updateFilters = (categories, subCategories, priceRanges) => {
    onFilterChange({
      categories,
      subCategories,
      priceRanges,
    });
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium">Bộ lọc</span>
        </button>
        <button
          onClick={handleReset}
          className="text-sm text-[#516349] hover:text-[#3d4a37] transition-colors flex items-center gap-1"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: isResetting ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </motion.svg>
          <span>Đặt lại</span>
        </button>
      </div>

      <AnimatePresence>
        <motion.div
          className={`${!isOpen && "hidden lg:block"}`}
          initial={false}
          animate={{ height: isOpen ? "auto" : "auto" }}
        >
          <div className="p-5 space-y-6">
            {/* Categories Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#516349]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Danh mục
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category._id} className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange(category._id)}
                      className={`
    w-full px-4 py-3 rounded-xl text-sm transition-all duration-300
    flex items-center gap-2
    ${
      selectedCategories.includes(category._id) ||
      hasSelectedSubcategories(category._id)
        ? "bg-[#516349] text-white shadow-md shadow-[#516349]/20"
        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
    }
  `}
                    >
                      <span className="text-xl">
                        {typeof category.icon === "string" ? category.icon : ""}
                      </span>
                      <span className="font-medium">{category.name}</span>
                    </button>

                    {(selectedCategories.includes(category._id) ||
                      hasSelectedSubcategories(category._id)) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-10 space-y-1"
                      >
                        {category.children.map((subCat) => (
                          <button
                            key={subCat._id}
                            onClick={() => handleSubCategoryChange(subCat._id)}
                            className={`
    w-full px-3 py-2 rounded-lg text-sm transition-all duration-300
    flex items-center gap-2
    ${
      selectedSubCategories.includes(subCat._id)
        ? "bg-[#516349]/20 text-[#516349] font-medium"
        : "text-gray-600 hover:bg-gray-50"
    }
  `}
                          >
                            <span className="text-lg">
                              {typeof subCat.icon === "string"
                                ? subCat.icon
                                : ""}
                            </span>
                            <span>{subCat.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#516349]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Khoảng giá
              </h3>

              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-gray-50/80 transition-all duration-200 relative"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={selectedPriceRanges.includes(range.id)}
                        onChange={() => handlePriceRangeSelect(range.id)}
                      />
                      <div
                        className={`
                          w-5 h-5 rounded-md transition-all duration-200 
                          border-2 flex items-center justify-center
                          ${
                            selectedPriceRanges.includes(range.id)
                              ? "border-[#516349] bg-[#516349] shadow-[#516349]/20 shadow-sm scale-105"
                              : "border-gray-300 bg-white group-hover:border-[#516349]/70"
                          }
                        `}
                      >
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{
                            scale: selectedPriceRanges.includes(range.id)
                              ? 1
                              : 0,
                            opacity: selectedPriceRanges.includes(range.id)
                              ? 1
                              : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          className="w-3.5 h-3.5 text-white"
                          viewBox="0 0 24 24"
                        >
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.2 }}
                            d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span
                        className={`
                          text-sm transition-all duration-200
                          ${
                            selectedPriceRanges.includes(range.id)
                              ? "text-[#516349] font-medium"
                              : "text-gray-600 group-hover:text-gray-900"
                          }
                        `}
                      >
                        {range.label}
                      </span>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{
                        scale: selectedPriceRanges.includes(range.id) ? 1 : 0.8,
                        opacity: selectedPriceRanges.includes(range.id) ? 1 : 0,
                      }}
                      className="absolute right-2 text-xs text-[#516349]/70"
                    >
                      ✓
                    </motion.div>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleReset}
                className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isResetting ? 360 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </motion.svg>
                <span
                  className={`${
                    isResetting ? "text-[#516349]" : ""
                  } transition-colors`}
                >
                  Đặt lại bộ lọc
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
