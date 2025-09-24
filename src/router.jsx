import MainPage from "./pages/MainPage.jsx";
import ShoppingPage from "./pages/ShoppingPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import NavBar from "./components/NavBar.jsx";
import { Outlet, Link, createBrowserRouter } from "react-router";

import style from "./pages/Layout.module.css"

const Layout = ({ cart }) => {
  const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 0), 0)

  return (
    <>
      <div className={style.navBar}>
        <Link className={style.link} to="/">Main page</Link>
        <Link className={style.link} to="/shop">Store page</Link>
        <div className={style.navBarItem}>
          <Link className={style.link} to="/cart">Cart </Link>
          {totalQuantity > 0 &&
            <div className={style.itemCount}>
              {(totalQuantity < 100 ? totalQuantity : "99+")}
            </div>}
        </div>
      </div>
      <div className={style.content}>
        <Outlet />
      </div>
    </>
  )
}

const createRouter = (catalogue, cart, setCart) => createBrowserRouter([
  // {
  //   path: "/",
  //   element: <MainPage cart={cart} />
  // },
  // {
  //   path: "/shop",
  //   element: <ShopingPage catalogue={catalogue} cart={cart} setCart={setCart} />
  // },
  // {
  //   path: "/cart",
  //   element: <CartPage cart={cart} setCart={setCart} />
  // },
  {
    path: "/",
    element: <Layout cart={cart} />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "shop", element: <ShoppingPage catalogue={catalogue} cart={cart} setCart={setCart} /> },
      { path: "cart", element: <CartPage cart={cart} setCart={setCart} /> }
    ]
  }
])

export default createRouter
