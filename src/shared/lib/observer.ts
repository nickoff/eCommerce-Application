type EventListener<T> = (payload: T) => void;

export default class Observer<EventMap extends Record<string, unknown>> {
  protected eventListeners: {
    [K in keyof EventMap]?: EventListener<EventMap[K]>[];
  } = {};

  public on<K extends keyof EventMap>(eventName: K, listener: EventListener<EventMap[K]>): void {
    const listeners = this.eventListeners[eventName] ?? [];
    listeners.push(listener);
    this.eventListeners[eventName] = listeners;
  }

  public off<K extends keyof EventMap>(eventName: K, listener: EventListener<EventMap[K]>): void {
    const listeners = this.eventListeners[eventName] ?? [];
    this.eventListeners[eventName] = listeners.filter((cb) => cb !== listener);
  }

  public emit<K extends keyof EventMap>(eventName: K, payload: EventMap[K]): void {
    const listeners = this.eventListeners[eventName] ?? [];
    listeners.forEach((l) => l(payload));
  }
}
