import { IScene } from './scene.js';

/**
 * Base class for scenes that render to a HTML5 Canvas.
 * Extends IScene to provide canvas-specific functionality.
 */
export class CanvasScene extends IScene {
    constructor() {
        super();
        if (this.constructor === CanvasScene) {
            throw new Error("CanvasScene is an abstract class and cannot be instantiated directly.");
        }
    }

    /**
     * Render the scene using the Canvas 2D context.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    render(ctx) {
        // Runtime check to ensure we are using the correct renderer
        if (!(ctx instanceof CanvasRenderingContext2D)) {
            console.warn("CanvasScene: Renderer is not a CanvasRenderingContext2D. Skipping render.");
            return;
        }

        this.draw(ctx);
    }

    /**
     * Specific drawing logic for the scene.
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        throw new Error("Method 'draw(ctx)' must be implemented.");
    }

    /**
     * Helper to clear the canvas.
     * @param {CanvasRenderingContext2D} ctx 
     */
    clear(ctx) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        ctx.clearRect(0, 0, width, height);
    }
}
