/**
 * @beta
 */
export type Unsubscribe = () => void

/**
 * @beta
 */
export type EventController<T> = {
  subscribe: (cb: (event: T) => void) => Unsubscribe
  fire: (event: T) => void
}

/** @internal */
export function createEventController<T>(): EventController<T> {
  const subscribers: Array<(event: T) => void> = []

  return {
    subscribe(cb) {
      subscribers.push(cb)
      return () => {
        const index = subscribers.indexOf(cb)
        if (index >= 0) {
          subscribers.splice(index, 1)
        }
      }
    },
    fire(event) {
      for (const subscriber of subscribers) {
        subscriber(event)
      }
    },
  }
}
