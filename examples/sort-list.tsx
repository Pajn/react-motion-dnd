import { DndProvider, SortableList, useSortabeListItem } from "@lib/index"
import move from "array-move"
import { motion } from "framer-motion"
import React, { useState } from "react"
import { ExampleContainer } from "./lib/ExmpleContainer"

type Item = { id: number; color: string; height: number }

export default () => {
  const [items, setItems] = useState([
    { id: 0, color: "#FF008C", height: 60 },
    { id: 1, color: "#D309E1", height: 80 },
    { id: 2, color: "#9C1AFF", height: 40 },
    { id: 3, color: "#7700FF", height: 100 },
  ])

  return (
    <DndProvider>
      <ExampleContainer>
        <SortableList
          items={items}
          moveItem={(from, to) => setItems((items) => move(items, from, to))}
          renderItem={({ item }) => <ListItem key={item.id} item={item} />}
          style={{ padding: "100px 0" }}
        />
      </ExampleContainer>
    </DndProvider>
  )
}

const ListItem = (props: { item: Item }) => {
  const listItem = useSortabeListItem()

  return (
    <motion.li
      data-testid={`item-${props.item.id}`}
      layout
      {...listItem.props}
      initial={false}
      animate={listItem.isDragging ? { scale: 1.12 } : { scale: 1 }}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        width: 300,
        height: props.item.height,
        borderRadius: 10,
        color: "white",
        backgroundColor: props.item.color,
        zIndex: listItem.isDragging ? 2 : listItem.isLifted ? 1 : 0,
      }}
    />
  )
}
