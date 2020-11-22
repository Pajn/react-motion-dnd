import {DndProvider, SortableList, useSortabeListItem} from "../src/index.js";
import move from "../web_modules/array-move.js";
import {motion} from "../web_modules/framer-motion.js";
import React, {useState} from "../web_modules/react.js";
import {ExampleContainer} from "./lib/ExmpleContainer.js";
export default () => {
  const [items, setItems] = useState([
    {id: 0, color: "#FF008C", height: 60},
    {id: 1, color: "#D309E1", height: 80},
    {id: 2, color: "#9C1AFF", height: 40},
    {id: 3, color: "#7700FF", height: 100}
  ]);
  return /* @__PURE__ */ React.createElement(DndProvider, null, /* @__PURE__ */ React.createElement(ExampleContainer, null, /* @__PURE__ */ React.createElement(SortableList, {
    items,
    moveItem: (from, to) => setItems((items2) => move(items2, from, to)),
    renderItem: ({item}) => /* @__PURE__ */ React.createElement(ListItem, {
      key: item.id,
      item
    }),
    style: {padding: "100px 0"}
  })));
};
const ListItem = (props) => {
  const listItem = useSortabeListItem();
  return /* @__PURE__ */ React.createElement(motion.li, {
    "data-testid": `item-${props.item.id}`,
    layout: true,
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
