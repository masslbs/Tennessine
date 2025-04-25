import { type codec, get } from "@massmarket/utils";
import { assertExists } from "@std/assert";

export type TimestampTree = [
  Map<codec.CodecKey, TimestampTree>,
  codec.CodecValue,
];

export function getOrExtend(
  tree: TimestampTree,
  step: codec.CodecKey,
  mutate: boolean,
) {
  const next = get(tree[0], step);
  if (next) {
    return next;
  } else {
    if (mutate) {
      const newTree: TimestampTree = [new Map(), tree[1]];
      tree[0].set(step, newTree);
      return newTree;
    } else {
      return tree;
    }
  }
}

// get the timestamp of the current node, or find the timestamp of the node's parent
export function getTimestamp(
  tree: TimestampTree,
): codec.CodecValue {
  const timestamp = tree[1];
  assertExists(timestamp, "Timestamp not found");
  return timestamp;
}
