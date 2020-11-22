import move from "array-move"
import type * as framerMotion from "framer-motion"
import { motion } from "framer-motion"
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { dndContext, OngoingDrag } from "./context"
import { createDragType, DragType } from "./dragType"
import { getBoundingClientRectIgnoringTransforms } from "./geometry"
import { pointerOffset, useDrag } from "./useDrag"
import { useDrop } from "./useDrop"
import { createSequence } from "./util"

interface Position {
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
}

// Prevent rapid reverse swapping
const buffer = 5

const findIndex = (
  i: number,
  info: framerMotion.PanInfo,
  pointerOffset: { top: number; left: number } | undefined,
  positions: Array<Position>,
) => {
  let target = i
  const { top, bottom } = positions[i]
  const yOffset = info.point.y - top - (pointerOffset?.top ?? 0)

  // If moving down
  if (yOffset > 0) {
    const nextItem = positions[i + 1]
    if (nextItem === undefined) return i

    const swapOffset =
      Math.abs(bottom - (nextItem.top + nextItem.height / 2)) + buffer
    if (yOffset > swapOffset) target = i + 1

    // If moving up
  } else if (yOffset < 0) {
    const prevItem = positions[i - 1]
    if (prevItem === undefined) return i

    const prevBottom = prevItem.top + prevItem.height
    const swapOffset =
      Math.abs(top - (prevBottom - prevItem.height / 2)) + buffer
    if (yOffset < -swapOffset) target = i - 1
  }

  return target
}

const sortableListContext = createContext<{
  listId: number
  setPosition(_item: unknown, _rect: Position): void
  dragType: DragType<unknown> | undefined
  mapToDragType: ((_item: unknown) => unknown) | undefined
}>(undefined as any)
const listItemContext = createContext<{ item: unknown; index: number }>(
  undefined as any,
)

type Size = { width: number; height: number }
type ListInfo = {
  startListId: number
  currentListId: number
  item: unknown
  startIndex: number
  size: Size
}
const listInfo = createDragType<ListInfo>("list-info")

const useListId = createSequence()
const spacerKey = {}

/**
 * @beta
 */
export type SortableListProps<T, U, C> = {
  items: Array<T>
  moveItem: (fromIndex: number, toIndex: number, item: T) => void
  renderItem: (params: { item: T; index: number }) => ReactElement

  component?: C

  itemType?: DragType<U>
  mapToDragType?: (item: T) => U
  addItem?: (item: U, toIndex: number) => void
  removeItem?: (item: U, fromIndex: number) => void
}

/**
 * @beta
 */
export const SortableList = <
  T extends object,
  U extends object = never,
  C extends React.ComponentType<framerMotion.MotionProps> = typeof motion.ol
>(
  props: SortableListProps<T, U, C> &
    Omit<
      React.ComponentPropsWithRef<C>,
      keyof SortableListProps<any, any, any>
    >,
) => {
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
  } = props

  const listId = useListId()
  const context = useContext(dndContext)
  const [deletedItem, setDeletedItem] = useState<
    { listItem: T; dragItem: U; startIndex: number } | undefined
  >()

  type WorkingItem =
    | { type: "item"; item: T; startIndex: number }
    | { type: "spacer"; dragItem: U; size: Size }
  const [workingItems, setWorkingItems] = useState<
    Array<WorkingItem> | undefined
  >()

  const [controller] = useState(() => ({
    props,
    deletedItem,
    positions: new WeakMap<T | typeof spacerKey, Position>(),
    workingItemToPosition: (item: WorkingItem) =>
      controller.positions.get(item.type === "item" ? item.item : spacerKey)!,
  }))

  const drop = useDrop({
    onItemEntered(drag, panInfo) {
      const dragInfo = OngoingDrag.getData(drag, listInfo)
      const dragItem = itemType && OngoingDrag.getData(drag, itemType)

      if (dragInfo !== undefined && dragItem !== undefined) {
        OngoingDrag.setData(drag, listInfo, {
          ...dragInfo,
          currentListId: listId,
        })
        if (
          dragInfo.startListId === listId &&
          deletedItem?.startIndex === dragInfo.startIndex
        ) {
          setDeletedItem(undefined)
        } else if (dragInfo.startListId !== listId) {
          let insertIndex = items
            .flatMap((item) => controller.positions.get(item)!)
            .findIndex((p) => {
              const middleY = p.top + p.height / 2
              return middleY > panInfo.point.y
            })
          if (insertIndex < 0) {
            insertIndex = items.length
          }
          setWorkingItems((workingItems) => {
            workingItems = [...workingItems!]
            workingItems.splice(insertIndex, 0, {
              type: "spacer",
              dragItem,
              size: dragInfo.size,
            })
            return workingItems
          })
        }
      }
    },
    onItemLeft(drag) {
      const dragInfo = OngoingDrag.getData(drag, listInfo)
      const dragItem = itemType && OngoingDrag.getData(drag, itemType)

      if (dragItem !== undefined && dragInfo?.startListId === listId) {
        setDeletedItem({
          startIndex: dragInfo.startIndex,
          listItem: dragInfo.item as T,
          dragItem: dragItem,
        })
      } else if (dragInfo !== undefined) {
        setWorkingItems((workingItems) =>
          workingItems?.filter(
            (item) => !(item.type === "spacer" && item.dragItem === dragItem),
          ),
        )
      }
    },
    onDragMoveOver(drag, panInfo) {
      const dragInfo = OngoingDrag.getData(drag, listInfo)
      const dragItem = itemType && OngoingDrag.getData(drag, itemType)

      if (dragInfo?.currentListId === listId) {
        const offset = OngoingDrag.getData(drag, pointerOffset)
        const itemIndex =
          workingItems?.findIndex(
            (item) =>
              (item.type === "item" && item.item === dragInfo.item) ||
              (item.type === "spacer" && item.dragItem === dragItem),
          ) ?? -1
        if (itemIndex >= 0) {
          const targetIndex = findIndex(
            itemIndex,
            panInfo,
            offset,
            workingItems!.map(controller.workingItemToPosition),
          )
          if (targetIndex !== itemIndex) {
            setWorkingItems((workingItems) =>
              move(workingItems!, itemIndex, targetIndex),
            )
          }
        }
      }
    },
    onDrop(drag, panInfo) {
      const dragInfo = OngoingDrag.getData(drag, listInfo)
      const dragItem = itemType && OngoingDrag.getData(drag, itemType)

      if (dragInfo !== undefined) {
        const offset = OngoingDrag.getData(drag, pointerOffset)
        const itemIndex =
          workingItems?.findIndex(
            (item) =>
              (item.type === "item" && item.item === dragInfo.item) ||
              (item.type === "spacer" && item.dragItem === dragItem),
          ) ?? -1
        if (itemIndex >= 0) {
          const targetIndex = findIndex(
            itemIndex,
            panInfo,
            offset,
            workingItems!.map(controller.workingItemToPosition),
          )
          if (dragInfo.startListId === listId) {
            if (dragInfo.startIndex !== targetIndex) {
              moveItem(dragInfo.startIndex, targetIndex, dragInfo.item as T)
            }
          } else if (dragItem !== undefined) {
            addItem?.(dragItem, targetIndex)
          }
        }
      }
    },
  })

  useEffect(() => {
    controller.props = props
    controller.deletedItem = deletedItem
  })

  useEffect(() => {
    return context.dragStart.subscribe((drag) => {
      setWorkingItems(
        items.map((item, index) => ({
          type: "item",
          item,
          startIndex: index,
        })),
      )

      drag.dragEnd.subscribe(() => {
        if (controller.deletedItem) {
          controller.props.removeItem?.(
            controller.deletedItem.dragItem,
            controller.deletedItem.startIndex,
          )
        }
        setDeletedItem(undefined)
        setWorkingItems(undefined)
      })
    })
  }, [items])

  const List = component || motion.ol

  function renderItemWithContexts(item: T, index: number) {
    const rendered = renderItem({
      item,
      index,
    })
    return (
      <listItemContext.Provider value={{ item, index }} key={rendered.key}>
        {rendered}
      </listItemContext.Provider>
    )
  }

  const children =
    workingItems === undefined
      ? items.map(renderItemWithContexts)
      : workingItems
          .filter(
            (item) =>
              !(
                item.type === "item" &&
                item.startIndex === deletedItem?.startIndex
              ),
          )
          .map((item, index) =>
            item.type === "spacer" ? (
              <Spacer key="__spacer__" size={item.size} />
            ) : (
              renderItemWithContexts(item.item, index)
            ),
          )

  if (deletedItem !== undefined) {
    children.push(renderItemWithContexts(deletedItem.listItem, -1))
  }

  return (
    <sortableListContext.Provider
      value={{
        listId,
        setPosition(item, rect) {
          controller.positions.set(item as T, rect)
        },
        dragType: itemType,
        mapToDragType: mapToDragType as (_item: unknown) => unknown,
      }}
    >
      <List
        {...(otherProps as any)}
        {...drop.props}
        style={{
          padding: 0,
          ...style,
        }}
      >
        {children}
      </List>
    </sortableListContext.Provider>
  )
}

const Spacer = (props: { size: Size }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const context = useContext(sortableListContext)
  useLayoutEffect(() => {
    if (ref.current !== null) {
      context.setPosition(
        spacerKey,
        getBoundingClientRectIgnoringTransforms(ref.current),
      )
    }
  })

  return (
    <div
      ref={ref}
      style={{
        width: props.size.width,
        height: props.size.height,
      }}
    />
  )
}

/**
 * @beta
 */
export function useSortabeListItem() {
  const listContext = useContext(sortableListContext)
  const { item, index } = useContext(listItemContext)
  const ref = useRef<HTMLElement | null>(null)
  const dragItem = useDrag({
    onDragStart(drag) {
      if (ref.current !== null) {
        const rect = getBoundingClientRectIgnoringTransforms(ref.current)
        OngoingDrag.setData(drag, listInfo, {
          startListId: listContext.listId,
          currentListId: listContext.listId,
          item,
          startIndex: index,
          size: rect,
        })
        if (listContext.dragType) {
          OngoingDrag.setData(
            drag,
            listContext.dragType,
            listContext.mapToDragType ? listContext.mapToDragType(item) : item,
          )
        }
      }
    },
  })

  useLayoutEffect(() => {
    if (index >= 0 && ref.current !== null) {
      listContext.setPosition(
        item,
        getBoundingClientRectIgnoringTransforms(ref.current),
      )
    }
  })

  const refCallback = useCallback((e: HTMLElement | null) => {
    ref.current = e
  }, [])

  const props = {
    ...dragItem.props,
    ref: refCallback,
    style:
      index === -1 ? ({ position: "absolute", top: 0 } as const) : undefined,
  }

  return { ...dragItem, props }
}

if (import.meta.hot) {
  import.meta.hot.decline()
}
