import { screen, render, fireEvent } from "@testing-library/react"
import { describe, it, vi } from "vitest"
import { userEvent } from "@testing-library/user-event"

import CartPage from "../src/pages/CartPage"



describe('Cart page', () => {
    let mockItemChangeQuantity
    let mockItemDelete

    beforeEach(() => {
        mockItemChangeQuantity = vi.fn()
        mockItemDelete = vi.fn()
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
                id: 5,
                name: "Product Y",
                quantity: 1500,
                price: 1000,
            }],
    }

    const renderWithProps = (props) => {
        return render(
            <CartPage {...props}
                handleItemChangeQuantity={mockItemChangeQuantity}
                handleItemDelete={mockItemDelete}
            />)
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

    it('calls delete callback on Cart Item delete', async () => {
        const user = userEvent.setup()
        renderWithProps(initialProps)

        const buttons = screen.getAllByRole("button", { name: /delete/i })
        let itemToDelete
        let itemId

        itemToDelete = 0
        await user.click(buttons[itemToDelete])

        itemId = mockItemDelete.mock.calls.at(-1)[0]
        expect(itemId).toEqual(initialProps.cart[itemToDelete].id)
        expect(buttons).toHaveLength(initialProps.cart.length)


    })

    it('calls change callback on Cart Item quantity change', async () => {
        const user = userEvent.setup()
        let itemIndexToChangeQuantity
        let itemIdToChange

        renderWithProps(initialProps)

        const quantityInputs = screen.getAllByLabelText(/quantity/i)

        itemIndexToChangeQuantity = 2
        itemIdToChange = initialProps.cart[itemIndexToChangeQuantity].id

        await user.clear(quantityInputs[itemIndexToChangeQuantity])
        await user.type(quantityInputs[itemIndexToChangeQuantity], "357")

        expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 3)
        expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 35)
        expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 357)
        expect(mockItemChangeQuantity).toHaveBeenCalledTimes(3)

    })

    it('calls change callback with a fallback value on invalid input', async () => {
        const user = userEvent.setup()
        let itemIndexToChangeQuantity
        let itemIdToChange

        renderWithProps(initialProps)

        const quantityInputs = screen.getAllByLabelText(/quantity/i)

        itemIndexToChangeQuantity = 2
        const quantityInput = quantityInputs[itemIndexToChangeQuantity]
        itemIdToChange = initialProps.cart[itemIndexToChangeQuantity].id
        expect(itemIdToChange).toEqual(initialProps.cart[itemIndexToChangeQuantity].id)


        // Empty input
        await user.clear(quantityInput)
        await user.tab()

        expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 1)
        expect(mockItemChangeQuantity).toHaveBeenCalledTimes(1)
        mockItemChangeQuantity.mockClear()

        // Invalid values
        await user.type(quantityInput, "-1")
        await user.tab()

        expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 1)
        expect(mockItemChangeQuantity).toHaveBeenCalledTimes(1)
        mockItemChangeQuantity.mockClear()

        await user.clear(quantityInput)
        await user.type(quantityInput, "0.4")
        await user.tab()

        expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 1)
        expect(mockItemChangeQuantity).toHaveBeenCalledTimes(1)
        mockItemChangeQuantity.mockClear()


        // Non-numberic input
        // NOTE: Chrome doesn't allow letters in number input,
        // but Firefox does, so tests with letters have to be done like this
        fireEvent.change(quantityInput, { target: { value: "abc" } })
        fireEvent.blur(quantityInput)

        expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 1)
        expect(mockItemChangeQuantity).toHaveBeenCalledTimes(1)
        mockItemChangeQuantity.mockClear()
    })

})
