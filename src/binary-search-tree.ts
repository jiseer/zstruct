import { TreeNode, NullableTreeNode } from "./common/node";
import {
  Compare,
  CompareFn,
  defaultCompare,
  greaterThanOrEqual,
  lessThanOrEqual,
} from "./common/util";

interface OrderCallback<T> {
  (node: TreeNode<T>["item"]): void;
}

export class BinarySearchTree<T> {
  protected root: NullableTreeNode<T>;
  constructor(protected compareFn: CompareFn<T> = defaultCompare) {}

  getRoot() {
    return this.root;
  }

  setRoot(root: TreeNode<T>) {
    if (isBST(root, this.compareFn)) {
      return (this.root = root);
    }
  }

  insert(item: T) {
    this.root = this.root
      ? this.insertNode(this.root, item)
      : new TreeNode(item);
  }

  protected insertNode(
    node: TreeNode<T>,
    item: T,
    callback?: { (node: TreeNode<T>): TreeNode<T> }
  ) {
    if (this.compareFn(item, node.item) === Compare.LESS_THAN) {
      node.left = node.left
        ? this.insertNode(node.left, item)
        : new TreeNode(item);
    } else {
      node.right = node.right
        ? this.insertNode(node.right, item)
        : new TreeNode(item);
    }
    return callback ? callback(node) : node;
  }

  inOrderTraversal(callback: OrderCallback<T>) {
    if (this.root) {
      this.inOrderTraversalNode(this.root, callback);
    }
  }

  protected inOrderTraversalNode(
    node: NullableTreeNode<T>,
    callback: OrderCallback<T>
  ) {
    if (node) {
      node.left && this.inOrderTraversalNode(node.left, callback);
      callback(node.item);
      node.right && this.inOrderTraversalNode(node.right, callback);
    }
  }
  preOrderTraversal(callback: OrderCallback<T>) {
    if (this.root) {
      this.preOrderTraversalNode(this.root, callback);
    }
  }

  protected preOrderTraversalNode(
    node: NullableTreeNode<T>,
    callback: OrderCallback<T>
  ) {
    if (node) {
      callback(node.item);
      node.left && this.preOrderTraversalNode(node.left, callback);
      node.right && this.preOrderTraversalNode(node.right, callback);
    }
  }
  postOrderTraversal(callback: OrderCallback<T>) {
    if (this.root) {
      this.postOrderTraversalNode(this.root, callback);
    }
  }

  protected postOrderTraversalNode(
    node: NullableTreeNode<T>,
    callback: OrderCallback<T>
  ) {
    if (node) {
      node.left && this.postOrderTraversalNode(node.left, callback);
      node.right && this.postOrderTraversalNode(node.right, callback);
      callback(node.item);
    }
  }

  search(item: T) {
    return this.searchNode(this.root, item);
  }

  protected searchNode(node: NullableTreeNode<T>, item: T): boolean {
    if (node) {
      if (this.compareFn(item, node.item) === Compare.LESS_THAN) {
        return this.searchNode(node.left, item);
      } else if (this.compareFn(item, node.item) === Compare.GREATER_THAN) {
        return this.searchNode(node.right, item);
      }
      return true;
    }
    return false;
  }

  min() {
    return this.findMinNode(this.root)?.item;
  }

  protected findMinNode(node: NullableTreeNode<T>) {
    while (node && node.left) {
      node = node.left;
    }
    return node;
  }

  max() {
    return this.findMaxNode(this.root)?.item;
  }

  protected findMaxNode(node: NullableTreeNode<T>) {
    while (node && node.right) {
      node = node.right;
    }
    return node;
  }

  remove(item: T) {
    const ctx = { removed: false };
    this.root = this.removeNode(this.root, item, ctx);
    return ctx.removed;
  }

  protected removeNode(
    node: NullableTreeNode<T>,
    item: T,
    ctx: { removed?: boolean } = {},
    callback?: { (node: TreeNode<T>): TreeNode<T> }
  ): NullableTreeNode<T> {
    if (node) {
      if (this.compareFn(item, node.item) === Compare.LESS_THAN) {
        node.left = this.removeNode(node.left, item, ctx);
      } else if (this.compareFn(item, node.item) === Compare.GREATER_THAN) {
        node.right = this.removeNode(node.right, item, ctx);
      } else {
        ctx.removed = true;
        if (!(node.left && node.right)) {
          node = null;
        } else if (!node.left) {
          node = node.right;
        } else if (!node.right) {
          node = node.left;
        } else {
          const n = this.findMinNode(node.right);
          node.item = n!.item;
          node!.right = this.removeNode(node.right, n!.item);
        }
      }
      return callback && node ? callback(node) : node;
    }
  }
}

export function isBST<T>(
  node: NullableTreeNode<T>,
  compareFn: CompareFn<T> = defaultCompare
) {
  if (!node) return false;
  const inRange = (
    node: NullableTreeNode<T>,
    min?: NullableTreeNode<T>,
    max?: NullableTreeNode<T>
  ): Boolean => {
    if (node) {
      let result = true;
      if (min) {
        result = lessThanOrEqual(min.item, node.item, compareFn);
      }
      if (result && max) {
        result = greaterThanOrEqual(max.item, node.item, compareFn);
      }
      return (
        result &&
        inRange(node.left, min, node) &&
        inRange(node.right, node, max)
      );
    }
    return true;
  };
  return inRange(node);
}
