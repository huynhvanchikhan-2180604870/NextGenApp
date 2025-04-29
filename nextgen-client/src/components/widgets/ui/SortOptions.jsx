import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

const sortOptions = [
  { id: "newest", label: "Mới nhất", icon: "🕒" },
  { id: "priceAsc", label: "Giá thấp đến cao", icon: "↑" },
  { id: "priceDesc", label: "Giá cao đến thấp", icon: "↓" },
  { id: "popular", label: "Phổ biến nhất", icon: "🔥" },
];

const SortOptions = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);

  const handleSort = (option) => {
    // Nếu click vào option đang được chọn, hủy chọn
    if (selectedSort?.id === option.id) {
      setSelectedSort(null);
      onSortChange(null);
    } else {
      setSelectedSort(option);
      onSortChange(option.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
        <span className="text-sm text-[#516349] font-medium">
          {selectedSort?.label || "Mặc định"}
        </span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20"
          >
            {sortOptions.map((option) => (
              <button
                key={option.id}
                className={`
                  w-full px-4 py-2 text-left text-sm
                  hover:bg-gray-50 flex items-center gap-2
                  transition-colors duration-200
                  ${
                    selectedSort?.id === option.id
                      ? "text-[#516349] font-medium bg-[#516349]/5"
                      : "text-gray-700"
                  }
                `}
                onClick={() => handleSort(option)}
              >
                <span>{option.icon}</span>
                {option.label}
                {selectedSort?.id === option.id && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortOptions;
