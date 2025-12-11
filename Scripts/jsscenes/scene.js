/**
 * @fileoverview Base scene interface - renderer agnostic
 * 
 * This class provides the foundation for scene management and can be extended
 * for any rendering backend (Canvas 2D, WebGL, Three.js, etc.)
 * 
 * @module jsscenes/scene
 */

/**
 * @interface
 * Base class representing a game scene.
 * This class should be extended by specific scene implementations.
 * It is designed to be renderer-agnostic, allowing it to work with any rendering framework
 * (e.g., Canvas 2D, WebGL, Three.js, DOM-based, etc.) by accepting a generic renderer.
 */
export class IScene {
    constructor() {
        if (this.constructor === IScene) {
            throw new Error("IScene is an abstract class (interface) and cannot be instantiated directly.");
        }
        /** @type {Map<string, IScene>} */
        this.subScenes = new Map();
        /** @type {boolean} */
        this.enabled = true;
        /** @type {boolean} - Whether the scene has been initialized */
        this._initialized = false;
        /** @type {boolean} - Whether the scene resources are loaded */
        this._loaded = false;
    }

    // ============================================
    // PROPERTIES
    // ============================================

    /**
     * Whether the scene is enabled and should update/render
     * @returns {boolean}
     */
    get isEnabled() {
        return this.enabled;
    }

    /**
     * Whether the scene has been initialized
     * @returns {boolean}
     */
    get isInitialized() {
        return this._initialized;
    }

    /**
     * Whether the scene resources are loaded
     * @returns {boolean}
     */
    get isLoaded() {
        return this._loaded;
    }

    // ============================================
    // SUB-SCENE MANAGEMENT
    // ============================================

    /**
     * Add a subscene to this scene.
     * @param {string} name - Identifier for the subscene.
     * @param {IScene} scene - The scene to add.
     */
    addSubScene(name, scene) {
        if (typeof name !== "string" || !name.length) {
            console.warn("Attempted to add subscene without a valid name.");
            return;
        }

        if (scene instanceof IScene) {
            this.subScenes.set(name, scene);
        } else {
            console.warn("Attempted to add invalid scene as subscene.");
        }
    }

    /**
     * Remove a subscene from this scene.
     * @param {string} name - Identifier for the subscene to remove.
     */
    removeSubScene(name) {
        const scene = this.subScenes.get(name);
        if (scene) {
            scene.onDestroy();
        }
        this.subScenes.delete(name);
    }

    /**
     * Retrieve a previously registered subscene.
     * @param {string} name
     * @returns {IScene | undefined}
     */
    getSubScene(name) {
        return this.subScenes.get(name);
    }

    // ============================================
    // LIFECYCLE METHODS
    // ============================================

    /**
     * Initialize the scene with specific parameters.
     * Called when the scene is created or switched to.
     * @param {Object} [params] - Optional initialization parameters specific to the scene.
     */
    init(params) {
        this.subScenes.forEach(scene => scene.init(params));
        this._initialized = true;
    }

    /**
     * Load necessary resources (images, audio, data) for the scene.
     * Should be called before the scene starts updating or rendering.
     * @returns {Promise<void>} A promise that resolves when loading is complete.
     */
    async load() {
        const loadPromises = [];
        this.subScenes.forEach(scene => loadPromises.push(scene.load()));
        await Promise.all(loadPromises);
        this._loaded = true;
    }

    /**
     * Clean up resources when the scene is destroyed or swapped out.
     * Use this to release memory, stop sounds, or remove event listeners.
     */
    unload() {
        this.subScenes.forEach(scene => scene.unload());
        this._loaded = false;
    }

    /**
     * Called when scene is about to be destroyed permanently.
     * Override for final cleanup (remove event listeners, dispose GPU resources, etc.)
     */
    onDestroy() {
        this.subScenes.forEach(scene => scene.onDestroy());
        this.subScenes.clear();
        this._initialized = false;
        this._loaded = false;
    }

    // ============================================
    // UPDATE & RENDER (Core Game Loop)
    // ============================================

    /**
     * Update the scene logic.
     * Called every frame before render.
     * @param {number} deltaTime - Time elapsed since the last frame (in seconds or ms depending on your loop).
     */
    update(deltaTime) {
        this.subScenes.forEach(scene => {
            if (scene.enabled) {
                scene.update(deltaTime);
            }
        });
    }

    /**
     * Render the scene.
     * This is renderer-agnostic - subclasses should override and use their specific renderer.
     * 
     * For 2D Canvas: override in CanvasScene
     * For WebGL/Three.js: override in WebGLScene
     * 
     * @param {any} [renderer] - Optional renderer context (for flexibility)
     */
    render(renderer) {
        this.subScenes.forEach(scene => {
            if (scene.enabled) {
                scene.render(renderer);
            }
        });
    }

    /**
     * Late update - called after all regular updates.
     * Useful for camera follow, physics resolution, etc.
     * @param {number} deltaTime
     */
    lateUpdate(deltaTime) {
        this.subScenes.forEach(scene => {
            if (scene.enabled) {
                scene.lateUpdate(deltaTime);
            }
        });
    }

    /**
     * Fixed update - called at fixed intervals for physics.
     * @param {number} fixedDeltaTime - Fixed timestep
     */
    fixedUpdate(fixedDeltaTime) {
        this.subScenes.forEach(scene => {
            if (scene.enabled) {
                scene.fixedUpdate(fixedDeltaTime);
            }
        });
    }

    // ============================================
    // INPUT HANDLING
    // ============================================

    /**
     * Handle input events.
     * @param {Object} inputState - The current state of inputs (keyboard, mouse, gamepad).
     */
    handleInput(inputState) {
        this.subScenes.forEach(scene => {
            if (scene.enabled) {
                scene.handleInput(inputState);
            }
        });
    }

    // ============================================
    // RESIZE HANDLING
    // ============================================

    /**
     * Handle window or container resize events.
     * @param {number} width - New width of the view.
     * @param {number} height - New height of the view.
     */
    onResize(width, height) {
        this.subScenes.forEach(scene => scene.onResize(width, height));
    }

    // ============================================
    // ENABLE/DISABLE MANAGEMENT
    // ============================================

    /**
     * Enable this scene
     */
    enable() {
        if (!this.enabled) {
            this.enabled = true;
            this.onEnabled();
        }
    }

    /**
     * Disable this scene
     */
    disable() {
        if (this.enabled) {
            this.enabled = false;
            this.onDisabled();
        }
    }

    /**
     * Disable a subscene by key
     * @param {String} sceneKey 
     */
    disableSubScene(sceneKey) {
        const subScene = this.subScenes.get(sceneKey);
        if (subScene != null) {
            subScene.disable();
        }
    }

    /**
     * Enable a subscene by key
     * @param {String} sceneKey 
     */
    enableSubScene(sceneKey) {
        const subScene = this.subScenes.get(sceneKey);
        if (subScene != null) {
            subScene.enable();
        }
    }

    /**
     * Called when scene becomes active.
     * Override in subclasses for scene-specific activation logic.
     */
    onEnabled() {
        // Override in subclass
    }

    /**
     * Called when scene becomes inactive.
     * Override in subclasses for scene-specific deactivation logic.
     */
    onDisabled() {
        // Override in subclass
    }

    // ============================================
    // PAUSE/RESUME (optional)
    // ============================================

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