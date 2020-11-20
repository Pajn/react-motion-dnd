import { DndProvider } from "@lib/context"
import { useDrag } from "@lib/useDrag"
import { nextFrame } from "@lib/__tests__/testUtils"
import { fireEvent, render } from "@testing-library/react"
import chai, { expect } from "chai"
import chaiDom from "chai-dom"
import { motion } from "framer-motion"
import React from "react"

chai.use(chaiDom)

describe("useDrag", () => {
  it("returns correct dragging status", async () => {
    const Component = () => {
      const { isDragging, isLifted, props } = useDrag()

      return (
        <motion.div {...props} data-testid="dragitem">
          {isDragging && "isDragging"}
          <br />
          {isLifted && "isLifted"}
        </motion.div>
      )
    }

    const { getByTestId } = render(
      <DndProvider>
        <Component />
      </DndProvider>,
    )
    const dragitem = getByTestId("dragitem")

    expect(dragitem).to.have.text("")
    fireEvent.pointerDown(dragitem, {
      clientX: 0,
      clientY: 0,
    })
    await nextFrame()
    fireEvent.pointerMove(dragitem, {
      clientX: 10,
      clientY: 10,
    })
    await nextFrame()

    expect(dragitem).to.contain.text("isDragging")
    expect(dragitem).to.contain.text("isLifted")

    fireEvent.pointerUp(dragitem, {
      clientX: 10,
      clientY: 10,
    })
    expect(dragitem).to.not.contain.text("isDragging")
    expect(dragitem).to.contain.text("isLifted")
  })
})
