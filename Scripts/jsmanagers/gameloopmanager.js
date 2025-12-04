// GameLoopManager.js
// Manages the main game loop and frame updates
import { gameEventManager } from './eventmanager.js';

export class GameLoopManager {
    constructor() {
        this.isRunning = false;
        this.updateCallback = null;
        this.frameId = null;
        this.lastTime = 0;
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
        this.lastTime = performance.now();
        this.frameId = requestAnimationFrame((t) => this.loop(t));
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
     * @param {number} timestamp
     */
    loop(timestamp) {
        if (!this.isRunning) return;

        // Calculate delta time in seconds
        if (!timestamp) timestamp = performance.now();
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Handle freeze frames
        if (gameEventManager.updateFreeze()) {
            this.frameId = requestAnimationFrame((t) => this.loop(t));
            return;
        }

        // Call the main update function
        if (this.updateCallback) {
            this.updateCallback(deltaTime);
        }

        // Schedule next frame
        this.frameId = requestAnimationFrame((t) => this.loop(t));
    }

    /**
     * Check if the game loop is running
     * @returns {boolean}
     */
    getIsRunning() {
        return this.isRunning;
    }
}
