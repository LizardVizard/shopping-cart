import { render, screen } from "@testing-library/react";
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

    const renderWithProps = (props
    ) => {
        return render(<CartItem {...props}
            itemQuantityChange={mockQuantityChange}
            itemDelete={mockDelete}
        />)

    }

    it('renders', () => {
        renderWithProps(initialData)
        expect(screen.getByRole("heading")).toHaveTextContent(initialData.name)
        expect(screen.getByRole("spinbutton")).toHaveValue(initialData.quantity)
        expect(screen.getByRole("spinbutton")).toHaveValue(initialData.quantity)
    })


    it('calls change callback on input change', async () => {
        const user = userEvent.setup()
        renderWithProps(initialData)
        const input = screen.getByRole("spinbutton")

        await user.clear(input)
        expect(mockQuantityChange).toHaveBeenCalledWith(0)
        expect(mockQuantityChange).toHaveBeenCalledTimes(1)

        await user.type(input, "1")
        expect(mockQuantityChange).toHaveBeenCalledWith(1)
        expect(mockQuantityChange).toHaveBeenCalledTimes(2)

        await user.type(input, "3")
        expect(mockQuantityChange).toHaveBeenCalledWith(13)
        expect(mockQuantityChange).toHaveBeenCalledTimes(3)
    })

    it('ignores non-numeric input', async () => {
        const user = userEvent.setup()
        renderWithProps(initialData)
        const input = screen.getByRole("spinbutton")

        expect(input).toHaveValue(initialData.quantity)

        await user.type(input, "abc")
        expect(mockQuantityChange).not.toHaveBeenCalled()

        // await user.clear(input)
        // await user.type(input, ".2")
        // expect(mockQuantityChange).toHaveBeenCalledWith(0.2)

        expect(input).toHaveValue(initialData.quantity)
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
