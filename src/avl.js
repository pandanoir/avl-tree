const balance = target => {
    const balanceFactor = target.balanceFactor;
    if (balanceFactor >= 2) {
        if (target.leftChildren.balanceFactor < 0) target.leftChildren.leftRotate();
        target.rightRotate();
        return true;
    } else if (-2 >= balanceFactor) {
        if (target.rightChildren.balanceFactor > 0) target.rightChildren.rightRotate();
        target.leftRotate();
        return true;
    }
    return false;
};
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
            const side = target.value > val ? 'leftChildren' : 'rightChildren';
            if (target[side] === null) {
                const children = new Node(val);
                target[side] = children;
                break;
            }
            target = target[side];
            targetHistory.push(target);
        }
        let balanceFactor = target.balanceFactor;
        while (target != null && balanceFactor != 0) {
            const rotates = balance(target);
            if (rotates) break;
            target = targetHistory.pop();
        }
    }
    delete(val) {
        let target = this;
        const targetHistory = [this];
        while (target.value !== val) {
            const side = target.value > val ? 'leftChildren' : 'rightChildren';
            if (target[side] !== null) target = target[side];
            else return;
            targetHistory.push(target);
        }
        const hasLeft = target.leftChildren != null;
        const hasRight = target.rightChildren != null;
        if (!hasLeft && !hasRight) {
            const targetParent = targetHistory[targetHistory.length - 2];
            if (targetParent.rightChildren == target) {
                targetParent.rightChildren = null;
            } else {
                // targetParent.leftChildren == target
                targetParent.leftChildren = null;
            }
        } else if (hasLeft != hasRight) {
            // hasLeft XOR hasRight
            const targetParent = targetHistory[targetHistory.length - 2];
            const side = hasLeft ? 'leftChildren' : 'rightChildren';
            if (targetParent.rightChildren == target) {
                targetParent.rightChildren = target[side];
            } else {
                // targetParent.leftChildren == target
                targetParent.leftChildren = target[side];
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
            balance(target);
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
