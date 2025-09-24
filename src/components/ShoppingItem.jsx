import { useState } from "react"

import style from "./ShoppingItem.module.css"

import reactLogo from "../assets/react.svg"

function ShopingItem({ name, image, quantity, handleClick }) {
  // const [quantity, setQuantity] = useState(itemCount)
  // TODO:
  // controlled input for quantity

  // const handleClick = () => {
  //   console.log(`Buying ${quantity} ${name}`)
  // }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = Number(e.target.quantity.value)
    if (amount > 0) {
      handleClick(amount)

    }
  }

  return (
    <>
      <div className={style.card}>
        <div className={style.description}>
          <p className={style.title}>{name}</p>
          <img src={image} alt="Item icon" />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            name="quantity"
            type="number"
            min="1"
            max="999"
            step="1"
            placeholder="quantity"
            defaultValue="1" />
          <button className={style.button}>Buy</button>
        </form>
      </div>
    </>
  )

}

export default ShopingItem
