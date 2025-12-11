import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { changeDifficultyEvent, startGameEvent } from "../jsutils/ui/uieventhandler.js";
import { UISize } from "../jsutils/ui/uisize.js";
import { createTextButtonCentered, createSliderCentered } from "../jsutils/ui/uiutil.js";
import { CanvasScene } from "./canvasscene.js";
import { ServiceKeys } from "../jscore/servicecontainer.js";

/**
 * Menu scene - handles main menu UI and navigation
 * Self-contained scene that manages its own UI elements and rendering
 */
export class MenuScene extends CanvasScene {

    // =========================================================================
    // CONSTRUCTION
    // =========================================================================

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(ctx) {
        super(ctx);      
    }

    // =========================================================================
    // SERVICE ACCESSORS
    // =========================================================================

    /**
     * Get event manager from services (fallback to global for backwards compatibility)
     * @returns {import("../jsmanagers/eventmanager.js").EventManager}
     */
    get eventManager() {
        return this.services?.get(ServiceKeys.EventManager) ?? gameEventManager;
    }

    // =========================================================================
    // LIFECYCLE
    // =========================================================================

    init(){
        super.init();
        this.createMenuUI();
    }

    /**
     * Called when scene becomes active
     * @override
     */
    onEnabled() {
        super.onEnabled();
        // Menu-specific enable logic (e.g., play menu music)
    }

    /**
     * Called when scene becomes inactive
     * @override
     */
    onDisabled() {
        super.onDisabled();
        // Menu-specific disable logic (e.g., stop menu music)
    }

    // =========================================================================
    // UI CREATION
    // =========================================================================

    /**
     * Creates all menu UI elements
     */
    createMenuUI() {
        const centerX = this.ctx.canvas.width / 2;
        const centerY = this.ctx.canvas.height / 2;
        
        // Start Button        
        this.canvasUIElements.push(createTextButtonCentered(
            centerX,
            centerY,
            UISize.ButtonCommon,
            "Start",
            this.ctx,
            () => this.onStartGame(),
        )); 
        
        // Difficulty Slider
        const difficultySlider = createSliderCentered(
            centerX,
            centerY,
            UISize.Slider,
            /** @type {string[]} */ (["Level0", "Level1", "Level2"]),
            this.ctx,
            /** @param {number} index */
            (index) => this.onDifficultyChanged(index)
        );
        this.canvasUIElements.push(difficultySlider);
    }

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================

    /**
     * Called when start button is clicked
     */
    onStartGame() {
        this.eventManager.emit(startGameEvent);
    }

    /**
     * Called when difficulty slider changes
     * @param {number} index - The selected difficulty index
     */
    onDifficultyChanged(index) {
        this.eventManager.emit(changeDifficultyEvent, index);
    }

    // =========================================================================
    // UPDATE & RENDER
    // =========================================================================

    /**
     * Update menu scene
     * @param {number} deltaTime
     * @override
     */
    update(deltaTime) {
        super.update(deltaTime);
        // Menu-specific update logic (e.g., background animations)
    }

    /**
     * Render menu scene
     * @override
     */
    render() {
        // Draw background (can be customized)
        this.drawBackground();
        
        // Draw UI elements (buttons, sliders)
        this.drawUI();
    }

    /**
     * Draw menu background
     */
    drawBackground() {
        // Default: clear with a solid color
        // Can be overridden for animated backgrounds
        // Currently handled by RenderManager.clearScreen()
    }

    // =========================================================================
    // RESOURCE LIFECYCLE
    // =========================================================================

    /**
     * Load menu-specific resources
     * Called before scene becomes active
     * @returns {Promise<void>}
     */
    async load() {
        await super.load();
        
        // Menu-specific resource loading
        // For example: menu music, background images, title graphics
        
        console.log("MenuScene resources loaded");
    }

    /**
     * Unload menu-specific resources
     * Called when scene is swapped out or destroyed
     */
    unload() {
        console.log("MenuScene unloading resources");
        
        // Release menu-specific resources
        // Stop menu music, clear background images, etc.
        
        super.unload();
    }
}