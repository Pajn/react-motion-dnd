import { useRef } from "react"

export function assertType<T>(value: T) {
  return value
}

export function createSequence() {
  let nextId = 1

  return function useId() {
    const id = useRef<number>()
    if (id.current === undefined) {
      id.current = nextId
      nextId += 1
    }
    return id.current
  }
}
