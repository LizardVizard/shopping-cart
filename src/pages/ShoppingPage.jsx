import { useContext } from "react"
import { CartContext } from "../CartContext"
import ShoppingItem from "../components/ShoppingItem"

import style from "./ShoppingPage.module.css"

import placeholderImage from "/vite.svg"

function ShoppingPage({ catalogue, cart, setCart }) {

  const handleItemClick = (targetItem, quantity) => {
    const cartItem = cart.find(item => item.id === targetItem.id)

    if (cartItem) {
      setCart(cart.map(item =>
        item.id === cartItem.id ?
          { ...item, quantity: item.quantity + quantity } :
          item
      ))
    } else {
      setCart([...cart, { ...targetItem, quantity: quantity }])
    }
  }

  return (
    <>
      <h1>Store</h1>
      <div className={style.container}>
        {catalogue && catalogue.map((item) =>
          <ShoppingItem
            key={item.id}
            name={item.name}
            image={item.image || placeholderImage}
            handleClick={(quantity) => handleItemClick(item, quantity)}
          />)}
      </div>
    </>
  )
}

export default ShoppingPage
