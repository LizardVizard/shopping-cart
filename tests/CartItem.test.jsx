import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { userEvent } from "@testing-library/user-event";

import CartItem from "../src/components/CartItem.jsx"

describe('Cart item component', () => {
    let mockQuantityChange
    let mockDelete

    beforeEach(() => {
        mockQuantityChange = vi.fn()
        mockDelete = vi.fn()
    })

    const initialData = {
        name: "Product 3",
        image: null,
        quantity: 3,
    }

    const renderWithProps = (props) => {
        return render(<CartItem {...props}
            itemChangeQuantity={mockQuantityChange}
            itemDelete={mockDelete}
        />)

    }

    it('renders', () => {
        renderWithProps(initialData)
        const input = screen.getByLabelText(/quantity/i)
        expect(screen.getByRole("heading")).toHaveTextContent(initialData.name)
        expect(input).toHaveValue(initialData.quantity)
    })


    it('calls change callback on input change', async () => {
        const user = userEvent.setup()
        renderWithProps(initialData)
        const input = screen.getByLabelText(/quantity/i)

        // Initial data.quantity is 3
        expect(input).toHaveValue(initialData.quantity)

        await user.clear(input)
        await user.type(input, "1234")
        expect(mockQuantityChange).toHaveBeenCalledWith(1)
        expect(mockQuantityChange).toHaveBeenCalledWith(12)
        expect(mockQuantityChange).toHaveBeenCalledWith(123)
        expect(mockQuantityChange).toHaveBeenCalledWith(1234)
        expect(mockQuantityChange).toHaveBeenCalledTimes(4)
        expect(input).toHaveValue(1234)

    })

    // it('ignores invalid input', async () => {
    //     const user = userEvent.setup()
    //     renderWithProps(initialData)
    //     // const input = screen.getByRole("spinbutton")
    //     const input = screen.getByLabelText(/quantity/i)
    //
    //     expect(input).toHaveValue(initialData.quantity)
    //
    //     // console.log(input.value, "AWDAWIDH0")
    //     // await user.clear(input)
    //     // expect(mockQuantityChange).toHaveBeenCalledWith(1)
    //     //
    //     // await user.click(input)
    //     console.log(input.value, "AWDAWIDH1")
    //     await user.type(input, "abc")
    //     // await user.type(input, "a")
    //     // await user.type(input, "b")
    //     // await user.type(input, "c")
    //     // await user.tab()
    //     console.log(input.value, "AWDAWIDH")
    //     // expect(mockQuantityChange).not.toHaveBeenCalled()
    //     expect(mockQuantityChange).toHaveBeenCalledWith(1)
    //
    //     await user.type(input, ".2")
    //     await user.tab()
    //     expect(mockQuantityChange).toHaveBeenCalledWith(1)
    //     expect(input).toHaveValue(1)
    //
    //     console.log(input.value, "AWDAWIDH")
    //     await user.clear(input)
    //     await user.type(input, "2")
    //     expect(mockQuantityChange).toHaveBeenCalledWith(2)
    //
    //     // expect(input).toHaveValue(1)
    // })

    describe('changes from invalid input to a default value of 1', () => {
        // NOTE:
        // Chrome(Blink) blocks letters from number input, but Firefox(Gecko) does not.
        // Because of that, onChange event is not called when typing non-numeric values
        // when using Chrome based browsers.
        // To keep the quantity input of type number, fireEvent is used to force value update.
        test("for non-number values", () => {
            renderWithProps(initialData)
            const input = screen.getByLabelText(/quantity/i)
            fireEvent.change(input, { target: { value: "" } })
            fireEvent.blur(input)

            expect(input).toHaveValue(1)
            expect(mockQuantityChange).toHaveBeenCalledWith(1)

            fireEvent.change(input, { target: { value: "a2" } })
            fireEvent.blur(input)

            expect(input).toHaveValue(1)
            expect(mockQuantityChange).toHaveBeenCalledWith(1)
        })

        test("for invalid values", async () => {
            renderWithProps(initialData)
            const input = screen.getByLabelText(/quantity/i)
            fireEvent.change(input, { target: { value: "-2" } })
            fireEvent.blur(input)

            expect(input).toHaveValue(1)
            expect(mockQuantityChange).toHaveBeenCalledWith(1)

            fireEvent.change(input, { target: { value: "3.2" } })
            fireEvent.blur(input)

            expect(input).toHaveValue(3)
            expect(mockQuantityChange).toHaveBeenCalledWith(3)


            // const user = userEvent.setup()
            //
            // await user.type(input, ".2")
            // await user.tab()
            //
            // expect(mockQuantityChange).toHaveBeenCalledWith(3)
            // expect(input).toHaveValue(3)
        })

    })

    it('calls delete callback when delete button is pressed', async () => {
        const user = userEvent.setup()
        renderWithProps(initialData)

        await user.click(screen.getByRole("button", { name: /delete/i }))
        expect(mockDelete).toHaveBeenCalled()
    })

    it('renders placeholder image when no image is provided', () => {
        renderWithProps(initialData)

        const img = screen.getByAltText("Item icon")

        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", expect.stringContaining('data:image/svg+xml'))

    })
    it('renders provided image', () => {
        const testImage = "product-image.png"
        renderWithProps({ ...initialData, image: testImage })

        const img = screen.getByAltText("Item icon")

        expect(img).toBeInTheDocument()
        expect(img).toHaveAttribute("src", expect.stringMatching(testImage))

    })
})
