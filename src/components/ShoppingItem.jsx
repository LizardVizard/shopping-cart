import style from "./ShoppingItem.module.css"
import placeholder from "/vite.svg"

function ShoppingItem({ name, image, price, handleClick }) {

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const amount = parseInt(formData.get("quantity"), 10)
    if (formData.get("quantity") === "" || isNaN(amount) || amount < 1) {
      return
    }
    handleClick(amount)

  }

  return (
    <>
      <div className={style.card} data-testid="shopping-item">
        <div className={style.description}>
          <p>{name}</p>
          <img src={image || placeholder} alt="Item image" />
        </div>
        <h2>${price}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="quantity"
            type="number"
            min="1"
            max="99"
            step="1"
            placeholder="quantity"
            aria-label="Quantity"
            defaultValue="1" />
          <button className={style.button}>Add to cart</button>
        </form>
      </div>
    </>
  )

}

export default ShoppingItem
