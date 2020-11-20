import {
  createDragType,
  DndProvider,
  OngoingDrag,
  useDrag,
  useDrop,
} from "@lib/index"
import { motion, Point2D, useAnimation } from "framer-motion"
import React, { useRef, useState } from "react"
import { ExampleContainer } from "./lib/ExmpleContainer"

const dropZoneCenter = createDragType<Point2D>()

export default () => {
  const [message, setMessage] = useState("")

  return (
    <DndProvider>
      <ExampleContainer columns={2}>
        <DragItem setMessage={setMessage} />
        <DropZone setMessage={setMessage} />
        <div data-testid="message" style={{ gridColumn: "span 2", height: 30 }}>
          {message}
        </div>
      </ExampleContainer>
    </DndProvider>
  )
}

const DragItem = (props: { setMessage: (message: string) => void }) => {
  const animationControlls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const dragItem = useDrag({
    onDragStart() {
      animationControlls.start({ scale: 1.12 })
    },
    onDragEnd() {
      animationControlls.start({ scale: 1 })
    },
    onDragDropped(drag) {
      props.setMessage("Dropped in dropzone")
      const point = OngoingDrag.getData(drag, dropZoneCenter)
      if (point && ref.current) {
        const rect = ref.current.getBoundingClientRect()
        animationControlls.start({
          x: point.x - rect.left - rect.width / 2,
          y: point.y - rect.top - rect.height / 2,
        })
      }
    },
    onDragCancel() {
      props.setMessage("Dropped outside")
    },
  })

  return (
    <motion.div
      data-testid="dragitem"
      ref={ref}
      {...dragItem.props}
      initial={false}
      animate={animationControlls}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        height: 100,
        borderRadius: 10,
        color: "white",
        backgroundColor: "hotpink",
      }}
    >
      Drag me
    </motion.div>
  )
}

const DropZone = (props: { setMessage: (message: string) => void }) => {
  const ref = useRef<HTMLElement | null>(null)
  const dropZone = useDrop({
    ref,
    onDrop(drag) {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        OngoingDrag.setData(drag, dropZoneCenter, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
    },
  })

  return (
    <div
      data-testid="dropzone"
      {...dropZone.props}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 200,
        borderRadius: 10,
        color: "white",
        backgroundColor: dropZone.isDraggingOver ? "#7e8c9b" : "slategray",
      }}
    >
      Drop Here
    </div>
  )
}
