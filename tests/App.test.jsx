import { render, screen } from "@testing-library/react";
import { beforeEach, describe, it } from "vitest";
import { userEvent } from "@testing-library/user-event"

import App from "../src/App";

describe("main component", () => {

  const renderWithProps = (props) => {
    return render(<App {...props} testing={true} />)
  }

  it("renders with main page by default", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")
  });

  describe('on page links', () => {
    it('navigates to shopping page', async () => {
      const user = userEvent.setup()
      renderWithProps()

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")
      await user.click(screen.getByText("Go to store"))
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Store")

    })

    it('navigates to cart page', async () => {
      const user = userEvent.setup()
      renderWithProps()

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")
      await user.click(screen.getByText("Go to shopping cart"))
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cart")

    })

  })

  describe('navbar links', () => {
    it('navigates to shopping page', async () => {
      const user = userEvent.setup()
      renderWithProps()

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")
      await user.click(screen.getByText("Store page"))
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Store")
    })

    it('navigates to cart page', async () => {
      const user = userEvent.setup()
      renderWithProps()

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")
      await user.click(screen.getByText("Cart"))
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cart")

    })

    it('navigates back to main page', async () => {
      const user = userEvent.setup()
      renderWithProps()

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")

      await user.click(screen.getByText("Cart"))

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cart")

      await user.click(screen.getByText("Main page"))

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Main page")

    })

  })

  describe('state change', () => {

  })

});
