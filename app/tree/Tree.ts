export class TreeNode<T> {
    private children: TreeNode<T>[] = [];

    public constructor(public value: T, public parent?: TreeNode<T>) {}

    public addChild(node: TreeNode<T>) {
        node.parent = this;
        this.children.push(node);
    }

    public getChildren(): TreeNode<T>[] {
        return this.children;
    }

    public setChildren(children: TreeNode<T>[]) {
        this.children = children;
    }
}

export class Tree<T> {
    public moves = 0;
    public time = 0;
    public root?: TreeNode<T>;

    public constructor(root: T) {
        this.root = new TreeNode<T>(root, null);
    }
}
