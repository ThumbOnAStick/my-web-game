// oxlint-disable no-unused-vars
import { UIElementCanvas } from '../jsuielements-ctx/uielement.js';
import { IScene } from './scene.js';

/**
 * Base class for scenes that render to a HTML5 Canvas.
 * Extends IScene to provide canvas-specific functionality.
 */
export class CanvasScene extends IScene {
    /**@param {CanvasRenderingContext2D} ctx - The rendering context. */
    constructor(ctx) {
        super();
        this.ctx = ctx;
        /**@type {UIElementCanvas[]} */
        this.canvasUIElements = [];
    }

    /**
     * Render the scene using the Canvas 2D context.
     */
    render() {
        super.render();
        // Runtime check to ensure we are using the correct renderer
        if (!(this.ctx instanceof CanvasRenderingContext2D)) {
            console.warn("CanvasScene: Renderer is not a CanvasRenderingContext2D. Skipping render.");
            return;
        }

        this.draw();
    }

    /**
     * 
     * @param {Number} deltaTime 
     */
    update(deltaTime) {
        super.update(deltaTime)
        for (let index = 0; index < this.canvasUIElements.length; index++) {
            const element = this.canvasUIElements[index];
            element.update();
        }
    }

    /**
     * Draw UI elements.
     */
    draw() {
        for (let index = 0; index < this.canvasUIElements.length; index++) {
            const element = this.canvasUIElements[index];
            element.draw(this.ctx);
        }
    }

    unload() {
        super.unload();
        for (let index = 0; index < this.canvasUIElements.length; index++) {
            const element = this.canvasUIElements[index];
            element.dispose();
        }
    }


    /**
     * 
     * @param {UIElementCanvas} uiElement 
     */
    registerUIElement(uiElement) {
        this.canvasUIElements.push(uiElement);
    }


}
