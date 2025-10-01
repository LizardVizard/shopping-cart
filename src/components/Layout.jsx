import { Outlet, Link, createBrowserRouter } from "react-router";

import style from "./Layout.module.css"

const Layout = ({ cart = [] }) => {
  const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 0), 0)

  return (
    <>
      <div className={style.navBar}>
        <Link className={style.link} to="/">Main page</Link>
        <Link className={style.link} to="/shop">Store page</Link>
        <div className={style.navBarItem}>
          <Link className={style.link} to="/cart">Cart</Link>
          {totalQuantity > 0 &&
            <div className={style.itemCount} data-testid="quantityCounter">
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

export default Layout
