import { createBrowserRouter, createMemoryRouter } from "react-router";

import MainPage from "./pages/MainPage.jsx";
import ShoppingPage from "./pages/ShoppingPage.jsx";
import CartPage from "./pages/CartPage.jsx";

import Layout from "./components/Layout.jsx";

const createRouter = ({
  cart,
  handleItemQuantityChange,
  handleItemDelete,
  handleItemAddOrModify,
  testing
}) => {
  const routes = [
    {
      path: "/",
      element: <Layout cart={cart} />,
      children: [
        { index: true, element: <MainPage /> },
        {
          path: "shop", element: <ShoppingPage
            handleItemAddOrModify={handleItemAddOrModify}
          />
        },
        {
          path: "cart", element: <CartPage
            cart={cart}
            handleItemChangeQuantity={handleItemQuantityChange}
            handleItemDelete={handleItemDelete} />
        }
      ]
    }
  ]
  if (testing) {
    return createMemoryRouter(routes)
  } else {
    return createBrowserRouter(routes)
  }
}

export default createRouter
