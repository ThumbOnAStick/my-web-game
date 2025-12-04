/**
 * @interface
 * Base class representing a game scene.
 * This class should be extended by specific scene implementations.
 * It is designed to be renderer-agnostic, allowing it to work with any rendering framework
 * (e.g., Canvas 2D, WebGL, DOM-based, etc.) by accepting a generic renderer in the render method.
 */
export class IScene {
    constructor() {
        if (this.constructor === IScene) {
            throw new Error("IScene is an abstract class (interface) and cannot be instantiated directly.");
        }
    }

    /**
     * Initialize the scene with specific parameters.
     * Called when the scene is created or switched to.
     * @param {Object} [params] - Optional initialization parameters specific to the scene.
     */
    init(params) {
        // Optional implementation
    }

    /**
     * Load necessary resources (images, audio, data) for the scene.
     * Should be called before the scene starts updating or rendering.
     * @returns {Promise<void>} A promise that resolves when loading is complete.
     */
    async load() {
        throw new Error("Method 'load()' must be implemented.");
    }

    /**
     * Clean up resources when the scene is destroyed or swapped out.
     * Use this to release memory, stop sounds, or remove event listeners.
     */
    unload() {
        throw new Error("Method 'unload()' must be implemented.");
    }

    /**
     * Update the scene logic.
     * @param {number} deltaTime - Time elapsed since the last frame (in seconds).
     */
    update(deltaTime) {
        throw new Error("Method 'update(deltaTime)' must be implemented.");
    }

    /**
     * Render the scene using the provided renderer.
     * The scene implementation should know how to use the specific renderer provided.
     * @param {Object} renderer - The rendering provider (e.g., CanvasRenderingContext2D, WebGLRenderer, etc.).
     */
    render(renderer) {
        throw new Error("Method 'render(renderer)' must be implemented.");
    }

    /**
     * Handle input events.
     * @param {Object} inputState - The current state of inputs (keyboard, mouse, gamepad).
     */
    handleInput(inputState) {
        // Optional implementation
    }

    /**
     * Handle window or container resize events.
     * @param {number} width - New width of the view.
     * @param {number} height - New height of the view.
     */
    onResize(width, height) {
        // Optional implementation
    }

    /**
     * Called when the scene is paused (e.g., menu opened, tab hidden).
     */
    pause() {
        // Optional implementation
    }

    /**
     * Called when the scene is resumed.
     */
    resume() {
        // Optional implementation
    }
}