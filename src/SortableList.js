import __SNOWPACK_ENV__ from '../__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

import move from "../web_modules/array-move.js";
import {motion} from "../web_modules/framer-motion.js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "../web_modules/react.js";
import {dndContext, OngoingDrag} from "./context.js";
import {createDragType} from "./dragType.js";
import {getBoundingClientRectIgnoringTransforms} from "./geometry.js";
import {pointerOffset, useDrag as useDrag2} from "./useDrag.js";
import {useDrop as useDrop2} from "./useDrop.js";
import {createSequence} from "./util.js";
const buffer = 5;
const findIndex = (i, info, pointerOffset2, positions) => {
  let target = i;
  const {top, bottom} = positions[i];
  const yOffset = info.point.y - top - (pointerOffset2?.top ?? 0);
  if (yOffset > 0) {
    const nextItem = positions[i + 1];
    if (nextItem === void 0)
      return i;
    const swapOffset = Math.abs(bottom - (nextItem.top + nextItem.height / 2)) + buffer;
    if (yOffset > swapOffset)
      target = i + 1;
  } else if (yOffset < 0) {
    const prevItem = positions[i - 1];
    if (prevItem === void 0)
      return i;
    const prevBottom = prevItem.top + prevItem.height;
    const swapOffset = Math.abs(top - (prevBottom - prevItem.height / 2)) + buffer;
    if (yOffset < -swapOffset)
      target = i - 1;
  }
  return target;
};
const sortableListContext = createContext(void 0);
const listItemContext = createContext(void 0);
const listInfo = createDragType("list-info");
const useListId = createSequence();
const spacerKey = {};
export const SortableList = (props) => {
  const {
    items,
    moveItem,
    renderItem,
    itemType,
    mapToDragType,
    addItem,
    removeItem,
    component,
    style,
    ...otherProps
  } = props;
  const listId = useListId();
  const context2 = useContext(dndContext);
  const [deletedItem, setDeletedItem] = useState();
  const [workingItems, setWorkingItems] = useState();
  const [controller] = useState(() => ({
    props,
    deletedItem,
    positions: new WeakMap(),
    workingItemToPosition: (item) => controller.positions.get(item.type === "item" ? item.item : spacerKey)
  }));
  const drop = useDrop2({
    onItemEntered(drag, panInfo) {
      const dragInfo = OngoingDrag.getData(drag, listInfo);
      const dragItem = itemType && OngoingDrag.getData(drag, itemType);
      if (dragInfo !== void 0 && dragItem !== void 0) {
        OngoingDrag.setData(drag, listInfo, {
          ...dragInfo,
          currentListId: listId
        });
        if (dragInfo.startListId === listId && deletedItem?.startIndex === dragInfo.startIndex) {
          setDeletedItem(void 0);
        } else if (dragInfo.startListId !== listId) {
          let insertIndex = items.flatMap((item) => controller.positions.get(item)).findIndex((p) => {
            const middleY = p.top + p.height / 2;
            return middleY > panInfo.point.y;
          });
          if (insertIndex < 0) {
            insertIndex = items.length;
          }
          setWorkingItems((workingItems2) => {
            workingItems2 = [...workingItems2];
            workingItems2.splice(insertIndex, 0, {
              type: "spacer",
              dragItem,
              size: dragInfo.size
            });
            return workingItems2;
          });
        }
      }
    },
    onItemLeft(drag) {
      const dragInfo = OngoingDrag.getData(drag, listInfo);
      const dragItem = itemType && OngoingDrag.getData(drag, itemType);
      if (dragItem !== void 0 && dragInfo?.startListId === listId) {
        setDeletedItem({
          startIndex: dragInfo.startIndex,
          listItem: dragInfo.item,
          dragItem
        });
      } else if (dragInfo !== void 0) {
        setWorkingItems((workingItems2) => workingItems2?.filter((item) => !(item.type === "spacer" && item.dragItem === dragItem)));
      }
    },
    onDragMoveOver(drag, panInfo) {
      const dragInfo = OngoingDrag.getData(drag, listInfo);
      const dragItem = itemType && OngoingDrag.getData(drag, itemType);
      if (dragInfo?.currentListId === listId) {
        const offset = OngoingDrag.getData(drag, pointerOffset);
        const itemIndex = workingItems?.findIndex((item) => item.type === "item" && item.item === dragInfo.item || item.type === "spacer" && item.dragItem === dragItem) ?? -1;
        if (itemIndex >= 0) {
          const targetIndex = findIndex(itemIndex, panInfo, offset, workingItems.map(controller.workingItemToPosition));
          if (targetIndex !== itemIndex) {
            setWorkingItems((workingItems2) => move(workingItems2, itemIndex, targetIndex));
          }
        }
      }
    },
    onDrop(drag, panInfo) {
      const dragInfo = OngoingDrag.getData(drag, listInfo);
      const dragItem = itemType && OngoingDrag.getData(drag, itemType);
      if (dragInfo !== void 0) {
        const offset = OngoingDrag.getData(drag, pointerOffset);
        const itemIndex = workingItems?.findIndex((item) => item.type === "item" && item.item === dragInfo.item || item.type === "spacer" && item.dragItem === dragItem) ?? -1;
        if (itemIndex >= 0) {
          const targetIndex = findIndex(itemIndex, panInfo, offset, workingItems.map(controller.workingItemToPosition));
          if (dragInfo.startListId === listId) {
            if (dragInfo.startIndex !== targetIndex) {
              moveItem(dragInfo.startIndex, targetIndex, dragInfo.item);
            }
          } else if (dragItem !== void 0) {
            addItem?.(dragItem, targetIndex);
          }
        }
      }
    }
  });
  useEffect(() => {
    controller.props = props;
    controller.deletedItem = deletedItem;
  });
  useEffect(() => {
    return context2.dragStart.subscribe((drag) => {
      setWorkingItems(items.map((item, index) => ({
        type: "item",
        item,
        startIndex: index
      })));
      drag.dragEnd.subscribe(() => {
        if (controller.deletedItem) {
          controller.props.removeItem?.(controller.deletedItem.dragItem, controller.deletedItem.startIndex);
        }
        setDeletedItem(void 0);
        setWorkingItems(void 0);
      });
    });
  }, [items]);
  const List = component || motion.ol;
  function renderItemWithContexts(item, index) {
    const rendered = renderItem({
      item,
      index
    });
    return /* @__PURE__ */ React.createElement(listItemContext.Provider, {
      value: {item, index},
      key: rendered.key
    }, rendered);
  }
  const children = workingItems === void 0 ? items.map(renderItemWithContexts) : workingItems.filter((item) => !(item.type === "item" && item.startIndex === deletedItem?.startIndex)).map((item, index) => item.type === "spacer" ? /* @__PURE__ */ React.createElement(Spacer, {
    key: "__spacer__",
    size: item.size
  }) : renderItemWithContexts(item.item, index));
  if (deletedItem !== void 0) {
    children.push(renderItemWithContexts(deletedItem.listItem, -1));
  }
  return /* @__PURE__ */ React.createElement(sortableListContext.Provider, {
    value: {
      listId,
      setPosition(item, rect) {
        controller.positions.set(item, rect);
      },
      dragType: itemType,
      mapToDragType
    }
  }, /* @__PURE__ */ React.createElement(List, {
    ...otherProps,
    ...drop.props,
    style: {
      padding: 0,
      ...style
    }
  }, children));
};
const Spacer = (props) => {
  const ref = useRef(null);
  const context2 = useContext(sortableListContext);
  useLayoutEffect(() => {
    if (ref.current !== null) {
      context2.setPosition(spacerKey, getBoundingClientRectIgnoringTransforms(ref.current));
    }
  });
  return /* @__PURE__ */ React.createElement("div", {
    ref,
    style: {
      width: props.size.width,
      height: props.size.height
    }
  });
};
export function useSortabeListItem() {
  const listContext = useContext(sortableListContext);
  const {item, index} = useContext(listItemContext);
  const ref = useRef(null);
  const dragItem = useDrag2({
    onDragStart(drag) {
      if (ref.current !== null) {
        const rect = getBoundingClientRectIgnoringTransforms(ref.current);
        OngoingDrag.setData(drag, listInfo, {
          startListId: listContext.listId,
          currentListId: listContext.listId,
          item,
          startIndex: index,
          size: rect
        });
        if (listContext.dragType) {
          OngoingDrag.setData(drag, listContext.dragType, listContext.mapToDragType ? listContext.mapToDragType(item) : item);
        }
      }
    }
  });
  useLayoutEffect(() => {
    if (index >= 0 && ref.current !== null) {
      listContext.setPosition(item, getBoundingClientRectIgnoringTransforms(ref.current));
    }
  });
  const refCallback = useCallback((e) => {
    ref.current = e;
  }, []);
  const props = {
    ...dragItem.props,
    ref: refCallback,
    style: index === -1 ? {position: "absolute", top: 0} : void 0
  };
  return {...dragItem, props};
}
if (import.meta.hot) {
  import.meta.hot.decline();
}
