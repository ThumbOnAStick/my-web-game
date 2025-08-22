// GameLoopManager.js
// Manages the main game loop and frame updates
import { gameEventManager } from './eventmanager.js';

export class GameLoopManager {
    constructor() {
        this.isRunning = false;
        this.updateCallback = null;
        this.frameId = null;
    }

    /**
     * Set the update callback function
     * @param {Function} callback - The function to call each frame
     */
    setUpdateCallback(callback) {
        this.updateCallback = callback;
    }

    /**
     * Start the game loop
     */
    start() {
        if (this.isRunning) {
            console.warn('Game loop is already running');
            return;
        }
        
        this.isRunning = true;
        this.loop();
    }

    /**
     * Stop the game loop
     */
    stop() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        this.isRunning = false;
    }

    /**
     * Main game loop
     */
    loop() {
        if (!this.isRunning) return;

        // Handle freeze frames
        if (gameEventManager.updateFreeze()) {
            this.frameId = requestAnimationFrame(() => this.loop());
            return;
        }

        // Call the main update function
        if (this.updateCallback) {
            this.updateCallback();
        }

        // Schedule next frame
        this.frameId = requestAnimationFrame(() => this.loop());
    }

    /**
     * Check if the game loop is running
     * @returns {boolean}
     */
    getIsRunning() {
        return this.isRunning;
    }
}
