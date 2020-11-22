import {
  createDragType,
  DndProvider,
  SortableList,
  useSortabeListItem
} from "../src/index.js";
import move from "../web_modules/array-move.js";
import {AnimateSharedLayout, motion} from "../web_modules/framer-motion.js";
import React, {useState} from "../web_modules/react.js";
import {ExampleContainer} from "./lib/ExmpleContainer.js";
const dragItemType = createDragType();
function moveBetweenLists(oldUpdater, newUpdater, item, newIndex) {
  oldUpdater((items) => items.filter((i) => i !== item));
  newUpdater((items) => {
    items = [...items];
    items.splice(newIndex, 0, item);
    return items;
  });
}
export default () => {
  const [itemsLeft, setItemsLeft] = useState([
    {id: 0, color: "#FF008C", height: 60},
    {id: 1, color: "#D309E1", height: 80},
    {id: 2, color: "#9C1AFF", height: 40},
    {id: 3, color: "#7700FF", height: 100}
  ]);
  const [itemsRight, setItemsRight] = useState([
    {id: 4, color: "#00FF1E", height: 60},
    {id: 5, color: "#60E109", height: 80},
    {id: 6, color: "#C9FF1A", height: 40},
    {id: 7, color: "#DDFF00", height: 100}
  ]);
  return /* @__PURE__ */ React.createElement(DndProvider, null, /* @__PURE__ */ React.createElement(AnimateSharedLayout, null, /* @__PURE__ */ React.createElement(ExampleContainer, {
    columns: 2,
    style: {gap: 0}
  }, /* @__PURE__ */ React.createElement(SortableList, {
    "data-testid": "list-left",
    layout: true,
    itemType: dragItemType,
    items: itemsLeft,
    moveItem: (from, to) => setItemsLeft((items) => move(items, from, to)),
    addItem: (item, index) => moveBetweenLists(setItemsRight, setItemsLeft, item, index),
    renderItem: ({item}) => /* @__PURE__ */ React.createElement(ListItem, {
      key: item.id,
      item
    }),
    style: {padding: 50}
  }), /* @__PURE__ */ React.createElement(SortableList, {
    "data-testid": "list-right",
    layout: true,
    itemType: dragItemType,
    items: itemsRight,
    moveItem: (from, to) => setItemsRight((items) => move(items, from, to)),
    addItem: (item, index) => moveBetweenLists(setItemsLeft, setItemsRight, item, index),
    renderItem: ({item}) => /* @__PURE__ */ React.createElement(ListItem, {
      key: item.id,
      item
    }),
    style: {padding: 50}
  }))));
};
const ListItem = (props) => {
  const listItem = useSortabeListItem();
  return /* @__PURE__ */ React.createElement(motion.li, {
    "data-testid": `item-${props.item.id}`,
    layout: true,
    layoutId: `item-${props.item.id}`,
    ...listItem.props,
    initial: false,
    animate: listItem.isDragging ? {scale: 1.12} : {scale: 1},
    style: {
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
      zIndex: listItem.isDragging ? 2 : listItem.isLifted ? 1 : 0
    }
  });
};
