import { screen, render, fireEvent } from "@testing-library/react"
import { beforeEach, describe, it, vi } from "vitest"
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

        const cartItemsImgs = screen.queryAllByRole("img", { alt: "Item icon" })
        expect(cartItemsImgs.length).toBe(0)

        expect(screen.getByRole("heading", { name: /no items/i, level: 2 })).toBeInTheDocument()
        const totalCost = screen.getByRole("heading", { name: /total/i, level: 2 })
        expect(totalCost).toBeInTheDocument()
        expect(totalCost).toHaveTextContent("Total: $0.00")
    })

    it('renders correct total cost', () => {
        renderWithProps(initialProps)

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cart")

        let totalCost = screen.getByRole("heading", { level: 2 })
        let testTotal =
            initialProps.cart[0].price * initialProps.cart[0].quantity +
            initialProps.cart[1].price * initialProps.cart[1].quantity +
            initialProps.cart[2].price * initialProps.cart[2].quantity
        expect(totalCost).toHaveTextContent(`Total: $${testTotal.toFixed(2)}`)
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

    describe('calls change callback with a fallback value on invalid input', async () => {
        let user
        let quantityInput
        let itemIdToChange
        beforeEach(async () => {
            user = userEvent.setup()

            renderWithProps(initialProps)

            const quantityInputs = screen.getAllByLabelText(/quantity/i)

            const itemIndexToChangeQuantity = 2
            quantityInput = quantityInputs[itemIndexToChangeQuantity]
            itemIdToChange = initialProps.cart[itemIndexToChangeQuantity].id
        })

        test('empty input', async () => {
            await user.clear(quantityInput)
            await user.tab()

            expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 1)
            expect(mockItemChangeQuantity).toHaveBeenCalledTimes(1)
        })

        test('out of range', async () => {
            await user.clear(quantityInput)
            await user.type(quantityInput, "-1")
            await user.tab()

            expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 1)
            expect(mockItemChangeQuantity).toHaveBeenCalledTimes(1)
        })

        test('decimal input', async () => {
            await user.clear(quantityInput)
            await user.type(quantityInput, "0.4")
            await user.tab()

            expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 1)
            expect(mockItemChangeQuantity).toHaveBeenCalledTimes(1)
        })

        // NOTE: Chrome doesn't allow letters in number input,
        // but Firefox does, so tests with letters have to be done like this
        test('non-numeric input', async () => {
            fireEvent.change(quantityInput, { target: { value: "abc" } })
            fireEvent.blur(quantityInput)

            expect(mockItemChangeQuantity).toHaveBeenCalledWith(itemIdToChange, 1)
            expect(mockItemChangeQuantity).toHaveBeenCalledTimes(1)
        })
    })

})
