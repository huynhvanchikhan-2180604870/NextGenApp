const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const authentucationRouter = require("./routers/auththentication.router");
const usersRouter = require("./routers/users.router");
const bannerRoutes = require("./routers/banners.router");
const categoriesRouter = require("./routers/categories.router");
const productsRouter = require("./routers/products.router");

const app = express();
const uploadDirs = ["banners", "products"];
uploadDirs.forEach((dir) => {
  const dirPath = path.join(__dirname, "uploads", dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.get("/", (req, res) => {
  res.json("Hello World!");
});
app.use("/api/auth", authentucationRouter);
app.use("/api/users", usersRouter);
app.use("/api/banners", bannerRoutes);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
