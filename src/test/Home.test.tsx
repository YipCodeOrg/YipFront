import React from "react"
import { screen } from "@testing-library/react"
import { render } from "./test-utils"
import Home from "../routes/Home"

test("renders learn react link", () => {
  render(<Home  isLoggedIn={true} isSignedUp={true} setIsSigedUp={() => {}}/>)
  const linkElement = screen.getByText(/learn chakra/i)
  expect(linkElement).toBeInTheDocument()
})
