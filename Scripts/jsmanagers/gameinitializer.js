// GameInitializer.js
// Handles game initialization and resource loading
import * as Eventhandler from '../jsutils/eventhandlers.js';
import { AIController } from '../jsai/aicontroller.js';

export class GameInitializer {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.isInitialized = false;
    }

    /**
     * Initialize the entire game system
     */
    async initialize() {
        try {
            // Show loading screen
            this.gameManager.renderManager.drawLoadingScreen();

            // Load all resources
            await this.gameManager.resourceManager.trytoLoadAllResources();
            this.gameManager.resources = this.gameManager.resourceManager.getResources();

            // Update character manager with resources
            this.gameManager.characterManager.resources = this.gameManager.resources;

            // Initialize VFX manager after resources are loaded
            this.gameManager.initializeVFXManager();

            // Create and load characters
            await this.gameManager.characterManager.loadCharacters();
            await this.gameManager.characterManager.loadAnimations();

            // Set character reference for input manager (player is first character)
            this.gameManager.inputManager.setCharacter(this.gameManager.characterManager.getPlayer());

            // Set character reference for AI controller
            this.gameManager.aiController = new AIController(
                this.gameManager.characterManager.getOpponent(), 
                this.gameManager.characterManager.getPlayer()
            );

            // Setup tick manager for AI updates
            this.gameManager.tickManager.append((currentTick) => this.aiControllerUpdate(currentTick));

            // Initialize event manager
            Eventhandler.initialize(
                this.gameManager.obstacleManager, 
                this.gameManager.vfxManager, 
                this.gameManager.audioManager
            );

            this.isInitialized = true;
            console.log('Game initialized successfully');

        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    /**
     * AI controller update callback
     * @param {number} currentTick - Current game tick
     */
    aiControllerUpdate(currentTick) {
        if (this.gameManager.aiController) {
            this.gameManager.aiController.update(currentTick);
        }
    }

    /**
     * Check if the game is initialized
     * @returns {boolean}
     */
    getIsInitialized() {
        return this.isInitialized;
    }
}
