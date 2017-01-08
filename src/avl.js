export default class Node {
    constructor(val) {
        this.value = val;
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
        const targetHistory = [this];
        let target = this;
        while (target != null) {
            if (target.value > val) {
                if (target.leftChildren === null) {
                    const children = new Node(val);
                    target.leftChildren = children;
                    break;
                }
                target = target.leftChildren;
            } else {
                // target.value <= val
                if (target.rightChildren === null) {
                    const children = new Node(val);
                    target.rightChildren = children;
                    break;
                }
                target = target.rightChildren;
            }
            targetHistory.push(target);
        }
        let balanceFactor = target.balanceFactor;
        while (target != null && balanceFactor != 0) {
            balanceFactor = target.balanceFactor;
            if (balanceFactor >= 2) {
                if (target.leftChildren.balanceFactor < 0) target.leftChildren.leftRotate();
                target.rightRotate();
                break;
            } else if (-2 >= balanceFactor) {
                if (target.rightChildren.balanceFactor > 0) target.rightChildren.rightRotate();
                target.leftRotate();
                break;
            }
            target = targetHistory.pop();
        }
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

        this[OS] = pivot[RS];

        const pivotRS = new Node(this.value);
        pivotRS.leftChildren = this.leftChildren;
        pivotRS.rightChildren = this.rightChildren;

        pivot[RS] = pivotRS;

        this.leftChildren = pivot.leftChildren;
        this.rightChildren = pivot.rightChildren;
        this.value = pivot.value;
    }
}
