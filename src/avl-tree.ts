import { BinarySearchTree } from "./binary-search-tree";
import { NullableTreeNode, TreeNode } from "./common/node";
import { Compare, CompareFn, defaultCompare } from "./common/util";

export class AVLTree<T> extends BinarySearchTree<T> {
  protected getHeight(node: NullableTreeNode<T>): number {
    if (node) {
      return (
        Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1
      );
    }
    return -1;
  }

  protected getBalanceFactor(node: NullableTreeNode<T>) {
    if (node) {
      return this.getHeight(node.left) - this.getHeight(node.right);
    }
    return 0;
  }

  protected rotateRR(node: TreeNode<T>) {
    const left = node.left!;
    node.left = left.right;
    left.right = node;
    return left;
  }

  protected rotateLL(node: TreeNode<T>) {
    const right = node.right!;
    node.right = right.left;
    right.left = node;
    return node;
  }

  protected rotateLR(node: TreeNode<T>) {
    node.left = this.rotateLL(node.left!);
    return this.rotateRR(node);
  }

  protected rotateRL(node: TreeNode<T>) {
    node.right = this.rotateRR(node.right!);
    return this.rotateLL(node);
  }

  protected rotate(node: TreeNode<T>) {
    const balanceFactor = this.getBalanceFactor(node);
    if (balanceFactor > 1) {
      if (this.getBalanceFactor(node.left) >= 0) {
        return this.rotateRR(node);
      } else {
        return this.rotateLR(node);
      }
    } else if (balanceFactor < -1) {
      if (this.getBalanceFactor(node.right) <= 0) {
        return this.rotateLL(node);
      } else {
        return this.rotateRL(node);
      }
    }
    return node;
  }

  protected insertNode(node: TreeNode<T>, item: T): TreeNode<T> {
    return super.insertNode(node, item, (node: TreeNode<T>) => {
      return this.rotate(node);
    });
  }

  protected removeNode(
    node: NullableTreeNode<T>,
    item: T,
    ctx?: { removed?: boolean | undefined }
  ): NullableTreeNode<T> {
    return super.removeNode(node, item, ctx, (node: TreeNode<T>) => {
      return this.rotate(node);
    });
  }
}

export function isAVLTree<T>(node: NullableTreeNode<T>) {
  if (!node) return false;
  const getHeight = (node: NullableTreeNode<T>): number => {
    if (node) {
      return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    }
    return -1;
  };
  const isBalance = (node: TreeNode<T>): boolean => {
    let result = true;
    if (node.left) {
      result = isBalance(node.left);
    }
    if (result && node.right) {
      result = isBalance(node.right);
    }
    if (result && (node.left || node.right)) {
      result = Math.abs(getHeight(node.left) - getHeight(node.right)) < 2;
    }
    return result;
  };
  return isBalance(node);
}
