// Simple Event Emitter implementation
// Mostly written by github copilot
// Can probably be replaced by a more standard library if required

export class EventEmitter {
  events: Map<string, Function[]> = new Map();

  on(event: string, fn: EventListener) {
    if(!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    if(!this.events.has(event)) {
      return;
    }
    this.events.get(event).splice(this.events.get(event).indexOf(fn), 1);
  }

  emit(event, ...data) {
    if(!this.events.has(event)) {
      return;
    }
    this.events.get(event).forEach(fn => fn(...data));
  }
}
