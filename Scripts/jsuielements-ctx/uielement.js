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
}

export class UIElement {
    /**
     * 
     * @param {UIElementConfigurations} config 
     */
    constructor(config) {
        this.config = Object.assign({}, config);
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
}