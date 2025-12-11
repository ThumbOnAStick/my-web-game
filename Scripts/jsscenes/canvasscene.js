// oxlint-disable no-unused-vars
import { gameEventManager } from '../jsmanagers/eventmanager.js';
import { UIElementCanvas } from '../jsuielements/ctx/uielement.js';
import { translationChanged } from '../jsutils/ui/uieventhandler.js';
import { IScene } from './scene.js';
import { ServiceContainer, ServiceKeys } from '../jscore/servicecontainer.js';

/**
 * Base class for scenes that render to a HTML5 Canvas.
 * Extends IScene to provide canvas-specific functionality.
 */
export class CanvasScene extends IScene {
    /**
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {ServiceContainer} [services] - Optional service container for dependency injection
     */
    constructor(ctx, services = null) {
        super();
        this.ctx = ctx;
        /** @type {ServiceContainer|null} */
        this._services = services;
        /**@type {UIElementCanvas[]} */
        this.canvasUIElements = [];
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

    init() {
        super.init();
        this.eventManager.on(translationChanged, this.onTranslationChanged);
        this.canvasUIElements.forEach(element => {
            element.init();
        });
    }

    /**
     * Render the scene using the Canvas 2D context.
     */
    render() {
        super.render();
        // Runtime check to ensure we are using the correct renderer
        if (!(this.ctx instanceof CanvasRenderingContext2D)) {
            console.warn("CanvasScene: Renderer is not a CanvasRenderingContext2D. Skipping render.");
            return;
        }

        this.draw();
    }

    /**
     * 
     * @param {Number} deltaTime 
     */
    update(deltaTime) {
        super.update(deltaTime)
        this.canvasUIElements.forEach(element => {
            element.update();
        });
    }

    /**
     * Draw UI elements.
     */
    draw() {
        this.canvasUIElements.forEach(element => {
            element.draw();
        });
    }

    unload() {
        super.unload();
        this.canvasUIElements.forEach(element => {
            element.dispose();
        });
    }

    /**
     * 
     * @param {UIElementCanvas} uiElement 
     */
    registerUIElement(uiElement) {
        this.canvasUIElements.push(uiElement);
    }

    /**
     * Changes all translations of UI elements, called when the resource manager changes translations
     */
    onTranslationChanged() {
        this.canvasUIElements.forEach(element => {
            element.changeTranslations();
        });
    }

}
