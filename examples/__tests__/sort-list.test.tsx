import { simulateDrag } from "@lib/__tests__/testUtils"
import { render } from "@testing-library/react"
import chai, { expect } from "chai"
import chaiDom from "chai-dom"
import * as React from "react"
import Example from "../sort-list"

chai.use(chaiDom)

describe("sort-list", () => {
  it("starts in order", async () => {
    const { getAllByRole } = render(<Example />)

    const items = getAllByRole("listitem").map((li) => li.dataset.testid)

    expect(items).to.deep.equal(["item-0", "item-1", "item-2", "item-3"])
  })

  it("can drag an item down", async () => {
    const { getByTestId, getAllByRole } = render(<Example />)
    const item1 = getByTestId("item-1")

    await simulateDrag(item1, { x: 0, y: 120 })

    const items = getAllByRole("listitem").map((li) => li.dataset.testid)

    expect(items).to.deep.equal(["item-0", "item-2", "item-1", "item-3"])
  })

  it("can drag an item up", async () => {
    const { getByTestId, getAllByRole } = render(<Example />)
    const item3 = getByTestId("item-3")

    await simulateDrag(item3, { x: 0, y: -180 })

    const items = getAllByRole("listitem").map((li) => li.dataset.testid)

    expect(items).to.deep.equal(["item-0", "item-3", "item-1", "item-2"])
  })

  it("can drag multiple times", async () => {
    const { getByTestId, getAllByRole } = render(<Example />)
    const item0 = getByTestId("item-0")
    const item2 = getByTestId("item-2")

    await simulateDrag(item0, { x: 0, y: 65 })
    await simulateDrag(item2, { x: 0, y: -55 })
    await simulateDrag(item0, { x: 0, y: 75 })

    const items = getAllByRole("listitem").map((li) => li.dataset.testid)

    expect(items).to.deep.equal(["item-1", "item-2", "item-3", "item-0"])
  })
})
