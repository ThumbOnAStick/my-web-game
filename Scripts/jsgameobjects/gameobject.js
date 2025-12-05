// oxlint-disable no-unused-vars
import { Resources } from "../jscomponents/resources.js";

export class GameObject {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     * @param {Number} height 
     * @param {GameObject} source 
     */
    constructor(x, y, width = 0, height = 0, source = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = crypto.randomUUID();
        this.grounded = false;
        /**@type {GameObject} */
        this.source = source;
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Number} deltaTime
     */
    update(canvas, deltaTime) {
        // Base implementation - can be overridden by subclasses
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Resources} resources
     * @param {boolean} [showDebug=false]
     */
    draw(ctx, resources = null, showDebug = false) {
        // Base implementation - can be overridden by subclasses
        if (showDebug) {
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /** @returns {{x: number, y: number}} */
    getPosition() {
        return { x: this.x, y: this.y };
    }

    collidesWith(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }
}