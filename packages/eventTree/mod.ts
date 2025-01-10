/**
 * This module contains Class to create a tree of events. Since we don't have a dom tree we creaete a synthetic tree that allows subscribing to events
 * along a path in the tree. When an Event is triggered on a path, it will "bubble" up the tree until it reaches the root. All events bubble up the tree.
 * @module
 */
import jsonpointer from "npm:@sagold/json-pointer";

const eventTargets = new WeakMap<Event, Tree>();

/** This class dispatch's an {@link Event} and bubbles that event up the tree */
export class Tree<T extends Event = Event> extends EventTarget {
  #map = new Map<string, Tree>();
  /** create a new instance of the Tree */
  constructor(
    readonly name: string = "",
    readonly parentNode: Tree | null = null,
  ) {
    super();
  }

  /** returns the node's path in a tree */
  get path(): string {
    return this.#path(true);
  }

  #path(first: boolean): string {
    if (this.parentNode) {
      return this.parentNode.#path(false).concat("/", this.name);
    } else if (first) {
      return "/";
    } else {
      return "";
    }
  }

  /** get a node in the tree by path */
  get(path: string | string[]): Tree {
    const p: string[] = jsonpointer.split(path);
    return this.#getPath(p);
  }

  #getPath(p: string[]): Tree {
    if (p.length) {
      const edge = p.shift()!;
      if (!this.#map.has(edge)) {
        this.#map.set(edge, new Tree(edge, this));
      }
      const next = this.#map.get(edge)!;
      return next.#getPath(p);
    } else {
      return this;
    }
  }

  /**
   * dispatches an event on the tree and bubbles it up the tree
   * @inheritdoc
   */
  override dispatchEvent(event: T): boolean {
    if (!eventTargets.has(event)) {
      eventTargets.set(event, this);
    }
    return super.dispatchEvent(event) && (
      this.parentNode?.dispatchEvent(event) ?? true
    );
  }
  /**
   * since we cannot overwrite `event.target` we have to use an alternative way to get and set event targets.
   * This static method allows to get the target of an event set by the tree.
   */
  static getTarget(event: Event): Tree | undefined {
    return eventTargets.get(event);
  }
}
