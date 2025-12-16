// oxlint-disable no-unused-vars
/**
 * @fileoverview Main gameplay scene
 * 
 * GameScene owns all gameplay logic including:
 * - Character/entity updates
 * - Combat and collision
 * - VFX and rendering
 * - Tutorial progression
 * 
 * @module jsscenes/gamescene
 */

import { DebugLevel, debugManager } from "../jsmanagers/debugmanager.js";
import { ServiceContainer, ServiceKeys } from "../jscore/servicecontainer.js";
import { CanvasScene } from "./canvasscene.js";

const labelPlayer = "Player";
const labelPC = "PC";

/**
 * Main gameplay scene that manages all game entities and rendering
 * @extends CanvasScene
 */
export class GameScene extends CanvasScene {
    /**
     * Creates a GameScene with dependency injection via service container
     * @param {CanvasRenderingContext2D} ctx
     * @param {ServiceContainer} services - Service container with all required services
     */
    constructor(ctx, services) {
        super(ctx, services);
        
        if (!(services instanceof ServiceContainer)) {
            throw new Error('GameScene requires a ServiceContainer instance');
        }
    }

    // ============================================
    // SERVICE ACCESSORS
    // ============================================
    
    /** @returns {import('../jsmanagers/inputmanager.js').InputManager} */
    get inputManager() { 
        return this.services.get(ServiceKeys.INPUT); 
    }
    
    /** @returns {import('../jsmanagers/tickmanager.js').TickManager} */
    get tickManager() { 
        return this.services.get(ServiceKeys.TIME); 
    }
    
    /** @returns {import('../jsmanagers/charactermanager.js').CharacterManager} */
    get characterManager() { 
        return this.services.get(ServiceKeys.ENTITIES); 
    }
    
    /** @returns {import('../jsmanagers/obstaclemanager.js').ObstacleManager} */
    get obstacleManager() { 
        return this.services.get(ServiceKeys.COLLISION); 
    }
    
    /** @returns {import('../jscomponents/gamestate.js').GameState} */
    get gameState() { 
        return this.services.get(ServiceKeys.GAME_STATE); 
    }
    
    /** @returns {import('../jsmanagers/tutorialmanager.js').TutorialManager} */
    get tutorialManager() { 
        return this.services.get(ServiceKeys.SEQUENCE); 
    }
    
    /** @returns {import('../jsmanagers/vfxmanager.js').VFXManager} */
    get vfxManager() { 
        return this.services.get(ServiceKeys.VFX); 
    }
    
    /** @returns {import('../jsmanagers/gameloopmanager.js').GameLoopManager} */
    get gameLoopManager() { 
        return this.services.get(ServiceKeys.GAME_LOOP); 
    }
    
    /** @returns {import('../jsai/aicontroller.js').AIController|null} */
    get aiController() { 
        return this.services.tryGet(ServiceKeys.AI); 
    }

    /** @returns {import('../jsmanagers/rendermanager.js').RenderManager} */
    get renderManager() { 
        return this.services.get(ServiceKeys.RENDER); 
    }

    /** @returns {import('../jsmanagers/resourcemanager.js').ResourceManager} */
    get resourceManager() { 
        return this.services.get(ServiceKeys.RESOURCES); 
    }

    /** @returns {import('../jsmanagers/debugmanager.js').DebugManager} */
    get debugManager() { 
        return this.services.tryGet(ServiceKeys.DEBUG) ?? debugManager; 
    }

    // ============================================
    // UPDATE METHODS
    // ============================================

    /**
     * Update all game logic
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        if (!this.enabled) return;

        // Input processing
        this.inputManager.update();

        // Time/tick updates
        this.tickManager.update();

        // === ENTITY UPDATES (moved from GameManager) ===
        this.characterManager.update(deltaTime);

        // Collision detection
        this.obstacleManager.update(this.characterManager.getCharacters());

        // Visual effects
        this.vfxManager.update();

        // Tutorial/sequence updates
        this.tutorialManager.update();

        // Score tracking
        this.gameState.updatePlayerScore(
            this.characterManager.getPlayerScore(),
            labelPlayer,
            labelPC
        );
        this.gameState.updateOpponentScore(
            this.characterManager.getOpponentScore(),
            labelPlayer,
            labelPC
        );

        // Update child scenes and UI elements
        super.update(deltaTime);
    }

    // ============================================
    // RENDER METHODS
    // ============================================

    /**
     * Render all game visuals
     */
    render() {
        if (!this.enabled) return;

        // === CHARACTER RENDERING ===
        const resources = this.resourceManager.resources;
        const isDebug = this.debugManager?.isDebugMode?.() ?? false;
        
        this.renderManager.drawCharacters(
            this.characterManager.getCharacters(),
            resources,
            isDebug,
            this.gameState,
            this.inputManager,
            this.resourceManager
        );

        // === VFX RENDERING ===
        this.renderManager.drawVFX();

        // Render child scenes and UI elements
        super.render();
    }

    // ============================================
    // LIFECYCLE HOOKS
    // ============================================

    /**
     * Called when scene becomes active
     */
    onEnabled() {
        console.log(`GameScene enabled. Difficulty: ${this.gameState.difficulty}`);
        
        // Start tutorial if on lowest difficulty
        if (this.gameState.difficulty < 1) {
            this.tutorialManager.start();
        }

        // Configure AI controller
        const ai = this.aiController;
        if (ai) {
            ai.setDifficulty(this.gameState.difficulty);
        } else {
            debugManager.popMessage("AI service not registered.", DebugLevel.Warning);
        }
    }

    /**
     * Called when scene becomes inactive
     */
    onDisabled() {
        console.log("GameScene disabled");
        // Could pause AI, stop sounds, etc.
    }

    // ============================================
    // RESOURCE LIFECYCLE
    // ============================================

    /**
     * Load scene-specific resources
     * Called before scene becomes active
     * @returns {Promise<void>}
     */
    async load() {
        await super.load();
        
        // Load gameplay bundle from manifest
        await this.resourceManager.loadBundle('gameplay');
        
        console.log("GameScene resources loaded");
    }

    /**
     * Unload scene-specific resources
     * Called when scene is swapped out or destroyed
     */
    unload() {
        console.log("GameScene unloading resources");
        
        // Release scene-specific resources
        // Stop gameplay audio, clear cached level data, etc.
        
        super.unload();
    }

    /**
     * Called when scene is destroyed
     */
    onDestroy() {
        console.log("GameScene destroyed");
        super.onDestroy();
    }
}