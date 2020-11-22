import type { DraggableProps, LayoutProps, PanInfo } from "framer-motion"
import { useContext, useEffect, useRef, useState } from "react"
import { dndContext, OngoingDrag } from "./context"
import { createDragType, DragType } from "./dragType"
import { getBoundingClientRectIgnoringTransforms } from "./geometry"

/** @internal */
export type _DragType<T> = DragType<T>

/**
 * @alpha
 */
export const pointerOffset = createDragType<{ top: number; left: number }>(
  "pointer-offset",
)

const dragConstraintsBounceBack = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const

/**
 * @beta
 */
export function useDrag(options?: {
  onDragStart?: (drag: OngoingDrag, info: PanInfo) => void
  onDragMove?: (drag: OngoingDrag, info: PanInfo) => void
  onDragEnd?: (drag: OngoingDrag, info: PanInfo) => void
  onDragDropped?: (drag: OngoingDrag) => void
  onDragCancel?: (drag: OngoingDrag) => void
}) {
  const context = useContext(dndContext)
  const [, rerender] = useState<any>()

  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  })

  const [controller] = useState(() => ({
    isMounted: true,
    ongoingDrag: undefined as OngoingDrag | undefined,
    inDragZone: false,
    isLifted: false,
    onDragStart(event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
      const ongoingDrag = OngoingDrag.create(info)

      const rect = getBoundingClientRectIgnoringTransforms(
        event.target as HTMLElement,
      )
      OngoingDrag.setData(ongoingDrag, pointerOffset, {
        top: info.point.y - rect.top,
        left: info.point.x - rect.left,
      })

      controller.ongoingDrag = ongoingDrag
      controller.isLifted = true

      ongoingDrag.enteredDropZone.subscribe(() => {
        controller.inDragZone = true
      })
      ongoingDrag.leftDropZone.subscribe(() => {
        controller.inDragZone = false
      })
      ongoingDrag.droppedInDropZone.subscribe(() => {
        optionsRef.current?.onDragDropped?.(ongoingDrag)
      })

      context.dragStart.fire(ongoingDrag)
      optionsRef.current?.onDragStart?.(ongoingDrag, info)
      rerender({})
    },
    onDragMove(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
      controller.ongoingDrag!.dragMove.fire(info)
      optionsRef.current?.onDragMove?.(controller.ongoingDrag!, info)
    },
    onDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
      controller.ongoingDrag!.dragEnd.fire(info)
      controller.ongoingDrag = undefined

      optionsRef.current?.onDragEnd?.(controller.ongoingDrag!, info)
      if (controller.inDragZone) {
        controller.inDragZone = false
      } else {
        optionsRef.current?.onDragCancel?.(controller.ongoingDrag!)
      }

      if (controller.isMounted) {
        rerender({})
      }
    },
    onLayoutAnimationComplete() {
      controller.isLifted = false

      if (controller.isMounted) {
        rerender({})
      }
    },
  }))

  useEffect(() => {
    return () => {
      controller.isMounted = false
    }
  }, [])

  const props: DraggableProps & LayoutProps = {
    drag: true,
    dragConstraints: dragConstraintsBounceBack,
    dragMomentum: false,
    dragElastic: 1,
    onDragStart: controller.onDragStart,
    onDrag:
      controller.ongoingDrag === undefined ? undefined : controller.onDragMove,
    onDragEnd:
      controller.ongoingDrag === undefined ? undefined : controller.onDragEnd,
    onLayoutAnimationComplete:
      controller.isLifted && controller.ongoingDrag === undefined
        ? controller.onLayoutAnimationComplete
        : undefined,
  }

  return {
    isDragging: controller.ongoingDrag !== undefined,
    isLifted: controller.isLifted,
    props,
  }
}
