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

import { type codec, get, set } from "@massmarket/utils";

/** A callback function that gets called when an event is emitted */
export type EventListener<T = unknown> = (
  event: T,
) => void;

export type Step = codec.CodecKey;
export type Path = Readonly<Step[]>;

/**
 * Retrieves a property type in a series of nested objects.
 * Read more: https://stackoverflow.com/a/61648690.
 */
export type DeepIndex<T, KS extends Path, Fail = undefined> = KS extends
  [infer F, ...infer R]
  ? R extends Path
    ? F extends keyof Exclude<T, undefined>
      ? DeepIndex<Exclude<T, undefined>[F], R, Fail>
    : T extends Map<infer X, infer I> ? F extends X ? DeepIndex<I, R, Fail>
      : Fail // F is not in T, time to check map // never?
    : Fail
  : Fail
  : T; // end

/** Used to express changes to which part of the tree is needs a subscription to */
export interface SubscriptionUpdate {
  /** Whether to add a subscription or remove a subscription */
  subscribe: boolean;
  /** the path on the object tree to subscribe/unsubscribe */
  path: Path;
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

  once(listener: EventListener<T>) {
    const onceListener = (event: T) => {
      this.off(onceListener);
      listener(event);
    };
    this.on(onceListener);
  }

  /** emits an event  */
  emit(event: T) {
    this.listeners.forEach((listener) => {
      listener(event);
    });
  }
}

class Node<T = unknown> {
  edges: Map<codec.CodecKey, Node<T>> = new Map();
  readonly emmiter = new EventEmmiter<T>();
  constructor(public value: T | undefined = undefined) {}
  emit(rootValue: T) {
    if (rootValue !== this.value) {
      // update the vale
      this.value = rootValue;
      this.emmiter.emit(rootValue);
      for (const [name, child] of this.edges) {
        const childRootValue = get(rootValue, name);
        child.emit(
          childRootValue,
        );
      }
    }
  }
}

/**
 * This class dispatch's an event and bubbles that event up the tree
 * @template T the type of the event
 */
export default class EventTree<T> {
  /** The event emmiter for this node */
  readonly root;
  /** The event emmiter for the meta events, this only works on the root node of the tree */
  // readonly meta = new EventEmmiter<SubscriptionUpdate[]>();
  constructor(public value: T) {
    this.root = new Node(value);
  }
  #getOrExtendPath<ET>(
    path: Path = [],
  ): Node<ET> {
    let last: Node<T> | Node = this.root;
    let next: Node | undefined;
    for (const node of path) {
      next = get(last.edges, node);
      if (!next) {
        next = new Node();
        set(last.edges, node, next);
      }
      last = next;
    }
    return last as Node<ET>;
  }
  *#path(path: Path = []) {
    let next: Node<T> | Node | undefined = this.root;
    yield { node: next, step: undefined };
    for (const step of path) {
      next = get(next.edges, step);
      yield { node: next, step };
      if (next === undefined) {
        return;
      }
    }
  }
  // TODO: if path is known return the correct type
  on<P extends Path, ET = DeepIndex<T, P>>(
    listener: EventListener<ET>,
    path?: P,
  ) {
    this.#getOrExtendPath<ET>(path).emmiter.on(listener);
  }
  off<P extends Path, ET = DeepIndex<T, P>>(
    listener: EventListener<ET>,
    path?: P,
  ) {
    const [...walk] = this.#path(path);
    let { node, step } = walk.pop()!;
    let parent, nextStep;
    (node as Node<ET>)?.emmiter.off(listener);

    while (walk.length && node) {
      if (node.emmiter.listeners.size === 0 && node.edges.size === 0) {
        ({ node: parent, step: nextStep } = walk.pop()!);
        // make sure we are not the root
        if (parent) {
          parent.edges.delete(step!);
        }
        step = nextStep;
        node = parent;
      } else {
        break;
      }
    }
  }
  once<P extends Path, ET = DeepIndex<T, P>>(
    listener: EventListener<ET>,
    path?: P,
  ) {
    const l = (event: ET) => {
      listener(event);
      this.off(l, path);
    };
    this.on(l, path);
  }
  emit(event: Readonly<T>) {
    this.root.emit(event);
  }
}
