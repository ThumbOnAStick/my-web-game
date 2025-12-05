// oxlint-disable no-unused-vars
import { InputManager } from "../jsmanagers/inputmanager.js";
import { ResourceManager } from "../jsmanagers/resourcemanager.js";

export class UIElementConfigurations{
    /**
     * @param {InputManager} inputManager
     * @param {ResourceManager} resourceManager
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     */
    constructor(x = 0, y = 0, width = 0, height = 0, inputManager, resourceManager){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.inputManager = inputManager;
        this.resourceManager = resourceManager;
    }

    /**
     * @returns {boolean}
     */
    isMouseWithin(){
        return this.inputManager.isMouseWithin(this.x,
            this.y,
            this.width,
            this.height
        )
    }
}

export class UIElementCanvas {
    /**
     * 
     * @param {UIElementConfigurations} config 
     */
    constructor(config) {
        if (!config) {
            /**@type {UIElementConfigurations} */
            this.config = null;
            return;
        }

        // Clone while preserving prototype methods (e.g., isMouseWithin)
        this.config = Object.create(
            Object.getPrototypeOf(config),
            Object.getOwnPropertyDescriptors(config)
        );
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
       draw(ctx) {
        // To be implemented by subclasses
    }

    update(){
        // To be implemented by subclasses
    }

    dispose(){
        // Remove all listeners. Must be called when scene clears!
    }
}