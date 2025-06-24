// 2D Rigging Animation Classes

// Represents a single bone in the rig
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

    getWorldPosition() {
        if (this.parent) {
            const parentPos = this.parent.getWorldPosition();
            const angle = this.parent.getWorldAngle();
            return {
                x: parentPos.x + Math.cos(angle) * this.parent.length,
                y: parentPos.y + Math.sin(angle) * this.parent.length
            };
        }
        return this.position;
    }

    getWorldAngle() {
        if (this.parent) {
            return this.parent.getWorldAngle() + this.angle;
        }
        return this.angle;
    }
}

// Represents a visual part (sprite) attached to a bone
export class SpritePart {
    constructor(image, width, height, angleOffset = 0) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.angleOffset = angleOffset || 0; // Optional angle offset for rotation
    }    
    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx, x, y, angle, showDebug = true) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.rotate(this.angleOffset);
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.width/2, -this.height/2, this.width, this.height);
        
        // Only draw debug rectangle if showDebug is true
        if (showDebug) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        }
        
        ctx.restore();
    }
}

// Manages the hierarchy of bones and parts
export class Rig {
    constructor(rootBone) {
        this.rootBone = rootBone;
        this.parts = {};
    }

    addPart(boneName, part = new SpritePart(null, 0, 0)) {
        this.parts[boneName] = part;
    }  

    draw(ctx, resources, showDebug = true) 
    {
        this._drawBone(ctx, this.rootBone, resources, showDebug);
    }   

     _drawBone(ctx, bone = new Bone(), resources, showDebug = true) 
    {
        const pos = bone.getWorldPosition();
        const angle = bone.getWorldAngle();
        
        // Draw part if available
        if (this.parts[bone.name]) {
                this.parts[bone.name].draw(ctx, pos.x, pos.y, angle, showDebug);
            }

         // Draw bone as black arrow
         if (showDebug)
             this._drawBoneArrow(ctx, pos.x, pos.y, angle, bone.length, bone.name);

         for (const child of bone.children) {
             this._drawBone(ctx, child, resources, showDebug);
         }
    }

    _drawBoneArrow(ctx, x, y, angle, length, boneName) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // Set arrow style
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;
        
        // Draw arrow shaft
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        ctx.stroke();
        
        // Draw arrowhead
        const arrowHeadSize = Math.min(length * 0.2, 10);
        ctx.beginPath();
        ctx.moveTo(length, 0);
        ctx.lineTo(length - arrowHeadSize, -arrowHeadSize * 0.5);
        ctx.lineTo(length - arrowHeadSize, arrowHeadSize * 0.5);
        ctx.closePath();
        ctx.fill();

        //Draw bone label
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText(boneName, length / 2, -5);
        
        // Draw bone joint (small circle at base)
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Handles keyframes and interpolation for animating the rig
export class Animation {
    constructor(keyframes = []) {
        this.keyframes = keyframes; // [{ time, boneName, angle }]
        this.currentTime = 0;
    }

    update(deltaTime) {
        this.currentTime += deltaTime;
    }

    apply(rig) {
        for (const kf of this.keyframes) {
            // Simple: set angle directly if time matches
            if (Math.abs(this.currentTime - kf.time) < 0.01) {
                const bone = this._findBone(rig.rootBone, kf.boneName);
                if (bone) bone.angle = kf.angle;
            }
        }
    }

    _findBone(bone, name) {
        if (bone.name === name) return bone;
        for (const child of bone.children) {
            const found = this._findBone(child, name);
            if (found) return found;
        }
        return null;
    }
}
