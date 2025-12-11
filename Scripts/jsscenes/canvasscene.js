// oxlint-disable no-unused-vars
/**
 * @fileoverview Canvas 2D Scene implementation
 * 
 * Extends IScene for HTML5 Canvas 2D rendering.
 * For 3D/WebGL, create a separate WebGLScene or ThreeScene class.
 * 
 * @module jsscenes/canvasscene
 */

import { gameEventManager } from '../jsmanagers/eventmanager.js';
import { UIElementCanvas } from '../jsuielements/ctx/uielement.js';
import { translationChanged } from '../jsutils/ui/uieventhandler.js';
import { IScene } from './scene.js';
import { ServiceContainer, ServiceKeys } from '../jscore/servicecontainer.js';

/**
 * Base class for scenes that render to HTML5 Canvas 2D.
 * Extend this for any 2D canvas-based scene.
 * 
 * For WebGL/Three.js scenes, create a separate WebGLScene class that extends IScene.
 * 
 * @extends IScene
 */
export class CanvasScene extends IScene {
    /**
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
     * @param {ServiceContainer} [services] - Optional service container for dependency injection
     */
    constructor(ctx, services = null) {
        super();
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        /** @type {ServiceContainer|null} */
        this._services = services;
        /** @type {UIElementCanvas[]} */
        this.uiElements = [];
    }

    // ============================================
    // SERVICE ACCESSORS
    // ============================================

    /**
     * Get the service container
     * @returns {ServiceContainer|null}
     */
    get services() {
        return this._services;
    }

    /**
     * Set the service container (for late initialization)
     * @param {ServiceContainer} container
     */
    set services(container) {
        this._services = container;
    }

    /**
     * Get the event manager (from services if available, otherwise singleton)
     * @returns {import('../jsmanagers/eventmanager.js').EventManager}
     */
    get eventManager() {
        if (this._services?.has(ServiceKeys.EVENTS)) {
            return this._services.get(ServiceKeys.EVENTS);
        }
        return gameEventManager;
    }

    // ============================================
    // LIFECYCLE METHODS
    // ============================================

    /**
     * Initialize the scene
     * @param {Object} [params]
     */
    init(params) {
        super.init(params);
        
        // Subscribe to translation changes
        this.eventManager.on(translationChanged, this._boundOnTranslationChanged = this.onTranslationChanged.bind(this));
        
        // Initialize UI elements
        for (const element of this.uiElements) {
            element.init();
        }
    }

    /**
     * Unload scene resources
     */
    unload() {
        super.unload();
        
        // Unsubscribe from events
        if (this._boundOnTranslationChanged) {
            this.eventManager.off?.(translationChanged, this._boundOnTranslationChanged);
        }
        
        // Dispose UI elements
        for (const element of this.uiElements) {
            element.dispose?.();
        }
    }

    /**
     * Called when scene is destroyed
     */
    onDestroy() {
        this.unload();
        this.uiElements = [];
        super.onDestroy();
    }

    // ============================================
    // UPDATE METHODS
    // ============================================

    /**
     * Update scene logic
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        if (!this.enabled) return;
        
        // Update subscenes
        super.update(deltaTime);
        
        // Update UI elements
        for (const element of this.uiElements) {
            element.update?.();
        }
    }

    // ============================================
    // RENDER METHODS
    // ============================================

    /**
     * Render the scene
     * Override in subclasses to add custom rendering before/after UI
     */
    render() {
        if (!this.enabled) return;
        
        // Render subscenes first (back to front)
        super.render();
        
        // Draw UI elements on top
        this.drawUI();
    }

    /**
     * Draw all UI elements
     * Called by render() after subscenes
     */
    drawUI() {
        for (const element of this.uiElements) {
            if (element.isVisible !== false) {
                element.draw?.();
            }
        }
    }

    /**
     * @deprecated Use drawUI() instead
     */
    draw() {
        this.drawUI();
    }

    // ============================================
    // UI ELEMENT MANAGEMENT
    // ============================================

    /**
     * Register a UI element with this scene
     * @param {UIElementCanvas} uiElement 
     */
    registerUIElement(uiElement) {
        this.uiElements.push(uiElement);
        
        // If scene is already initialized, init the element too
        if (this.isInitialized) {
            uiElement.init?.();
        }
    }

    /**
     * Remove a UI element from this scene
     * @param {UIElementCanvas} uiElement 
     * @returns {boolean} Whether the element was found and removed
     */
    unregisterUIElement(uiElement) {
        const index = this.uiElements.indexOf(uiElement);
        if (index > -1) {
            this.uiElements.splice(index, 1);
            uiElement.dispose?.();
            return true;
        }
        return false;
    }

    /**
     * Remove all UI elements
     */
    clearUIElements() {
        for (const element of this.uiElements) {
            element.dispose?.();
        }
        this.uiElements = [];
    }

    // ============================================
    // LEGACY SUPPORT
    // ============================================

    /**
     * @deprecated Use uiElements instead
     */
    get canvasUIElements() {
        return this.uiElements;
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Called when translations change
     * Override in subclasses for custom behavior
     */
    onTranslationChanged() {
        for (const element of this.uiElements) {
            element.changeTranslations?.();
        }
    }
}
