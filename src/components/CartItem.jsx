
import reactLogo from "../assets/react.svg"
import placeholderImage from "/vite.svg"
import style from "./CartItem.module.css"

function CartItem({ name, image, quantity, itemQuantityChange, itemDelete }) {

  function handleChange(e) {
    console.log(e.target.value)
    itemQuantityChange(Number(e.target.value))

  }

  return (
    <div className={style.item}>
      <img src={image || placeholderImage} alt="Item icon" />
      <div className={style.description}>
        <p>{name}</p>
      </div>
      <div>
        <p></p>
        <input
          type="number"
          min="0"
          max="99"
          step="1"
          value={quantity}
          onChange={handleChange} />
      </div>
      <button onClick={itemDelete}>Delete item from the cart</button>
    </div>
  )
}

export default CartItem
