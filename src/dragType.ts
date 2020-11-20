export interface DragType<_T> {
  name?: string
}
export function createDragType<T>(name?: string): DragType<T> {
  return { name }
}
export type DragTypeData<T extends DragType<unknown>> = T extends DragType<
  infer Data
>
  ? Data
  : never

export interface DragData<T> {
  type: DragType<T>
  data: T
}
