/**
 * This module contains Class to create a tree of events. Since we don't have a dom tree we creaete a synthetic tree that allows subscribing to events
 * along a path in the tree. When an Event is triggered on a path, it will "bubble" up the tree until it reaches the root. All events bubble up the tree.
 * We cannot use native event emmitters because we cannot overwrite the `event.target` property and we need to know the listener count to manage subscriptions.
 *
 * ## Subscriptions
 * We can utilize the event tree to manage subscriptions to the relay(s). When listeners are added and removed an event is emitted on the root node's `meta` event emmiter.
 * This event contains an array of `SubscriptionUpdate` objects that describe the changes to the subscriptions.
 * `SubscriptionUpdate`s are aware of the path in the tree where the subscription was added or removed and will not emit events for children nodes if the parent node has a subscription.
 * @module
 */
import jsonpointer from "npm:@sagold/json-pointer";

/** A callback function that gets called when an event is emitted */
export type EventListener<T> = (
  event: T,
  source: EventEmmiter<T> | object,
) => void;

/** Used to express changes to which part of the tree is needs a subscription to */
export interface SubscriptionUpdate {
  /** Whether to add a subscription or remove a subscription */
  subscribe: boolean;
  /** the path on the object tree to subscribe/unsubscribe */
  path: string;
}

/**
 * A very simple class that emits events
 * @template T the type of the event
 */
export class EventEmmiter<T> {
  /** A map of listeners */
  listeners = new Set<EventListener<T>>();

  /** registers a callback to listen to events */
  on(listener: EventListener<T>) {
    this.listeners.add(listener);
  }

  /** removes a callback  */
  off(listener: EventListener<T>) {
    this.listeners.delete(listener);
  }

  /** emits an event  */
  emit(event: T, source: object = this) {
    this.listeners.forEach((listener) => {
      listener(event, source);
    });
  }
}

/**
 * This class dispatch's an event and bubbles that event up the tree
 * @template T the type of the event
 */
export default class EventTree<T> {
  #edges = {} as Record<string, EventTree<T>>;
  /** The event emmiter for this node */
  readonly emmiter = new EventEmmiter<T>();
  /** The event emmiter for the meta events, this only works on the root node of the tree */
  readonly meta = new EventEmmiter<SubscriptionUpdate[]>();
  /** create a new instance of the Tree */
  constructor(
    /** The name of the node, "" for root */
    readonly name: string = "",
    /** The parent node, null for root */
    readonly parentNode: EventTree<T> | null = null,
  ) {}

  /** returns the node's path in a tree */
  get path(): string {
    return "/" + this.#path().join("/");
  }

  /** returns the root node of the tree */
  get root(): Tree<T> {
    return this.parentNode?.root ?? this;
  }

  #path(): string[] {
    return this.parentNode ? [...this.parentNode.#path(), this.name] : [];
  }

  /** returns true if the node or the nodes parent has listeners */
  hasListeners(): boolean {
    return this.emmiter.listeners.size > 0 ||
      (this.parentNode?.hasListeners() ?? false);
  }

  #getChildren(): EventTree<T>[] {
    return Object.values(this.#edges).reduce(
      (acc, edge) =>
        acc.concat(edge.emmiter.listeners.size ? [edge] : edge.#getChildren()),
      [] as EventTree<T>[],
    );
  }

  /** subscribes to an event on a path in the tree */
  on(
    ...args: [path: string | string[], listener: EventListener<T>] | [
      listener: EventListener<T>,
    ]
  ): EventTree<T> {
    const [path, listener] = args.length === 1 ? ["", args[0]] : args;
    const p: string[] = jsonpointer.split(path);
    if (p.length) {
      return this.#getOrExtendPath(p).on(p, listener);
    } else {
      if (!this.hasListeners()) {
        const update: SubscriptionUpdate[] = [];
        update.push({
          subscribe: true,
          path: this.path,
        });

        //  remove subscription from children nodes
        this.#getChildren().forEach((child) => {
          update.push({
            subscribe: false,
            path: child.path,
          });
        });
        this.root.meta.emit(update);
      }
      this.emmiter.on(listener);
      return this;
    }
  }

  #removeEdge(edge: string) {
    delete this.#edges[edge];
    if (!Object.keys(this.#edges).length && this.parentNode) {
      this.parentNode.#removeEdge(this.name);
    }
  }

  /** unsubscribes from an event on a path in the tree */
  off(
    ...args: [path: string | string[], listener: EventListener<T>] | [
      listener: EventListener<T>,
    ]
  ): EventTree<T> | void {
    const [path, listener] = args.length === 1 ? ["", args[0]] : args;
    const p: string[] = jsonpointer.split(path);
    if (p.length) {
      return this.#getPath(p)?.off(p, listener);
    } else {
      this.emmiter.off(listener);
      if (!Object.keys(this.#edges).length && this.parentNode) {
        this.parentNode.#removeEdge(this.name);
      }
      if (!this.hasListeners()) {
        const update: SubscriptionUpdate[] = [];
        update.push({
          subscribe: false,
          path: this.path,
        });
        this.#getChildren().forEach((child) => {
          update.push({
            subscribe: true,
            path: child.path,
          });
        });
        this.root.meta.emit(update);
      }
      return this;
    }
  }

  /** emits an event on a path in the tree */
  emit(
    ...args: [path: string | string[], event: T] | [event: T]
  ): EventTree<T> | void {
    const [path, event] = args.length === 1 ? [[], args[0]] : args;
    const p: string[] = jsonpointer.split(path);
    if (p.length) {
      return this.#getOrExtendPath(p).emit(event);
    } else {
      this.emmiter.emit(event, this);
      this.parentNode?.emit(event);
      return this;
    }
  }

  /** get a node in the tree by path */
  get(path: string | string[]): EventTree<T> | undefined {
    const p: string[] = jsonpointer.split(path);
    return this.#getPath(p);
  }

  #getPath(p: string[]): EventTree<T> | undefined {
    if (p.length) {
      const edge = p.shift();
      const next = this.#edges[edge!];
      if (next) {
        return next.#getPath(p);
      }
    } else {
      return this;
    }
  }

  #getOrExtendPath(p: string[]): EventTree<T> {
    if (p.length) {
      const edge = p.shift()!;
      if (!this.#edges[edge]) {
        this.#edges[edge] = new EventTree(edge, this);
      }
      const next = this.#edges[edge];
      return next.#getOrExtendPath(p)!;
    } else {
      return this;
    }
  }
}
