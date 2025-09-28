import { useEffect, useState } from "react"
import CartItem from "../components/CartItem"
import style from "./CartPage.module.css"

const CartPage = ({ cart, handleItemChangeQuantity, handleItemDelete }) => {
  const [totalCost, setTotalCost] = useState(cart.reduce((total, item) => total + Number(item.price || 0), 0))

  useEffect(() => {
    setTotalCost(cart.reduce((total, item) =>
      total + Number(item.price || 0) * (item.quantity || 0)
      , 0)
    )
  }, [cart])

  return (
    <>
      <h1>Cart</h1>

      <div className={style.cartItemList}>
        {cart.length ?
          cart.map((item) =>
            <CartItem
              key={item.id}
              name={item.name}
              image={item.image}
              quantity={item.quantity}
              itemChangeQuantity={(quantity) => handleItemChangeQuantity(item.id, quantity)}
              itemDelete={() => handleItemDelete(item.id)}
            />) :
          <h2>No items in cart</h2>}
      </div>

      {<h2 className={style.total}>Total: ${totalCost.toFixed(2)}</h2>}
    </>
  )
}

export default CartPage
