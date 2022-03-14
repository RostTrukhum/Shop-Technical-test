import { configureStore } from "@reduxjs/toolkit";
import changingValue from "../components/NavBar/changingValueSlice";
import addBasket from "../components/Product/ProductSlice";

const stringMiddleware = () => (next) => (action) => {
  if (typeof action === "string") {
    return next({
      type: action,
    });
  }
  return next(action);
};

const store = configureStore({
  reducer: {changingValue, addBasket},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});
export default store;
