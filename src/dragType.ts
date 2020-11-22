/**
 * @beta
 */
export interface DragType<_T> {
  name?: string
}

/**
 * @beta
 */
export function createDragType<T>(name?: string): DragType<T> {
  return { name }
}
