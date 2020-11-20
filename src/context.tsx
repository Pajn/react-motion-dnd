import type { PanInfo } from "framer-motion"
import React, { createContext, ReactNode, useState } from "react"
import type { DragType } from "./dragType"
import { createEventController, EventController } from "./events"

export type DndContext = {
  dragStart: EventController<OngoingDrag>
}
export const dndContext = createContext<DndContext>(undefined as any)

export const DndProvider = (props: { children: ReactNode }) => {
  const [context] = useState<DndContext>(() => ({
    dragStart: createEventController(),
  }))

  return (
    <dndContext.Provider value={context}>{props.children}</dndContext.Provider>
  )
}

export type OngoingDrag = Readonly<{
  startPoint: PanInfo
  data: Map<DragType<unknown>, unknown>

  dragMove: EventController<PanInfo>
  dragEnd: EventController<PanInfo>

  enteredDropZone: EventController<void>
  leftDropZone: EventController<void>
  droppedInDropZone: EventController<void>
}>

export const OngoingDrag = {
  create(startPoint: PanInfo): OngoingDrag {
    return {
      startPoint,
      data: new Map(),

      dragMove: createEventController(),
      dragEnd: createEventController(),

      enteredDropZone: createEventController(),
      leftDropZone: createEventController(),
      droppedInDropZone: createEventController(),
    }
  },

  getData<T>(self: OngoingDrag, type: DragType<T>): T | undefined {
    return self.data.get(type) as T | undefined
  },
  setData<T>(self: OngoingDrag, type: DragType<T>, data: T) {
    self.data.set(type, data)
  },
}
