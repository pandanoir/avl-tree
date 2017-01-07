export default class Node {
    constructor(val) {
        this.value = val;
        this.parent = null;
        this.leftChildren = null;
        this.rightChildren = null;
        this.height = 1;
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
        let heightOfLeft = this.leftChildren === null ? 0 : this.leftChildren.height;
        let heightOfRight = this.rightChildren === null ? 0 : this.rightChildren.height;
        const balanceFactor = heightOfLeft - heightOfRight;
        if (balanceFactor >= 2) {
            const heightOfLeft = this.leftChildren.leftChildren === null ? 0 : this.leftChildren.leftChildren.height;
            const heightOfRight = this.leftChildren.rightChildren === null ? 0 : this.leftChildren.rightChildren.height;
            const balanceFactor = heightOfLeft - heightOfRight;
            if (balanceFactor < 0) this.leftChildren.leftRotate();
            console.log(this.leftChildren.value, this.leftChildren.leftChildren.value);
            this.rightRotate();
        } else if (-2 >= balanceFactor) {
            const heightOfLeft = this.rightChildren.leftChildren === null ? 0 : this.rightChildren.leftChildren.height;
            const heightOfRight = this.rightChildren.rightChildren === null ? 0 : this.rightChildren.rightChildren.height;
            const balanceFactor = heightOfLeft - heightOfRight;
            if (balanceFactor > 0) this.rightChildren.rightRotate();
            this.leftRotate();
        }
        heightOfLeft = this.leftChildren === null ? 0 : this.leftChildren.height;
        heightOfRight = this.rightChildren === null ? 0 : this.rightChildren.height;
        this.height = Math.max(heightOfLeft, heightOfRight) + 1;
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
