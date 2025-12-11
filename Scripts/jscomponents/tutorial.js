import { gameEventManager } from "../jsmanagers/eventmanager.js";

/**
 * Base class for tutorial steps.
 * Tutorials listen for events and complete when certain conditions are met.
 */
export class Tutorial {
    /**
     * @param {import('../jsmanagers/eventmanager.js').EventManager} [eventManager] - Optional event manager (defaults to singleton)
     */
    constructor(eventManager = null) {
        this.isCompleted = false;
        this.onComplete = null;
        this.subtitle = "";
        /** @type {import('../jsmanagers/eventmanager.js').EventManager} */
        this._eventManager = eventManager || gameEventManager;
    }

    /**
     * Get the event manager for this tutorial
     * @returns {import('../jsmanagers/eventmanager.js').EventManager}
     */
    get eventManager() {
        return this._eventManager;
    }

    /**
     * Set the event manager (useful for dependency injection)
     * @param {import('../jsmanagers/eventmanager.js').EventManager} manager
     */
    setEventManager(manager) {
        this._eventManager = manager;
    }

    start() {
        this.isCompleted = false;
        this.bindEvents();
    }

    complete() {
        if (this.isCompleted) return;
        this.isCompleted = true;
        this.unbindEvents();
        if (this.onComplete) {
            this.onComplete();
        }
    }

    bindEvents() {
        // Override in subclass
    }

    unbindEvents() {
        // Override in subclass
    }
}
