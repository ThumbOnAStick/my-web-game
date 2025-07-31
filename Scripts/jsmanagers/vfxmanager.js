import { GameObject } from "../jsgameobjects/gameobject.js";
import { VFXObject } from "../jsgameobjects/vfxobjects/vfxobject.js";
import { ResourceManager } from "./resourcemanager.js";

export class VFXManager
{

    /**
     * 
     * @param {ResourceManager} resourceManager 
     */
    constructor(resourceManager)
    {
        /**@type {VFXObject[]} */
        this.objects = []
        this.resourceManager = resourceManager;
    }

    
    /**
     * @param {String} name
     * @param {Number} angle
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {Number} durationTicks How long an object can exist 
     */
    make(name, angle, x, y, width, height, durationTicks)
    {
        this.objects.push(new VFXObject(this.resourceManager.resources, name, angle, durationTicks, x, y, width, height));
    }

    update()
    {
        const currentTicks = Date.now();
        this.objects = this.objects.filter(obj => obj.shouldBeRemoved(currentTicks));
    }

    /**
     * 
     * @param {HTMLCanvasElement} ctx 
     */
    draw(ctx)
    {
        this.objects.forEach
        (obj => 
        {
            if (obj.draw) {
                obj.draw(ctx);
            }
        });
    }
}