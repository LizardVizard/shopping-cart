import { screen, render } from "@testing-library/react"
import { describe, it, vi } from "vitest"
import { userEvent } from "@testing-library/user-event"

import CartPage from "../src/pages/CartPage"



describe('Cart page', () => {
    let mockSetCart

    beforeEach(() => {
        mockSetCart = vi.fn()
    })

    const initialProps = {
        cart: [
            {
                id: 0,
                name: "product1",
                quantity: 1,
                price: 100,
            }, {
                id: 1,
                name: "Product 2",
                quantity: 15,
                price: 10,
            }, {
                id: 2,
                name: "Product Y",
                quantity: 1500,
                price: 1000,
            }],
    }

    const renderWithProps = (props) => {
        return render(<CartPage {...props} setCart={mockSetCart} />)
    }

    it('renders with all cart items', () => {
        renderWithProps(initialProps)

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cart")

        const cartItemsImgs = screen.getAllByRole("img", { alt: "Item icon" })
        expect(cartItemsImgs.length).toBe(initialProps.cart.length)

    })

    it('shows message when no items in the cart', () => {
        renderWithProps({ ...initialProps, cart: [] })

        expect(screen.getByRole("heading", { name: /no items/i, level: 2 })).toBeInTheDocument()
    })

    //FIX: Make up my mind how to test deletion
    it('on deletion calls Cart state change without the item', async () => {
        const user = userEvent.setup()
        renderWithProps(initialProps)

        const buttons = screen.getAllByRole("button", { name: /delete/i })
        let itemToDelete
        let newCart

        itemToDelete = 0
        await user.click(buttons[itemToDelete])
        newCart = mockSetCart.mock.calls.at(-1)[0]
        expect(newCart).not.toEqual(expect.arrayContaining([initialProps.cart[itemToDelete]]))

        itemToDelete = 1
        await user.click(buttons[itemToDelete])
        newCart = mockSetCart.mock.calls.at(-1)[0]
        expect(newCart).not.toEqual(expect.arrayContaining([initialProps.cart[itemToDelete]]))
        expect(newCart).toEqual(initialProps.cart.filter(item => item.id !== initialProps.cart[itemToDelete].id))

        await user.click(buttons[1])
        expect(mockSetCart).toHaveBeenCalledWith(initialProps.cart.toSpliced(1, 1))

        // const newCart = mockSetCart.mock.calls[0][0]
        // console.log(mockSetCart.mock.calls[1][0])
    })
})
