import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../redux/slices/productsSlice";
import userReducer from "../redux/slices/userSlice";
import bundlesReducer from "../redux/slices/bundlesSlice";
import cartReducer from "../redux/slices/cartSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
    bundles: bundlesReducer,
    cart: cartReducer,
  },
});
