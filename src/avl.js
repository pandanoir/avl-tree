export default class Node {
    constructor(val) {
        this.value = val;
        this.parent = null;
        this.leftChildren = null;
        this.rightChildren = null;
    }
    get height() {
        const heightOfLeft = this.leftChildren === null ? 0 : this.leftChildren.height;
        const heightOfRight = this.rightChildren === null ? 0 : this.rightChildren.height;
        return Math.max(heightOfLeft, heightOfRight) + 1;
    }
    get balanceFactor() {
        const heightOfLeft = this.leftChildren === null ? 0 : this.leftChildren.height;
        const heightOfRight = this.rightChildren === null ? 0 : this.rightChildren.height;
        return heightOfLeft - heightOfRight;
    }
    search(val) {
        if (this.value === val) return this;
        if (this.value > val) {
            if (this.leftChildren !== null) return this.leftChildren.search(val);
            return null;
        }
        if (this.value < val) {
            if (this.rightChildren !== null) return this.rightChildren.search(val);
            return null;
        }
    }
    insert(val) {
        if (this.value > val) {
            if (this.leftChildren === null) {
                const children = new Node(val);
                children.parent = this;
                this.leftChildren = children;
            } else {
                this.leftChildren.insert(val);
            }
        }
        if (this.value <= val) {
            if (this.rightChildren === null) {
                const children = new Node(val);
                children.parent = this;
                this.rightChildren = children;
            } else {
                this.rightChildren.insert(val);
            }
        }
        if (this.balanceFactor >= 2) {
            if (this.leftChildren.balanceFactor < 0) this.leftChildren.leftRotate();
            this.rightRotate();
        } else if (-2 >= this.balanceFactor) {
            if (this.rightChildren.balanceFactor > 0) this.rightChildren.rightRotate();
            this.leftRotate();
        }
    }
    leftRotate() {
        this.rotate('rightChildren', 'leftChildren');
    }
    rightRotate() {
        this.rotate('leftChildren', 'rightChildren');
    }
    rotate(OS, RS) {
        const pivot = this[OS];
        const root = this;
        root[OS] = pivot[RS];
        if (pivot[RS] !== null) pivot[RS].parent = root;
        pivot[RS] = new Node(root.value);
        pivot[RS].leftChildren = root.leftChildren;
        pivot[RS].rightChildren = root.rightChildren;
        pivot[RS].parent = pivot;
        pivot.parent = root.parent;

        root.leftChildren = pivot.leftChildren;
        root.rightChildren = pivot.rightChildren;
        root.value = pivot.value;
        root.parent = pivot.parent;
    }
}
