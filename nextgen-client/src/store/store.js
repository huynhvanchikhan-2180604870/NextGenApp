import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import bannerReducer from "./features/banners/bannersSlice";
import categoryReducer from "./features/categories/categorySlice";
import productReducer from "./features/products/productSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    categories: categoryReducer,
    products: productReducer,
    // Add other reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/signup/fulfilled", "auth/signin/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["auth.user"],
      },
    }),
  devTools: "dev" !== "production",
});

export default store;
