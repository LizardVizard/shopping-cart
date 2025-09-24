import MainPage from "./pages/MainPage.jsx";
import ShopingPage from "./pages/ShopingPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { createBrowserRouter } from "react-router";


// const router = (cart, setCart) => createBrowserRouter([
//   {
//     path: "/",
//     element: <MainPage cart={cart} setCart={setCart} />
//   },
//   {
//     path: "/shop",
//     element: <ShopingPage cart={cart} setCart={setCart} />
//   },
//   {
//     path: "/cart",
//     element: <CartPage cart={cart} setCart={setCart} />
//   },
// ])
//
// export default router
export default [
  {
    path: "/",
    element: <MainPage />
  },
  {
    path: "/shop",
    element: <ShopingPage />
  },
  {
    path: "/cart",
    element: <CartPage />
  },
];
