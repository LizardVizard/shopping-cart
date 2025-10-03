import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, beforeEach, vi } from "vitest"
import { userEvent } from "@testing-library/user-event"

import ShoppingItem from "../src/components/ShoppingItem"

describe('Shop item', () => {
    let mockHandleItemClick

    beforeEach(() => {
        mockHandleItemClick = vi.fn()
    })

    const testData = {
        name: "Product A",
        price: 150,
        image: "/path/test-image.png"
    }

    const renderWithProps = (props) => {
        return render(
            <ShoppingItem {...props}
                handleClick={mockHandleItemClick} />
        )
    }

    it('renders', () => {
        renderWithProps(testData)
        const itemName = screen.getByText(testData.name)
        const itemPrice = screen.getByRole("heading", { level: 2 })
        const quantityInput = screen.getByRole("spinbutton")

        expect(itemName).toBeInTheDocument()
        expect(itemName).toHaveTextContent(testData.name)
        expect(itemPrice).toHaveTextContent(`$${testData.price}`)
        expect(quantityInput).toHaveValue(1)
    })

    it('uses placeholder image if no image is provided', () => {
        renderWithProps({ ...testData, image: null })
        const img = screen.getByAltText("Item image")

        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", expect.stringContaining("data:image/svg"))

    })

    it('uses provided image', () => {
        renderWithProps(testData)
        const img = screen.getByAltText("Item image")

        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", expect.stringContaining("test-image.png"))

    })

    it('calls click callback with input value', async () => {
        const user = userEvent.setup()
        renderWithProps(testData)

        const button = screen.getByRole("button", { name: /add to cart/i })
        const quantityInput = screen.getByRole("spinbutton")

        await user.click(button)
        expect(mockHandleItemClick).toHaveBeenCalledWith(1)
        expect(mockHandleItemClick).toHaveBeenCalledTimes(1)

        await user.clear(quantityInput)
        await user.type(quantityInput, "12")
        await user.click(button)
        expect(mockHandleItemClick).toHaveBeenCalledWith(12)
        expect(mockHandleItemClick).toHaveBeenCalledTimes(2)

        // await user.clear(quantityInput)
        // await user.type(quantityInput, "34.9")
        //
        // fireEvent.change(quantityInput, { target: { value: "34.9" } })
        // await user.click(button)
        // console.log(quantityInput.value)
        // expect(mockHandleItemClick).toHaveBeenCalledWith(34)
        // expect(mockHandleItemClick).toHaveBeenCalledTimes(3)
    })

    it('does not call callback with invalid values', async () => {

        const user = userEvent.setup()
        renderWithProps(testData)

        const addToCartButton = screen.getByRole("button", { name: /add to cart/i })
        const quantityInput = screen.getByRole("spinbutton")

        await user.clear(quantityInput)
        await user.type(quantityInput, "-1")
        expect(quantityInput).toHaveValue(-1)
        await user.click(addToCartButton)


        await user.clear(quantityInput)
        await user.type(quantityInput, "34.2")
        expect(quantityInput).toHaveValue(34.2)
        await user.click(addToCartButton)


        // NOTE:
        // Chrome(Blink) blocks letters from number input, but Firefox(Gecko) does not.
        // Because of that, onChange event is not called when typing non-numeric values
        // when using Chrome based browsers.
        // To keep the quantity input of type number, fireEvent is used to force value update.
        fireEvent.change(quantityInput, { target: { value: "abc" } })
        await user.click(addToCartButton)
        expect(quantityInput.value).toBe("")

        expect(mockHandleItemClick).not.toHaveBeenCalled()
    })

})
