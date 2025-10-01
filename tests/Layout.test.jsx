import { beforeEach, describe, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"

import Layout from "../src/components/Layout"

describe('Layout component', () => {

    const renderWithProps = (props = { cart: [] }) => {
        return render(
            <MemoryRouter>
                <Layout {...props} />
            </MemoryRouter>
        )
    }

    const testData = {
        cart: [
            { quantity: 1 },
            { quantity: 2 },
            { quantity: 5 },
        ]
    }

    it('renders', () => {
        renderWithProps()

        const links = screen.getAllByRole("link")

        expect(links).toHaveLength(3)
        expect(links[0]).toHaveTextContent("Main page")
        expect(links[1]).toHaveTextContent("Store page")
        expect(links[2]).toHaveTextContent("Cart")
    })

    it('shows quantity counter', () => {
        renderWithProps(testData)

        const counter = screen.getByTestId("quantityCounter")

        expect(counter).toHaveTextContent("8")
    })

    it('shows 99+ label on quantity of items over 99', () => {
        renderWithProps({
            cart: [
                { quantity: 98 },
                { quantity: 12 }]
        })

        const counter = screen.getByTestId("quantityCounter")

        expect(counter).toHaveTextContent("99+")

    })

    it("doesn't show quantity counter on empty cart", () => {
        renderWithProps()

        const counter = screen.queryByTestId("quantityCounter")

        expect(counter).not.toBeInTheDocument()
    })
})

