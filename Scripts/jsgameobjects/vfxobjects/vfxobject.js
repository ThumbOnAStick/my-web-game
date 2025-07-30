import { SpritePart } from "../../jsanimation/spritepart.js";
import { Resources } from "../../jscomponents/resources.js";
import { GameObject } from "../gameobject.js";

export class VFXObject extends GameObject
{
    /**
     * 
     * @param {Resources} resources 
     * @param {string} spriteName
     * @param {Number} angle
     * @param {Number} duration Decides how long this instance can exist
     * @param {*} x 
     * @param {*} y 
     * @param {*} width 
     * @param {*} height 
     */
    constructor(resources, spriteName, angle, duration,  x, y, width = 0, height = 0,)
    {
        super(x, y, width, height);
        this.spriepart = new SpritePart(resources.getImage(spriteName), width, height);
        this.angle = angle;
        this.durationTicks = duration;
        this.creationTicks = Date.now();
    }

    draw(ctx)
    {
        super.draw(ctx);
        this.spriepart.draw(ctx, this.x, this.y, this.angle);
    }

    /**
     * 
     * @param {Number} currentTicks 
     * @returns 
     */
    shouldBeRemoved(currentTicks)
    {
        return this.creationTicks + this.durationTicks > currentTicks;
    }
}