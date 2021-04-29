function TreeNode(root, left, right) {
    this.root = root;
    this.left = left;
    this.right = right;
    this.count = 1;
}

const node = new TreeNode(1, 2, 3);

console.log(node)