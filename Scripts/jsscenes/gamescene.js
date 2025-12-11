// oxlint-disable no-unused-vars
import { DebugLevel, debugManager } from "../jsmanagers/debugmanager.js";
import { ServiceContainer, ServiceKeys } from "../jscore/servicecontainer.js";
import { CanvasScene } from "./canvasscene.js";

const labelPlayer = "Player";
const labelPC = "PC";

export class GameScene extends CanvasScene {
    /**
     * Creates a GameScene with dependency injection via service container
     * @param {CanvasRenderingContext2D} ctx
     * @param {ServiceContainer} services - Service container with all required services
     */
    constructor(ctx, services) {
        super(ctx);
        
        if (!(services instanceof ServiceContainer)) {
            throw new Error('GameScene requires a ServiceContainer instance');
        }
        
        /** @type {ServiceContainer} */
        this.services = services;
    }

    // ============================================
    // Service Accessors (lazy getters)
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
    
    /** @returns {import('../jsai/aicontroller.js').AIController} */
    get aiController() { 
        return this.services.get(ServiceKeys.AI); 
    }

    /**
     * @param {Number} deltaTime 
     */
    update(deltaTime) {
        super.update(deltaTime);

        this.inputManager.update();

        // Ticks update
        this.tickManager.update();

        // Check obstacle manager
        this.obstacleManager.update(this.characterManager.getCharacters());

        // Manage VFX
        this.vfxManager.update();

        // Update tutorial manager
        this.tutorialManager.update();

        // Update score, check game state
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
    }

    onEnabled() {
        console.log(`Game state difficulty: ${this.gameState.difficulty}`);
        
        // Startup tutorial
        if (this.gameState.difficulty < 1) {
            this.tutorialManager.start();
        }

        // Startup AI controller
        if (!this.services.has(ServiceKeys.AI)) {
            debugManager.popMessage("AI service not registered.", DebugLevel.Error);
            return;
        }
        this.aiController.setDifficulty(this.gameState.difficulty);
    }
}