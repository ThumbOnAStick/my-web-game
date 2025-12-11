/**
 * @fileoverview Generic service container for game framework dependency injection
 * 
 * Provides a centralized way to register and retrieve services,
 * enabling loose coupling between modules. This implementation is
 * game-agnostic and can be reused across different projects.
 * 
 * @module jscore/servicecontainer
 * @version 1.0.0
 */

/**
 * Standard service keys for common game services
 * Use these to avoid typos and enable autocomplete
 * You can extend with custom keys as needed
 * 
 * @readonly
 * @enum {string}
 */
export const ServiceKeys = Object.freeze({
    // Core systems
    INPUT: 'core.input',
    TIME: 'core.time',
    EVENTS: 'core.events',
    GAME_LOOP: 'core.gameLoop',
    GAME_STATE: 'core.gameState',
    
    // Entity management
    ENTITIES: 'entities.manager',
    COLLISION: 'entities.collision',
    
    // Resources & rendering
    RESOURCES: 'resources.manager',
    AUDIO: 'resources.audio',
    RENDER: 'render.manager',
    VFX: 'render.vfx',
    
    // AI & gameplay
    AI: 'gameplay.ai',
    SCORE: 'gameplay.score',
    SEQUENCE: 'gameplay.sequence',
    
    // Scene management
    SCENES: 'scenes.manager',
    
    // Persistence
    STORAGE: 'storage.manager',
    
    // Debug
    DEBUG: 'debug.manager'
});

/**
 * A simple dependency injection container for managing services.
 * Services are registered with string keys and can be retrieved later.
 * 
 * @example
 * const container = new ServiceContainer();
 * container.register(ServiceKeys.INPUT, new InputManager(canvas));
 * const input = container.get(ServiceKeys.INPUT);
 */
export class ServiceContainer {
    constructor() {
        /** @type {Map<string, any>} */
        this._services = new Map();
        
        /** @type {Map<string, function(): any>} */
        this._factories = new Map();
    }

    /**
     * Register a service instance
     * @param {string} key - The service key (use ServiceKeys enum)
     * @param {any} service - The service instance
     * @returns {ServiceContainer} - Returns this for chaining
     */
    register(key, service) {
        if (this._services.has(key)) {
            console.warn(`Service '${key}' is being overwritten`);
        }
        this._services.set(key, service);
        return this;
    }

    /**
     * Register a factory function for lazy instantiation
     * The factory will be called once when the service is first requested
     * @param {string} key - The service key
     * @param {function(): any} factory - Factory function that creates the service
     * @returns {ServiceContainer} - Returns this for chaining
     */
    registerFactory(key, factory) {
        this._factories.set(key, factory);
        return this;
    }

    /**
     * Get a service by key
     * @param {string} key - The service key
     * @returns {any} - The service instance
     * @throws {Error} If service is not registered
     */
    get(key) {
        // Check if already instantiated
        if (this._services.has(key)) {
            return this._services.get(key);
        }

        // Check for factory
        if (this._factories.has(key)) {
            const factory = this._factories.get(key);
            const service = factory();
            this._services.set(key, service);
            this._factories.delete(key);
            return service;
        }

        throw new Error(`Service '${key}' not registered. Available: ${this.listServices().join(', ')}`);
    }

    /**
     * Try to get a service, returns null if not found
     * @param {string} key - The service key
     * @returns {any|null} - The service instance or null
     */
    tryGet(key) {
        try {
            return this.get(key);
        } catch {
            return null;
        }
    }

    /**
     * Check if a service is registered
     * @param {string} key - The service key
     * @returns {boolean}
     */
    has(key) {
        return this._services.has(key) || this._factories.has(key);
    }

    /**
     * Remove a service
     * @param {string} key - The service key
     * @returns {boolean} - True if service was removed
     */
    unregister(key) {
        const hadService = this._services.delete(key);
        const hadFactory = this._factories.delete(key);
        return hadService || hadFactory;
    }

    /**
     * List all registered service keys
     * @returns {string[]}
     */
    listServices() {
        const serviceKeys = Array.from(this._services.keys());
        const factoryKeys = Array.from(this._factories.keys());
        return [...new Set([...serviceKeys, ...factoryKeys])];
    }

    /**
     * Clear all registered services
     */
    clear() {
        this._services.clear();
        this._factories.clear();
    }

    /**
     * Create a child container that inherits from this one
     * Useful for scoped services (e.g., per-scene services)
     * @returns {ServiceContainer}
     */
    createChild() {
        const child = new ServiceContainer();
        child._parent = this;
        
        // Override get to check parent
        const originalGet = child.get.bind(child);
        child.get = (key) => {
            if (child._services.has(key) || child._factories.has(key)) {
                return originalGet(key);
            }
            return this.get(key);
        };
        
        const originalHas = child.has.bind(child);
        child.has = (key) => {
            return originalHas(key) || this.has(key);
        };
        
        return child;
    }
}

/**
 * Global service container instance
 * Use this for application-wide services
 */
export const globalServices = new ServiceContainer();
