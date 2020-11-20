import { fireEvent } from "@testing-library/react"

export const nextFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )

export async function simulateDrag(
  target: Element,
  offset: { x: number; y: number },
  { steps = 10, debug = false } = {},
) {
  const targetPos = target.getBoundingClientRect()
  const pointerStart = {
    x: targetPos.left + targetPos.width / 2,
    y: targetPos.top + targetPos.height / 2,
  }
  if (debug) {
    console.log(
      `Drag from ${pointerStart.x}, ${pointerStart.y} to ${
        pointerStart.x + offset.x
      }, ${pointerStart.y + offset.y}`,
    )
  }

  fireEvent.pointerDown(target, {
    clientX: pointerStart.x,
    clientY: pointerStart.y,
  })
  await nextFrame()
  for (let step = 0; step < steps; step++) {
    const percentage = Math.min(step / steps, 1)

    fireEvent.pointerMove(target, {
      clientX: pointerStart.x + offset.x * percentage,
      clientY: pointerStart.y + offset.y * percentage,
    })
    await nextFrame()
  }
  fireEvent.pointerMove(target, {
    clientX: pointerStart.x + offset.x,
    clientY: pointerStart.y + offset.y,
  })
  await nextFrame()
  fireEvent.pointerUp(target, {
    clientX: pointerStart.x + offset.x,
    clientY: pointerStart.y + offset.y,
  })
}
