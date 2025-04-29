import { SnackbarProvider } from "notistack";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./context/ThemeContext";
import ClientLayout from "./layouts/ClientLayout/ClientLayout";
import { fetchProfile } from "./store/features/auth/authSlice";
import { fetchProducts } from "./store/features/products/productSlice";
function App() {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const { banners } = useSelector((state) => state.banners);
  useEffect(() => {
    const checkAuth = async () => {
      if (!user && !loading && isAuthenticated) {
        await dispatch(fetchProfile());
      }
    };

    checkAuth();
  }, [dispatch, user, loading]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MainApp />
    </SnackbarProvider>
  );
}

function MainApp() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/*" element={<ClientLayout />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
