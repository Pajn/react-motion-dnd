import type { PanInfo } from "framer-motion"
import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { dndContext, OngoingDrag } from "./context"
import { pointInsideRectangle } from "./geometry"

/**
 * @beta
 */
export function useDrop(options?: {
  ref?: MutableRefObject<HTMLElement | null>
  onDrop?: (drag: OngoingDrag, info: PanInfo) => void
  onItemEntered?: (drag: OngoingDrag, info: PanInfo) => void
  onItemLeft?: (drag: OngoingDrag, info: PanInfo) => void
  onDragMoveOver?: (drag: OngoingDrag, info: PanInfo) => void
}) {
  const context = useContext(dndContext)
  const [, rerender] = useState<any>()
  const [controller] = useState(() => ({
    state: {
      element: null as HTMLElement | null,
      isDraggingOver: false,
      position: undefined as DOMRect | undefined,
    },
    updatePosition() {
      controller.state.position = controller.state.element?.getBoundingClientRect()
      return controller.state.position
    },
  }))

  const optionsRef = useRef(options)
  optionsRef.current = options

  const refCallback = useCallback((e: HTMLElement | null) => {
    controller.state.element = e
    if (optionsRef.current?.ref) {
      optionsRef.current.ref.current = e
    }
  }, [])

  useEffect(() => {
    return context.dragStart.subscribe((drag) => {
      const position = controller.updatePosition()

      if (position !== undefined) {
        function updateDraggingOver(inside: boolean, info: PanInfo) {
          const didChange = inside !== controller.state.isDraggingOver
          controller.state.isDraggingOver = inside
          if (didChange) {
            if (inside) {
              drag.enteredDropZone.fire()
              optionsRef.current?.onItemEntered?.(drag, info)
              rerender({})
            } else {
              drag.leftDropZone.fire()
              optionsRef.current?.onItemLeft?.(drag, info)
              rerender({})
            }
          }
        }
        const startedInside = pointInsideRectangle(
          position,
          drag.startPoint.point,
        )
        setTimeout(() => {
          updateDraggingOver(startedInside, drag.startPoint)
        })

        drag.dragMove.subscribe((info) => {
          const inside = pointInsideRectangle(position, info.point)
          updateDraggingOver(inside, info)
          if (inside) {
            optionsRef.current?.onDragMoveOver?.(drag, info)
          }
        })

        drag.dragEnd.subscribe((info) => {
          const inside = pointInsideRectangle(position, info.point)
          updateDraggingOver(inside, info)
          controller.state.isDraggingOver = false

          if (inside) {
            optionsRef.current?.onDrop?.(drag, info)
            drag.droppedInDropZone.fire()
          }
        })
      }
    })
  }, [])

  const props = {
    ref: refCallback,
  }

  return { isDraggingOver: controller.state.isDraggingOver, props }
}
