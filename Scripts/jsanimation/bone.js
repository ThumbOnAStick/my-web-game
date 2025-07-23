export class Bone {
    constructor(name, length, angle = 0, parent = null) {
        this.name = name;
        this.length = length;
        this.angle = angle;
        this.parent = parent;
        this.children = [];
        this.position = { x: 0, y: 0 };
    }

    addChild(bone) {
        bone.parent = this;
        this.children.push(bone);
    }

    getWorldPosition(facingDirection = 1) {
        if (this.parent) {
            const parentPos = this.parent.getWorldPosition(facingDirection);
            const angle = this.parent.getWorldAngle();
            return {
                x: parentPos.x + Math.cos(angle) * facingDirection * this.parent.length,
                y: parentPos.y + Math.sin(angle) * this.parent.length
            };
        }
        return this.position;
    }
    getWorldAngle(facingDirection = 1) {
        let result = this.parent ? this.parent.getWorldAngle() + this.angle: this.angle - Math.PI / 2; // Adjust for initial angle offset
        return facingDirection < 1? Math.PI - result : result; // Adjust for facing direction
    }
}