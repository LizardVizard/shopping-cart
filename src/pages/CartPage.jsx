import CartItem from "../components/CartItem"
import style from "./CartPage.module.css"

const CartPage = ({ cart, setCart }) => {

  function handleItemQuantityChange(itemId, quantity) {
    if (quantity <= 0) {
      handleDeleteItem(itemId)
      return
    }
    setCart(cart.map((item) =>
      item.id === itemId ?
        { ...item, quantity: quantity } :
        { ...item }))
  }

  function handleDeleteItem(itemId) {
    const filteredCart = cart.filter((item) => item.id !== itemId)
    setCart(filteredCart.map((item) => ({ ...item })))
  }

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
    </>
  )
}

export default CartPage
