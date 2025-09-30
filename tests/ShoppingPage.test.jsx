import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, beforeEach, afterEach, vi } from "vitest"
import { userEvent } from "@testing-library/user-event"

import ShoppingPage from "../src/pages/ShoppingPage"

describe('Shopping page', () => {
    let mockItemAddOrModify

    const testCatalogue = [
        { id: 0, title: "Product 1", price: 150.35, image: "image1.jpeg" },
        { id: 1, title: "Product 2", price: 15000.1, image: "image2.jpeg" },
        { id: 5, title: "Product 3", price: 50.50, image: "image3.jpeg" },
    ]

    const mockFetch = () => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(testCatalogue)
        })
    }

    const mockFetchReject = (error = "fetch failed") => {
        vi.spyOn(global, "fetch").mockRejectedValue(new Error(error))
    }

    const mockFetchError = (error = "not found") => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: false,
            status: 404,
            json: vi.fn().mockResolvedValue({})
        })
    }


    beforeEach(() => {
        mockItemAddOrModify = vi.fn()
    })

    afterEach(() => {
        vi.restoreAllMocks()

    })

    const renderWithProps = (props) => {
        return render(
            <ShoppingPage {...props}
                handleItemAddOrModify={mockItemAddOrModify}
            />
        )
    }

    it('renders', async () => {
        mockFetch()
        renderWithProps()
        const title = screen.getByRole("heading", { level: 1 })

        expect(title).toBeInTheDocument()
        expect(title).toHaveTextContent("Store")
    })

    describe('data fetching', () => {
        it('renders on successful fetch', async () => {
            mockFetch()
            renderWithProps()

            const shoppingItems = await screen.findAllByTestId("shopping-item")

            expect(shoppingItems).toHaveLength(testCatalogue.length)
            testCatalogue.forEach(item =>
                expect(screen.getByText(item.title)).toBeInTheDocument()
            )
        })

        it('renders on network error', async () => {
            const errorMessage = "Error 404"
            mockFetchReject(errorMessage)
            renderWithProps()

            const shoppingItems = screen.queryAllByTestId("shopping-item")
            const errorHeading = await screen.findByRole("heading", { level: 2 })

            expect(shoppingItems).toHaveLength(0)
            expect(errorHeading).toHaveTextContent(errorMessage)
        })

        it('renders on response error', async () => {
            mockFetchError()
            renderWithProps()

            const shoppingItems = screen.queryAllByTestId("shopping-item")
            const errorHeading = await screen.findByRole("heading", { level: 2 })

            expect(shoppingItems).toHaveLength(0)
            expect(errorHeading).toHaveTextContent(/error:?\s*404/i)
        })

    })

    describe('handleItemAddOrModify callback', () => {
        it('uses default value of 1', async () => {

            const user = userEvent.setup()
            mockFetch()
            renderWithProps()

            const shoppingItemsButtons = await screen.findAllByRole("button", { name: /add to cart/i })

            const itemIndex = 1
            await user.click(shoppingItemsButtons[itemIndex])

            expect(mockItemAddOrModify).toHaveBeenCalledWith(testCatalogue[itemIndex], 1)
        })

        it('uses quantity input', async () => {

            const user = userEvent.setup()
            mockFetch()
            renderWithProps()

            const shoppingItemsButtons = await screen.findAllByRole("button", { name: /add to cart/i })
            const shoppingItemsQuantity = await screen.findAllByPlaceholderText("quantity")

            const itemIndex = 1
            const quantity = 12
            await user.clear(shoppingItemsQuantity[itemIndex])
            await user.type(shoppingItemsQuantity[itemIndex], quantity.toString())
            await user.click(shoppingItemsButtons[itemIndex])

            expect(mockItemAddOrModify).toHaveBeenCalledWith(testCatalogue[itemIndex], quantity)
        })

        it('is not triggered if input is invalid', async () => {
            const user = userEvent.setup()
            mockFetch()
            renderWithProps()

            const shoppingItemsButtons = await screen.findAllByRole("button", { name: /add to cart/i })
            const shoppingItemsQuantity = await screen.findAllByPlaceholderText("quantity")

            const itemIndex = 1

            // Invalid value
            await user.clear(shoppingItemsQuantity[itemIndex])
            await user.type(shoppingItemsQuantity[itemIndex], "-12")
            await user.click(shoppingItemsButtons[itemIndex])

            expect(mockItemAddOrModify).not.toHaveBeenCalled()

            // Non-numeric value
            // NOTE: using fireEvent because Chrome doesn't allow for text
            // in number input, but Firefox does
            fireEvent.change(shoppingItemsQuantity[itemIndex], { target: { value: "abc" } })
            await user.click(shoppingItemsButtons[itemIndex])

            expect(mockItemAddOrModify).not.toHaveBeenCalled()


        })

    })

})
