import {useContext, useEffect, useRef, useState} from "../web_modules/react.js";
import {dndContext, OngoingDrag} from "./context.js";
import {createDragType} from "./dragType.js";
import {getBoundingClientRectIgnoringTransforms} from "./geometry.js";
export const pointerOffset = createDragType("pointer-offset");
const dragConstraintsBounceBack = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};
export function useDrag(options) {
  const context2 = useContext(dndContext);
  const [, rerender] = useState();
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });
  const [controller] = useState(() => ({
    isMounted: true,
    ongoingDrag: void 0,
    inDragZone: false,
    isLifted: false,
    onDragStart(event, info) {
      const ongoingDrag = OngoingDrag.create(info);
      const rect = getBoundingClientRectIgnoringTransforms(event.target);
      OngoingDrag.setData(ongoingDrag, pointerOffset, {
        top: info.point.y - rect.top,
        left: info.point.x - rect.left
      });
      controller.ongoingDrag = ongoingDrag;
      controller.isLifted = true;
      ongoingDrag.enteredDropZone.subscribe(() => {
        controller.inDragZone = true;
      });
      ongoingDrag.leftDropZone.subscribe(() => {
        controller.inDragZone = false;
      });
      ongoingDrag.droppedInDropZone.subscribe(() => {
        optionsRef.current?.onDragDropped?.(ongoingDrag);
      });
      context2.dragStart.fire(ongoingDrag);
      optionsRef.current?.onDragStart?.(ongoingDrag, info);
      rerender({});
    },
    onDragMove(_event, info) {
      controller.ongoingDrag.dragMove.fire(info);
      optionsRef.current?.onDragMove?.(controller.ongoingDrag, info);
    },
    onDragEnd(_event, info) {
      controller.ongoingDrag.dragEnd.fire(info);
      controller.ongoingDrag = void 0;
      optionsRef.current?.onDragEnd?.(controller.ongoingDrag, info);
      if (controller.inDragZone) {
        controller.inDragZone = false;
      } else {
        optionsRef.current?.onDragCancel?.(controller.ongoingDrag);
      }
      if (controller.isMounted) {
        rerender({});
      }
    },
    onLayoutAnimationComplete() {
      console.log("onLayoutAnimationComplete");
      controller.isLifted = false;
      if (controller.isMounted) {
        rerender({});
      }
    }
  }));
  useEffect(() => {
    return () => {
      controller.isMounted = false;
    };
  }, []);
  const props = {
    drag: true,
    dragConstraints: dragConstraintsBounceBack,
    dragMomentum: false,
    dragElastic: 1,
    onDragStart: controller.onDragStart,
    onDrag: controller.ongoingDrag === void 0 ? void 0 : controller.onDragMove,
    onDragEnd: controller.ongoingDrag === void 0 ? void 0 : controller.onDragEnd,
    onLayoutAnimationComplete: controller.isLifted && controller.ongoingDrag === void 0 ? controller.onLayoutAnimationComplete : void 0
  };
  return {
    isDragging: controller.ongoingDrag !== void 0,
    isLifted: controller.isLifted,
    props
  };
}
