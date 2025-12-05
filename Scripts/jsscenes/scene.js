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
        /** @type {IScene[]} */
        this.subScenes = [];
    }

    /**
     * Add a subscene to this scene.
     * @param {IScene} scene - The scene to add.
     */
    addSubScene(scene) {
        if (scene instanceof IScene) {
            this.subScenes.push(scene);
        } else {
            console.warn("Attempted to add invalid scene as subscene.");
        }
    }

    /**
     * Remove a subscene from this scene.
     * @param {IScene} scene - The scene to remove.
     */
    removeSubScene(scene) {
        const index = this.subScenes.indexOf(scene);
        if (index > -1) {
            this.subScenes.splice(index, 1);
        }
    }

    /**
     * Initialize the scene with specific parameters.
     * Called when the scene is created or switched to.
     * @param {Object} [params] - Optional initialization parameters specific to the scene.
     */
    init(params) {
        this.subScenes.forEach(scene => scene.init(params));

    }

    /**
     * Load necessary resources (images, audio, data) for the scene.
     * Should be called before the scene starts updating or rendering.
     * @returns {Promise<void>} A promise that resolves when loading is complete.
     */
    async load() {
        const loadPromises = this.subScenes.map(scene => scene.load());
        await Promise.all(loadPromises);
    }

    /**
     * Clean up resources when the scene is destroyed or swapped out.
     * Use this to release memory, stop sounds, or remove event listeners.
     */
    unload() {
        this.subScenes.forEach(scene => scene.unload());
    }

    /**
     * Update the scene logic.
     * @param {number} deltaTime - Time elapsed since the last frame (in seconds).
     */
    update(deltaTime) {
        this.subScenes.forEach(scene => scene.update(deltaTime));
    }

    /**
     * Render the scene using the provided renderer.
     * The scene implementation should know how to use the specific renderer provided.
     * @param {Object} renderer - The rendering provider (e.g., CanvasRenderingContext2D, WebGLRenderer, etc.).
     */
    render(renderer) {
        this.subScenes.forEach(scene => scene.render(renderer));
    }

    /**
     * Handle input events.
     * @param {Object} inputState - The current state of inputs (keyboard, mouse, gamepad).
     */
    handleInput(inputState) {
        this.subScenes.forEach(scene => scene.handleInput(inputState));
    }

    /**
     * Handle window or container resize events.
     * @param {number} width - New width of the view.
     * @param {number} height - New height of the view.
     */
    onResize(width, height) {
        this.subScenes.forEach(scene => scene.onResize(width, height));
    }

    /**
     * Called when the scene is paused (e.g., menu opened, tab hidden).
     */
    pause() {
        this.subScenes.forEach(scene => scene.pause());
    }

    /**
     * Called when the scene is resumed.
     */
    resume() {
        this.subScenes.forEach(scene => scene.resume());
    }
}