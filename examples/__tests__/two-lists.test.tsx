import { simulateDrag } from "@lib/__tests__/testUtils"
import { getAllByRole, render } from "@testing-library/react"
import chai, { expect } from "chai"
import chaiDom from "chai-dom"
import * as React from "react"
import Example from "../two-lists"

chai.use(chaiDom)

describe("two-lists", () => {
  it("starts in order", async () => {
    const { getByTestId } = render(<Example />)

    const leftItems = getAllByRole(getByTestId("list-left"), "listitem").map(
      (li) => li.dataset.testid,
    )
    const rightItems = getAllByRole(getByTestId("list-right"), "listitem").map(
      (li) => li.dataset.testid,
    )

    expect(leftItems).to.deep.equal(["item-0", "item-1", "item-2", "item-3"])
    expect(rightItems).to.deep.equal(["item-4", "item-5", "item-6", "item-7"])
  })

  it("can drag an item down", async () => {
    const { getByTestId } = render(<Example />)
    const item4 = getByTestId("item-4")

    await simulateDrag(item4, { x: 0, y: 120 })

    const items = getAllByRole(getByTestId("list-right"), "listitem").map(
      (li) => li.dataset.testid,
    )

    expect(items).to.deep.equal(["item-5", "item-4", "item-6", "item-7"])
  })

  it("can drag an item up", async () => {
    const { getByTestId } = render(<Example />)
    const item3 = getByTestId("item-3")

    await simulateDrag(item3, { x: 0, y: -180 })

    const items = getAllByRole(getByTestId("list-left"), "listitem").map(
      (li) => li.dataset.testid,
    )

    expect(items).to.deep.equal(["item-0", "item-3", "item-1", "item-2"])
  })

  it("can drag an item to the right", async () => {
    const { getByTestId } = render(<Example />)
    const item1 = getByTestId("item-1")

    await simulateDrag(item1, { x: 500, y: 0 })

    const itemsLeft = getAllByRole(getByTestId("list-left"), "listitem").map(
      (li) => li.dataset.testid,
    )
    const itemsRight = getAllByRole(getByTestId("list-right"), "listitem").map(
      (li) => li.dataset.testid,
    )

    expect(itemsLeft).to.deep.equal(["item-0", "item-2", "item-3"])
    expect(itemsRight).to.deep.equal([
      "item-4",
      "item-1",
      "item-5",
      "item-6",
      "item-7",
    ])
  })

  it("can drag an item to the left", async () => {
    const { getByTestId } = render(<Example />)
    const item6 = getByTestId("item-6")

    await simulateDrag(item6, { x: -500, y: -100 })

    const itemsLeft = getAllByRole(getByTestId("list-left"), "listitem").map(
      (li) => li.dataset.testid,
    )
    const itemsRight = getAllByRole(getByTestId("list-right"), "listitem").map(
      (li) => li.dataset.testid,
    )

    expect(itemsLeft).to.deep.equal([
      "item-0",
      "item-6",
      "item-1",
      "item-2",
      "item-3",
    ])
    expect(itemsRight).to.deep.equal(["item-4", "item-5", "item-7"])
  })

  it("can drag multiple times", async () => {
    const { getByTestId } = render(<Example />)
    const item0 = getByTestId("item-0")
    let item2 = getByTestId("item-2")
    let item5 = getByTestId("item-5")

    await simulateDrag(item0, { x: 500, y: 65 }, { steps: 5 })
    await simulateDrag(item2, { x: 500, y: -55 }, { steps: 5 })
    await simulateDrag(item0, { x: 0, y: 75 }, { steps: 5 })
    await simulateDrag(item5, { x: -500, y: 65 }, { steps: 5 })

    item2 = getByTestId("item-2")
    item5 = getByTestId("item-5")
    await simulateDrag(item2, { x: -500, y: 0 }, { steps: 5 })
    await simulateDrag(item5, { x: 0, y: -180 }, { steps: 5 })

    const itemsLeft = getAllByRole(getByTestId("list-left"), "listitem").map(
      (li) => li.dataset.testid,
    )
    const itemsRight = getAllByRole(getByTestId("list-right"), "listitem").map(
      (li) => li.dataset.testid,
    )

    expect(itemsLeft).to.deep.equal(["item-1", "item-5", "item-2", "item-3"])
    expect(itemsRight).to.deep.equal(["item-4", "item-0", "item-6", "item-7"])
  })
})
