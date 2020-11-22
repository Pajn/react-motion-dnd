export function createEventController() {
  const subscribers = [];
  return {
    subscribe(cb) {
      subscribers.push(cb);
      return () => {
        const index = subscribers.indexOf(cb);
        if (index >= 0) {
          subscribers.splice(index, 1);
        }
      };
    },
    fire(event) {
      for (const subscriber of subscribers) {
        subscriber(event);
      }
    }
  };
}
