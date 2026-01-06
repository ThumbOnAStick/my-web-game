// oxlint-disable no-unused-vars
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";
import { InputManager } from "../../jsmanagers/inputmanager.js";
import { ResourceManager } from "../../jsmanagers/resourcemanager.js";

export class UIElementConfigurations {

    /**
     * @param {InputManager} inputManager
     * @param {ResourceManager} resourceManager
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     */
    constructor(x = 0, y = 0, width = 0, height = 0, inputManager, resourceManager) {
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
    isMouseWithin() {
        return this.inputManager.isMouseWithin(this.x,
            this.y,
            this.width,
            this.height
        )
    }
}

export class UIElementCanvas {
    /**@type {boolean}*/#initialzed;
    
    /**Updated when an ui scene is enabled/disabled 
     * @type {boolean}*/#enabled;
    
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {UIElementConfigurations} config 
     */
    constructor(config, ctx) {
        if (!config) {
            /**@type {UIElementConfigurations} */
            this.config = null;
            this.ctx = ctx;
            return;
        }

        // Clone while preserving prototype methods (e.g., isMouseWithin)
        this.config = Object.create(
            Object.getPrototypeOf(config),
            Object.getOwnPropertyDescriptors(config)
        );
        this.ctx = ctx;
    }

    init() {
        // Called by scene.init()
        this.setInitialzed();
        this.onTranslationsChanged();
    }

    /**
     * 
     * @returns {boolean}
     */
    notInitialzed(){
        return this.#initialzed == false;
    }

    setInitialzed(){
        this.#initialzed = true;
    }

    enable(){
        this.#enabled = true;
    }

    disable(){
        this.#enabled = false;
    }

    get isEnabled(){
        return this.#enabled;
    }

    draw() {
        // To be implemented by subclasses
        if(this.notInitialzed()){
            debugManager.popMessage("UI element not initialized!!!")
        }
    }

    update() {
        // To be implemented by subclasses
    }

    dispose() {
        // Remove all listeners. Must be called when scene clears!
    }

    onTranslationsChanged() {
        // Change translations of labels, called by scene.
    }

}