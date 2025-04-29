import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProductDetailContainer from "../components/products/ProductDetailContainer";
import CodeVerification from "../components/widgets/ui/CodeVerification";
import BannerUpload from "../pages/BannerUpload";
import Deposit from "../pages/Deposit";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProductManager from "../pages/ProductManager";
import RegisterForm from "../pages/Register";

const Routers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Skip loading for NotFound page
    if (location.pathname !== "/home" && location.pathname !== "/") {
      setIsLoading(false);
      return;
    }

    // Loading animation for main routes
    const loadingTimer = setTimeout(() => {
      setIsSuccess(true);

      const successTimer = setTimeout(() => {
        setIsLoading(false);
      }, 3500);

      return () => clearTimeout(successTimer);
    }, 4000);

    return () => clearTimeout(loadingTimer);
  }, [location.pathname]);

  return (
    <>
      {/* {isLoading && <Loading isSuccess={isSuccess} />} */}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetailContainer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verification" element={<CodeVerification />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/banners/upload" element={<BannerUpload />} />
        <Route path="/products" element={<ProductManager />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Routers;
