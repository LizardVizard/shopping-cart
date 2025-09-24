import { Link } from "react-router"

export default () => {
  return (
    <>
      <h1>Main page</h1>
      <p><Link to="/shop">Go to store</Link></p>
      <p><Link to="/cart">Go to shoping cart</Link></p>
    </>
  )
}
