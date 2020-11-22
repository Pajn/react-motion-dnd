import {
  createDragType,
  DndProvider,
  OngoingDrag,
  useDrag,
  useDrop
} from "../src/index.js";
import {motion, useAnimation} from "../web_modules/framer-motion.js";
import React, {useRef, useState} from "../web_modules/react.js";
import {ExampleContainer} from "./lib/ExmpleContainer.js";
const dropZoneCenter = createDragType();
export default () => {
  const [message, setMessage] = useState("");
  return /* @__PURE__ */ React.createElement(DndProvider, null, /* @__PURE__ */ React.createElement(ExampleContainer, {
    columns: 2
  }, /* @__PURE__ */ React.createElement(DragItem, {
    setMessage
  }), /* @__PURE__ */ React.createElement(DropZone, {
    setMessage
  }), /* @__PURE__ */ React.createElement("div", {
    "data-testid": "message",
    style: {gridColumn: "span 2", height: 30}
  }, message)));
};
const DragItem = (props) => {
  const animationControlls = useAnimation();
  const ref = useRef(null);
  const dragItem = useDrag({
    onDragStart() {
      animationControlls.start({scale: 1.12});
    },
    onDragEnd() {
      animationControlls.start({scale: 1});
    },
    onDragDropped(drag) {
      props.setMessage("Dropped in dropzone");
      const point = OngoingDrag.getData(drag, dropZoneCenter);
      if (point && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        animationControlls.start({
          x: point.x - rect.left - rect.width / 2,
          y: point.y - rect.top - rect.height / 2
        });
      }
    },
    onDragCancel() {
      props.setMessage("Dropped outside");
    }
  });
  return /* @__PURE__ */ React.createElement(motion.div, {
    "data-testid": "dragitem",
    ref,
    ...dragItem.props,
    initial: false,
    animate: animationControlls,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 100,
      height: 100,
      borderRadius: 10,
      color: "white",
      backgroundColor: "hotpink"
    }
  }, "Drag me");
};
const DropZone = (props) => {
  const ref = useRef(null);
  const dropZone = useDrop({
    ref,
    onDrop(drag) {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        OngoingDrag.setData(drag, dropZoneCenter, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    }
  });
  return /* @__PURE__ */ React.createElement("div", {
    "data-testid": "dropzone",
    ...dropZone.props,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 200,
      height: 200,
      borderRadius: 10,
      color: "white",
      backgroundColor: dropZone.isDraggingOver ? "#7e8c9b" : "slategray"
    }
  }, "Drop Here");
};
