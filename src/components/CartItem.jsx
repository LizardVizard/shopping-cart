import { useState } from "react"

import placeholderImage from "/vite.svg"
import style from "./CartItem.module.css"

function CartItem({ name, image, quantity, itemChangeQuantity, itemDelete }) {
  const [inputValue, setInputValue] = useState(quantity)

  const validateQuantity = (value) => {
    const number = parseInt(value, 10)
    if (value === "" || isNaN(number) || number < 1) {
      return null
    } else {
      return number
    }
  }

  const checkValidity = (e) => {
    const validated = validateQuantity(e.target.value)
    if (!validated) {
      // setInputValue(1)
      e.target.value = 1
      itemChangeQuantity(1)
    }
  }

  const handleChange = (e) => {
    // setInputValue(e.target.value)

    const validated = validateQuantity(e.target.value)
    if (validated) {
      e.target.value = validated
      itemChangeQuantity(validated)
    }
  }

  // NOTE:
  // defaultValue is used for quantity, which is not ideal for keeping values synced.
  // It should be fine, since the value changes only:
  //  1. On Shopping Page when adding to cart 
  //  2. Inside Cart Item onChange of input
  // But for more complex apps controlled inputs should be used.
  return (
    <div className={style.item}>
      <img src={image || placeholderImage} alt="Item icon" />
      <div className={style.description}>
        <h3>{name}</h3>
        <p>{"text"}</p>
      </div>
      <div className={style.controls}><div>
        <label>Quantity: <input
          type="number"
          min="1"
          step="1"
          defaultValue={quantity}
          onChange={handleChange}
          onBlur={checkValidity}
        /> </label>
      </div>
        <button onClick={itemDelete}>Delete item from the cart</button></div>
    </div>
  )
}

export default CartItem
