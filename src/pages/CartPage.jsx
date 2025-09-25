import { useEffect, useState } from "react"
import CartItem from "../components/CartItem"
import style from "./CartPage.module.css"

const CartPage = ({ cart, setCart }) => {
  const [totalCost, setTotalCost] = useState(cart.reduce((total, item) => total + Number(item.price || 0), 0))


  function handleItemQuantityChange(itemId, quantity) {
    if (quantity <= 0) {
      handleDeleteItem(itemId)
      return
    }
    setCart(cart.map((item) =>
      item.id === itemId ?
        { ...item, quantity: quantity } :
        item))
    // setTotalCost(cart.reduce((total, item) => total + Number(item.price || 0), 0))
  }

  function handleDeleteItem(itemId) {
    setCart(cart.filter((item) => item.id !== itemId))
  }

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
              itemQuantityChange={(quantity) => handleItemQuantityChange(item.id, quantity)}
              itemDelete={() => handleDeleteItem(item.id)}
            />) :
          <h2>No items in cart</h2>}
      </div>

      {<h2 className={style.total}>Total: ${totalCost.toFixed(2)}</h2>}
    </>
  )
}

export default CartPage
