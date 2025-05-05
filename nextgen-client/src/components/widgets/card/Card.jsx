import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Card = ({ id, product, image, name, price, technologies, downloads }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [hoveredTech, setHoveredTech] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const handleBuyClick = (e) => {
    e.preventDefault();
    navigate(`/product/${id}`);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    // Thêm logic mua hàng tại đây
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleTechClick = (e, tech) => {
    e.preventDefault();
    console.log(`Clicked technology: ${tech}`);
    // Thêm logic lọc theo công nghệ tại đây
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className={`
        block bg-white rounded-xl shadow-md hover:shadow-xl p-4 cursor-pointer
        transition-all duration-300
        h-auto sm:h-[440px]       /* tự động trên mobile, cố định cao từ sm trở lên */
        relative group overflow-hidden
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full justify-between">
        {/* === PHẦN TRÊN: Favorite Button + Ảnh + Tiêu đề + Công nghệ */}
        <div>
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all duration-300 transform hover:scale-110"
            title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isFavorite ? "#516349" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={isFavorite ? "#516349" : "currentColor"}
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>

          {/* Preview Image */}
          <div className="aspect-[4/3] w-full bg-gray-100 mb-4 rounded-lg overflow-hidden">
            <img
              src={`http://localhost:3000${product.coverImage}`}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              draggable="false"
            />
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 text-lg line-clamp-2 min-h-[56px] group-hover:text-[#516349] transition-colors duration-300">
            {name}
          </h3>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 min-h-[28px] mt-2">
            {technologies?.map((tech, index) => (
              <span
                key={index}
                className={`
                  px-2.5 py-1 text-xs rounded-full cursor-pointer
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
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* === PHẦN CUỐI: Giá + lượt tải + Nút Mua ngay */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="text-[#516349] font-bold text-lg group-hover:scale-105 transform transition-transform duration-300">
              {formatCurrency(price)}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {downloads} lượt tải
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{product.views}</span>
            </div>
          </div>

          <button
            onClick={handleBuyClick}
            className={`
              relative overflow-hidden
              bg-[#516349] text-white px-4 py-2 rounded-lg text-sm
              transition-all duration-300 ease-out
              transform hover:-translate-y-0.5
              hover:shadow-lg hover:shadow-[#516349]/20
              active:translate-y-0 active:shadow-md
              ${isHovered ? "animate-pulse bg-[#3d4a37]" : ""}
              ${isPressed ? "scale-95" : ""}
              before:content-['']
              before:absolute before:inset-0
              before:bg-white/20 before:transform before:-skew-x-45 before:-translate-x-full
              hover:before:translate-x-full before:transition-transform before:duration-700
            `}
          >
            <span className="relative inline-flex items-center gap-1.5">
              Mua ngay
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition-transform duration-300 ${
                  isHovered ? "translate-x-0.5" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;
