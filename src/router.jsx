import MainPage from "./pages/MainPage.jsx";
import ShoppingPage from "./pages/ShoppingPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import NavBar from "./components/NavBar.jsx";

import Layout from "./components/Layout.jsx";

const createRouter = ({
  catalogue,
  cart,
  handleItemQuantityChange,
  handleItemDelete,
  handleItemAddOrModify
}) => createBrowserRouter([
  {
    path: "/",
    element: <Layout cart={cart} />,
    children: [
      { index: true, element: <MainPage /> },
      {
        path: "shop", element: <ShoppingPage
          catalogue={catalogue}
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
])

export default createRouter
