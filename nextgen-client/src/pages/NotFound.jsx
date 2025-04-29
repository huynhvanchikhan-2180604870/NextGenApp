import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const [isLeaving, setIsLeaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // List of valid routes in your application
  const validRoutes = [
    "/",
    "/home",
    "/products",
    "/products/:id",
    "/profile",
    "/login",
    "/register",
    // Add more routes as your application grows
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const isValidPath = validRoutes.some((route) => {
      if (route.includes(":")) {
        const routePattern = new RegExp(
          "^" + route.replace(/:\w+/g, "[^/]+") + "$"
        );
        return routePattern.test(currentPath);
      }
      return route === currentPath;
    });

    if (isValidPath) {
      setIsLeaving(true);
      setTimeout(() => {
        navigate(currentPath);
      }, 2000);
    }
  }, [location.pathname, navigate]);

  const handleNavigate = (path) => {
    setIsLeaving(true);
    setTimeout(() => {
      navigate(path);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Emoji Animation */}
          <motion.div
            className="text-8xl sm:text-9xl mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isLeaving ? "happy" : "sad"}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                {isLeaving ? "😊" : "😢"}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <h1 className="text-7xl sm:text-9xl font-bold text-[#516349]">404</h1>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mt-4 px-4"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Trang không tồn tại
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-600">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
              chuyển.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <button
              onClick={() => handleNavigate("/")}
              disabled={isLeaving}
              className={`
                inline-flex items-center gap-2 
                px-6 py-3 
                bg-[#516349] text-white 
                rounded-lg font-medium
                transition-all duration-300
                ${
                  isLeaving
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#516349]/90 hover:scale-105"
                }
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {isLeaving ? "Đang chuyển hướng..." : "Quay về trang chủ"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
