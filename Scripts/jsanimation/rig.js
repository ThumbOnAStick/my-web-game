import { Bone } from "./bone.js";
import { SpritePart } from "./spritepart.js";
import { GlobalFonts } from "../jsutils/globalfont.js";

 
// Manages the hierarchy of bones and parts
export class Rig {

    /**
     * 
     * @param {Bone} rootBone 
     */
    constructor(rootBone) 
    {
        this.rootBone = rootBone;
        /** @type {Object<string, SpritePart>} */
        this.parts = {};
        this.dir = 1;
        this.alpha = 1;
    }

    addPart(boneName, part = new SpritePart(null, 0, 0)) {
        this.parts[boneName] = part;
    }

    /**
     * Set SpritePart alpah
     * @param {Number} value 
     */
    setAlpha(value)
    {
        // Clamp alpha between 0 and 1
        this.alpha = Math.max(0, Math.min(1, value));
    }

    draw(ctx, resources, showDebug = true, facingDirection = 1, drawSize = 1) {
        this._drawBone(ctx, this.rootBone, resources, showDebug, facingDirection, drawSize);
    }

    _drawBone(ctx, bone = new Bone(), resources, showDebug = true, facingDirection = 1, drawSize = 1) {
        const pos = bone.getDrawPosition(facingDirection, drawSize);
        const angle = bone.getWorldAngle(facingDirection);
        const baseAngle = bone.angle;

        if (showDebug) this._drawBoneArrow(ctx, pos.x, pos.y, angle, baseAngle, bone.length * drawSize, bone.name);
        else 
        {
            // Draw part if available and not in debug mode
            if (this.parts[bone.name]) 
            {
                this.parts[bone.name].draw(ctx, pos.x, pos.y, angle, showDebug, this.alpha, drawSize, facingDirection);
            }
        }

        // Draw bone as black arrow
        for (const child of bone.children) 
        {
            this._drawBone(ctx, child, resources, showDebug, facingDirection, drawSize);
        }
    }

    // Only visible in debug mode
    /** @param {CanvasRenderingContext2D} ctx */
    _drawBoneArrow(ctx, x, y, angle, baseAngle, length, boneName) {
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

        // Draw bone label
        ctx.fillStyle = 'black';
        ctx.font = GlobalFonts.debug;
        // Convert angle from radians to degrees and round
        const angleDeg = Math.round(baseAngle * 180 / Math.PI);
        ctx.fillText(`${boneName} (${angleDeg}°)`, length / 2, -5);

        // Draw bone end (small circle)
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    turnOnSmear() {
        for (const boneName in this.parts) {
            this.parts[boneName].turnOnSmear();
        }
    }

    turnOffSmear() {
        for (const boneName in this.parts) {
            this.parts[boneName].turnOffSmear();
        }
    }
}