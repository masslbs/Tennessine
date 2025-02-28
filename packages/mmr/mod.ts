import type { Level } from "npm:level";
import { keccak_256 } from "npm:@noble/hashes/sha3";
import { bytesToHex } from "npm:@noble/hashes@1.6.1/utils";

/**
 * This implementation elements a persistent Merkle Mountain Range backed by a leveldb instance
 */
export default class MMR {
  public _root?: Uint8Array;
  public _size = 0;
  // deno-lint-ignore no-explicit-any
  constructor(readonly level: Level<any, any>) {}

  // the merkle root of the tree
  get root(): Uint8Array {
    return this._root!;
  }

  // the number of items/leaves in the tree
  get size() {
    return this._size;
  }

  // open the tree; this must be called before any other method
  async open() {
    await this.level.open();
    [this._root, this._size] = await this.level.getMany(["root", "size"]);
  }

  // closes the tree (saves the metadata). This must be called to save the tree
  async close() {
    await this.level.put("root", this._root);
    await this.level.put("size", this._size);
    await this.level.close();
  }

  // adds a new item to the tree
  push(value: Uint8Array) {
    this._size++;
    return this.set(this._size - 1, value);
  }

  // returns an item from the tree
  get(index: number) {
    if (index > this._size) {
      throw new Error(
        "the given index is larger the number of items in the tree",
      );
    }
    return this.level.get("val" + index.toString());
  }

  // sets an item in the tree give its index
  async set(index: number, value: Uint8Array) {
    if (index > this._size) {
      throw new Error(
        "the given index is larger the number of items in the tree",
      );
    }

    const hash = keccak_256(value);
    await this.level.put("val" + index.toString(), value);
    index++; // we start from 1 internally
    if (index === 1) {
      await this.level.put(1, hash);
      this._root = hash;
      return;
    }

    const path = MMR._pathToLeaf(index, this._size);
    const leafNodePos = path.pop();
    await this.level.put(leafNodePos!, hash);
    let _root;
    let height = 1;
    while (path.length) {
      const nodePos = path.pop() as number;
      const rightPos = nodePos - 1;
      const leftPos = nodePos - 2 ** height;
      let [left, right] = await this.level.getMany([leftPos, rightPos]);
      if (left && !right) {
        if (_root) {
          right = _root;
        } else {
          _root = left;
        }
      }
      if (left && right) {
        _root = MMR.hashNode(left, right);
        await this.level.put(nodePos, _root);
      }
      height++;
    }
    this._root = _root;
  }

  _getMultiProofPositions(indexes: number[]) {
    indexes = indexes.map((a) => ++a).sort((a, b) => a - b);
    // internal nodes that can be constructed given the proof
    const internalPos = new Set<number>();
    const proofPos = new Set<number>();
    for (const index of indexes) {
      if (index > this._size) {
        throw new Error(
          "the given index is larger the number of items in the tree",
        );
      }
      const path = MMR._pathToLeaf(index, this._size);
      let height = path.length - 1;
      let preNode = path.shift();
      internalPos.add(preNode!);
      while (path.length) {
        const curNode = path.shift();
        // we are on the right path
        if (preNode! - 1 === curNode) {
          // if the left sibling node is not part of the treeSet then add it to the proof
          const leftSibling = preNode! - 2 ** height;
          if (!internalPos.has(leftSibling)) proofPos.add(leftSibling);
        } else {
          // we are on the left path
          const rightSibling = preNode! - 1;
          // always add the right sibling since the leaves are ordered
          proofPos.add(rightSibling);
        }
        height--;
        proofPos.delete(curNode!);
        internalPos.add(curNode!);
        preNode = curNode!;
      }
    }
    return [...proofPos];
  }

  // Given an array of indexes this returns the internal hashes needed to compute the merkle proof
  async getMultiProof(indexes: number[]) {
    const proofPos = this._getMultiProofPositions(indexes);
    return await this.level.getMany(proofPos);
  }

  // Defines how to produce an hash of a node
  static hashNode(left: Uint8Array, right: Uint8Array): Uint8Array {
    return keccak_256(new Uint8Array([...left, ...right]));
  }

  static _pathToLeaf(leafIndex: number, size: number): number[] {
    const path = [];
    // first calculate the next power of 2, which would be the number of nodes in a full binary tree
    const np2 = MMR.nextPowerOf2(size);
    const numOfNodes = np2 * 2 - 1;
    let height = Math.log2(np2) + 1;
    let nodeNum = numOfNodes;
    let upper = np2;
    let lower = 0;
    path.push(nodeNum);
    while (height > 1) {
      const mid = (upper - lower) / 2 + lower;
      height--;
      if (leafIndex <= mid) {
        nodeNum -= 2 ** height;
        upper = mid;
      } else {
        nodeNum--;
        lower = mid;
      }
      path.push(nodeNum);
    }
    return path;
  }

  static nextPowerOf2(n: number): number {
    const onesPlace = 31 - Math.clz32(n);
    return n === 1 << onesPlace ? n : 1 << (onesPlace + 1);
  }

  async dumpTree() {
    const nodes: Record<number, string> = {};

    // Get all stored nodes
    for (let i = 0; i < this._size * 2; i++) {
      const value = await this.level.get(i);
      if (value) {
        nodes[i] = bytesToHex(value).slice(0, 8) + "...";
      }
    }

    // Print tree structure
    console.log(`Tree size: ${this._size}`);
    console.log("Nodes:");
    Object.entries(nodes).sort((a, b) => Number(a[0]) - Number(b[0])).forEach(
      ([pos, hash]) => {
        console.log(`Position ${pos}: ${hash}`);
      },
    );
    console.log(`Root: ${bytesToHex(this.root)}`);
  }
}
