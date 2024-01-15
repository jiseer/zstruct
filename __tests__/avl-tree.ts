import { AVLTree,isAVLTree, isBST, randomNum } from "../src";

describe("AVLTree", () => {
  test("AVLTree insert", () => {
    const avlTree = new AVLTree();
    for (let i = 0; i < 100; i++) {
      avlTree.insert(randomNum(1, 100));
    }
    expect(isBST(avlTree.getRoot())).toBeTruthy();
    for (let i = 0; i < 30; i++) {
      avlTree.remove(randomNum(1, 100));
    }
    expect(isBST(avlTree.getRoot())).toBeTruthy();
    expect(isAVLTree(avlTree.getRoot())).toBeTruthy();
  });
});
