import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Loading = ({ isSuccess }) => {
  const loadingEmojis = ["🚀", "💻", "⚡", "🎮", "📱", "🤖", "🎨", "💡"];
  const [currentEmoji, setCurrentEmoji] = useState(loadingEmojis[0]);
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setEmojiIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % loadingEmojis.length;
        setCurrentEmoji(loadingEmojis[nextIndex]);
        return nextIndex;
      });
    }, 1000); // Emoji changes every 1 second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="loading"
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="relative w-32 h-32">
              {/* Wave circles */}
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 border-4 border-[#516349] rounded-full"
                  style={{ opacity: 0.1 + index * 0.1 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1 + index * 0.1, 0.05, 0.1 + index * 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Rotating circles */}
              <motion.div
                className="absolute inset-0 border-4 border-[#516349]/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-0 border-4 border-[#516349]/50 rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Center emoji with improved animation */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [0.9, 1.1, 0.9] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    className="text-4xl"
                    key={currentEmoji}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0, rotate: 180 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    {currentEmoji}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Loading text */}
            <motion.div className="mt-8 flex items-center gap-1">
              {Array.from("Đang tải dữ liệu...").map((char, index) => (
                <motion.span
                  key={index}
                  className="text-gray-600 font-medium text-lg"
                  animate={{ y: [-2, 2, -2] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.05,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative w-32 h-32">
              {/* Success circle background */}
              <motion.div
                className="absolute inset-0 bg-[#516349] rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 12,
                  duration: 1,
                }}
              />

              {/* Success ripples */}
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 border-4 border-[#516349] rounded-full"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: 2, opacity: [0.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.4,
                    ease: "easeOut",
                    times: [0, 1],
                  }}
                />
              ))}

              {/* Checkmark */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <motion.svg className="w-16 h-16" viewBox="0 0 24 24">
                  <motion.path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 6L9 17l-5-5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                  />
                </motion.svg>
              </motion.div>
            </div>

            {/* Welcome text */}
            <motion.div className="mt-8 flex items-center gap-1">
              {Array.from("Chào mừng bạn đến với NextGen!").map(
                (char, index) => (
                  <motion.span
                    key={index}
                    className="text-gray-800 font-semibold text-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.8 + index * 0.03,
                      ease: "easeOut",
                    }}
                  >
                    {char}
                  </motion.span>
                )
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Loading;
