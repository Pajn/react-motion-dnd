import {useRef} from "../web_modules/react.js";
export function assertType(value) {
  return value;
}
export function createSequence() {
  let nextId = 1;
  return function useId() {
    const id = useRef();
    if (id.current === void 0) {
      id.current = nextId;
      nextId += 1;
    }
    return id.current;
  };
}
