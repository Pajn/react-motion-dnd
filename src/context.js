import React, {createContext, useState} from "../web_modules/react.js";
import {createEventController} from "./events.js";
export const dndContext = createContext(void 0);
export const DndProvider = (props) => {
  const [context] = useState(() => ({
    dragStart: createEventController()
  }));
  return /* @__PURE__ */ React.createElement(dndContext.Provider, {
    value: context
  }, props.children);
};
export const OngoingDrag = {
  create(startPoint) {
    return {
      startPoint,
      data: new Map(),
      dragMove: createEventController(),
      dragEnd: createEventController(),
      enteredDropZone: createEventController(),
      leftDropZone: createEventController(),
      droppedInDropZone: createEventController()
    };
  },
  getData(self, type) {
    return self.data.get(type);
  },
  setData(self, type, data) {
    self.data.set(type, data);
  }
};
