import placeholderImage from "/vite.svg"
import style from "./CartItem.module.css"

function CartItem({ name, image, quantity, itemQuantityChange, itemDelete }) {

  const handleChange = (e) => {
    const value = Number(e.target.value)
    if (!isNaN(value)) {
      itemQuantityChange(value)
    }
  }

  // NOTE:
  // defaultValue is used for quantity, which is not ideal for keeping values synced.
  // It should be fine, since the value change only:
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
        <span>Quantity: </span>
        <input
          type="number"
          min="0"
          max="99"
          step="1"
          defaultValue={quantity}
          onChange={handleChange} />
      </div>
        <button onClick={itemDelete}>Delete item from the cart</button></div>
    </div>
  )
}

export default CartItem
