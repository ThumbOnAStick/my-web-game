export class Bone {
    /**
     * 
     * @param {*} name 
     * @param {*} length 
     * @param {*} angle 
     * @param {Bone} parent 
     * @param {*} drawOnCenter 
     */
    constructor(name, length, angle = 0, parent = null, drawOnCenter = false) {
        this.name = name;
        this.length = length;
        this.angle = angle;
        /**@type {Bone} */
        this.parent = parent;
        this.children = [];
        this.position = { x: 0, y: 0 };
        this.drawOncenter = drawOnCenter;
    }

    addChild(bone) {
        bone.parent = this;
        this.children.push(bone);
    }

    getDrawPosition(facingDirection = 1)
    {
        return this.drawOncenter ? this.getCenterWorldPosition(facingDirection) : this.getWorldPosition(facingDirection);
    }

    getWorldPosition(facingDirection = 1) 
    {
        if (this.parent) {
           return this.parent.getEndWorldPosition(facingDirection);
        }
        return this.position;
    }

    /**
     * 
     * @param {Number} facingDirection 
     * @returns 
     */
    getEndWorldPosition(facingDirection = 1)
    {
        let angle = this.getWorldAngle(facingDirection);
        let worldPo = this.getWorldPosition(facingDirection);
          return {
                x: worldPo.x + Math.cos(angle) * this.length,
                y: worldPo.y + Math.sin(angle) * this.length
            };
    }

    getCenterWorldPosition(facingDirection = 1) {

        let startPos = this.getWorldPosition(facingDirection);
        let endPos = this.getEndWorldPosition(facingDirection);
        return {x: (startPos.x + endPos.x)/2,
            y: (startPos.y + endPos.y)/2
        };
    }

    getWorldAngle(facingDirection = 1) {
        let result = this.parent ? this.parent.getWorldAngle() + this.angle: this.angle - Math.PI / 2; // Adjust for initial angle offset
        return facingDirection < 1? Math.PI - result : result; // Adjust for facing direction
    }
    
}