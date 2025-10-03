import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, it } from "vitest";
import { userEvent } from "@testing-library/user-event"

import App from "../src/App";

describe("main component", () => {
  let user

  const renderWithProps = (props) => {
    return render(<App {...props} testing={true} />)
  }

  beforeEach(() => {
    user = userEvent.setup()
    renderWithProps()
  })

  it("renders with main page by default", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")
  });

  describe('main page links', () => {
    it('navigates to shopping page', async () => {
      await user.click(screen.getByText("Go to store"))
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Store")

    })

    it('navigates to cart page', async () => {
      await user.click(screen.getByText("Go to shopping cart"))
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cart")
    })
  })

  describe('navbar links', () => {
    it('navigates to shopping page', async () => {
      await user.click(screen.getByText("Store page"))
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Store")
    })

    it('navigates to cart page', async () => {
      await user.click(screen.getByText("Cart"))
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cart")
    })

    it('navigates back to main page', async () => {

      await user.click(screen.getByText("Cart"))

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cart")

      await user.click(screen.getByText("Main page"))

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")

    })

  })

  describe('state change', () => {
    const testCatalogue = [
      { id: 1, title: "Product 1", price: 10 },
      { id: 2, title: "Product 2", price: 20 },
      { id: 3, title: "Product 3", price: 30 }
    ]

    const mockFetch = () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(testCatalogue)
      })
    }

    beforeEach(() => {
      mockFetch()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    const addItems = async (items) => {
      await user.click(screen.getByText("Store page"))
      const itemAddButtons = await screen.findAllByRole("button", { name: /add to cart/i })
      const itemQuantityInputs = screen.getAllByRole("spinbutton", { name: /quantity/i })
      for (let { index, quantity = 1 } of items) {
        if (quantity > 1) {
          await user.clear(itemQuantityInputs[index])
          await user.type(itemQuantityInputs[index], quantity.toString())
        }
        await user.click(itemAddButtons[index])
      }
    }

    // WARNING: Assert cart's FINAL items
    const assertCartItems = async (items) => {
      await user.click(screen.getByRole("link", { name: /cart/i }))
      const cartItemNames = screen.getAllByRole("heading", { level: 3 })
      const cartItemQuantity = screen.getAllByRole("spinbutton", { name: /quantity/i })

      expect(cartItemNames).toHaveLength(items.length)
      expect(cartItemQuantity).toHaveLength(items.length)
      cartItemNames.map((itemName, foundItemIndex) => {
        expect(itemName)
          .toHaveTextContent(testCatalogue[items[foundItemIndex].index].title)
        expect(cartItemQuantity[foundItemIndex])
          .toHaveValue(items[foundItemIndex].quantity || 1)
      })
    }

    describe('adding items from the store page', () => {
      it('adds a single item to cart', async () => {
        const itemsToAdd = [
          { index: 1 }
        ]

        await addItems(itemsToAdd)

        await assertCartItems(itemsToAdd)
      })

      it('adds quantity to existing items', async () => {
        const firstItems = [{ index: 0 }, { index: 1 }]
        await addItems(firstItems)
        await assertCartItems(firstItems)

        // Additional quantity
        const secondItems = [{ index: 1, quantity: 5 }]
        await addItems(secondItems)

        // Check if quantities were added
        await assertCartItems([
          { index: 0, quantity: 1 },
          { index: 1, quantity: 6 },
        ])
      })
    })

    it('deletes item from cart', async () => {
      const itemsToAdd = [
        { index: 0, quantity: 2 },
        { index: 1, quantity: 4 },
        { index: 2, quantity: 8 },
      ]
      await addItems(itemsToAdd)

      await user.click(screen.getByRole("link", { name: /cart/i }))
      const deleteItemButtons = screen.getAllByRole("button", { name: /delete item/i })
      await user.click(deleteItemButtons[1])

      await assertCartItems([
        { index: 0, quantity: 2 },
        { index: 2, quantity: 8 },
      ])

      expect(screen.queryByText(testCatalogue[1].title)).toBeNull()
    })
  })

});
