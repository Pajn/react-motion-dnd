import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "../web_modules/react.js";
import {dndContext} from "./context.js";
import {pointInsideRectangle} from "./geometry.js";
export function useDrop(options) {
  const context2 = useContext(dndContext);
  const [, rerender] = useState();
  const [controller] = useState(() => ({
    state: {
      element: null,
      isDraggingOver: false,
      position: void 0
    },
    updatePosition() {
      controller.state.position = controller.state.element?.getBoundingClientRect();
      return controller.state.position;
    }
  }));
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const refCallback = useCallback((e) => {
    controller.state.element = e;
    if (optionsRef.current?.ref) {
      optionsRef.current.ref.current = e;
    }
  }, []);
  useEffect(() => {
    return context2.dragStart.subscribe((drag) => {
      const position = controller.updatePosition();
      if (position !== void 0) {
        function updateDraggingOver(inside, info) {
          const didChange = inside !== controller.state.isDraggingOver;
          controller.state.isDraggingOver = inside;
          if (didChange) {
            if (inside) {
              drag.enteredDropZone.fire();
              optionsRef.current?.onItemEntered?.(drag, info);
              rerender({});
            } else {
              drag.leftDropZone.fire();
              optionsRef.current?.onItemLeft?.(drag, info);
              rerender({});
            }
          }
        }
        const startedInside = pointInsideRectangle(position, drag.startPoint.point);
        setTimeout(() => {
          updateDraggingOver(startedInside, drag.startPoint);
        });
        drag.dragMove.subscribe((info) => {
          const inside = pointInsideRectangle(position, info.point);
          updateDraggingOver(inside, info);
          if (inside) {
            optionsRef.current?.onDragMoveOver?.(drag, info);
          }
        });
        drag.dragEnd.subscribe((info) => {
          const inside = pointInsideRectangle(position, info.point);
          updateDraggingOver(inside, info);
          controller.state.isDraggingOver = false;
          if (inside) {
            optionsRef.current?.onDrop?.(drag, info);
            drag.droppedInDropZone.fire();
          }
        });
      }
    });
  }, []);
  const props = {
    ref: refCallback
  };
  return {isDraggingOver: controller.state.isDraggingOver, props};
}
