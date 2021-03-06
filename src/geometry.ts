import type { BoundingBox2D, Point2D } from "framer-motion"

/** @internal */
export const pointInsideRectangle = (box: BoundingBox2D, point: Point2D) => {
  return (
    box.top <= point.y &&
    box.bottom >= point.y &&
    box.left <= point.x &&
    box.right >= point.x
  )
}

/**
 * `el.getBoundingClientRect()` but ignoring transforms currently applied
 * to the element. Used to get the elements actual position, not where it
 * appears to be due to animations.
 *
 * @internal
 */
export function getBoundingClientRectIgnoringTransforms(el: HTMLElement) {
  let rect = el.getBoundingClientRect()
  let style = getComputedStyle(el)
  let tx = style.transform

  if (tx) {
    let sx, sy, dx, dy
    if (tx.startsWith("matrix3d(")) {
      let ta = tx.slice(9, -1).split(/, /)
      sx = +ta[0]
      sy = +ta[5]
      dx = +ta[12]
      dy = +ta[13]
    } else if (tx.startsWith("matrix(")) {
      let ta = tx.slice(7, -1).split(/, /)
      sx = +ta[0]
      sy = +ta[3]
      dx = +ta[4]
      dy = +ta[5]
    } else {
      return rect
    }

    let to = style.transformOrigin
    let x = rect.x - dx - (1 - sx) * parseFloat(to)
    let y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1))
    let w = sx ? rect.width / sx : el.offsetWidth
    let h = sy ? rect.height / sy : el.offsetHeight
    return {
      x,
      y,
      width: w,
      height: h,
      top: y,
      right: x + w,
      bottom: y + h,
      left: x,
    }
  } else {
    return rect
  }
}
