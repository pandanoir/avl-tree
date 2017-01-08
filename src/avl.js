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
    }
    delete(val) {
        let target = this;
        const targetHistory = [this];
        while (target.value !== val) {
            if (target.value > val) {
                if (target.leftChildren !== null) target = target.leftChildren;
                else return;
            }
            if (target.value < val) {
                if (target.rightChildren !== null) target = target.rightChildren;
                else return;
            }
            targetHistory.push(target);
        }
        const hasLeft = target.leftChildren != null;
        const hasRight = target.rightChildren != null;
        if (!hasLeft && !hasRight) {
            const targetParent = targetHistory[targetHistory.length - 2];
            if (targetParent.rightChildren == target) {
                targetParent.rightChildren = null;
            } else if (targetParent.leftChildren == target) {
                targetParent.leftChildren = null;
            }
        } else if (hasLeft != hasRight) {
            // hasLeft XOR hasRight
            const targetParent = targetHistory[targetHistory.length - 2];
            if (hasLeft) {
                if (targetParent.rightChildren == target) {
                    targetParent.rightChildren = target.leftChildren;
                } else if (targetParent.leftChildren == target) {
                    targetParent.leftChildren = target.leftChildren;
                }
            } else {
                if (targetParent.rightChildren == target) {
                    targetParent.rightChildren = target.rightChildren;
                } else if (targetParent.leftChildren == target) {
                    targetParent.leftChildren = target.rightChildren;
                }
            }
        } else {
            let max = target.leftChildren;
            if (max.rightChildren == null) {
                target.value = max.value;
                target.leftChildren = max.leftChildren;
            } else {
                while (max.rightChildren != null) {
                    targetHistory.push(max);
                    max = max.rightChildren;
                }
                target.value = max.value;
                max.value = null;
                targetHistory[targetHistory.length - 1].rightChildren = max.leftChildren;
            }
        }
        target = targetHistory.pop();
        let balanceFactor = target.balanceFactor;
        while (target != null && balanceFactor != 1 && balanceFactor != -1) {
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
