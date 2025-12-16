// GameInitializer.js
// Handles game initialization and resource loading
import * as Eventhandler from '../jsutils/events/eventhandlers.js';
import { AIController } from '../jsai/aicontroller.js';
import { GameManager } from './gamemanager.js';
import { setupTutorials } from '../jsutils/tutorial/tutorialhelper.js';
import { setupUIUtil } from '../jsutils/ui/uiutil.js';
import { InputManager } from './inputmanager.js';
import { DebugLevel, debugManager } from './debugmanager.js';

export class GameInitializer {
    /**
     * 
     * @param {GameManager} gameManager 
     */
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

            // Load all resources (manifest-based)
            await this.gameManager.resourceManager.trytoLoadAllResources();
            this.gameManager.resources = this.gameManager.resourceManager.getResources();

            // Update character manager with resources
            this.gameManager.characterManager.resources = this.gameManager.resources;
            
            // Pass animation paths from manifest to character manager
            this.gameManager.characterManager.setAnimationPaths(
                this.gameManager.resourceManager.getAnimationPaths()
            );

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
            this.gameManager.aiController.setDifficulty(this.gameManager.gameState.difficulty);
            this.gameManager.tutorialManager.setAIController(this.gameManager.aiController);
            
            // Register AI controller with service container
            this.gameManager.registerAIController(this.gameManager.aiController);

            // Setup tick manager for AI updates
            this.gameManager.tickManager.append((currentTick) => this.aiControllerUpdate(currentTick));
            // Initialize UIManager
            this.gameManager.uiManager.initialize();
            // Initialize event manager with service container
            Eventhandler.initialize(
                this.gameManager.services,
                this.gameManager.rootScene
            );
            // Initialize charactermanger
            this.gameManager.characterManager.initialize(this.gameManager.resources);
            // Set up tutorials
            setupTutorials(this.gameManager.tutorialManager);
            // Set up UIUtil
            setupUIUtil(this.gameManager.inputManager, this.gameManager.resourceManager);
            // Set up root scene
            this.gameManager.rootScene.init();
            // Finalize
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
