// GameManager.js
// Main game manager that coordinates all systems
import * as Eventhandler from '../jsutils/eventhandlers.js';
import { ObstacleManager } from './obstaclemanager.js';
import { GameState } from '../jscomponents/gamestate.js';
import { gameEventManager } from './eventmanager.js';
import { Character } from '../jsgameobjects/character.js';
import { Resources } from '../jscomponents/resources.js';
import { InputManager } from './inputmanager.js';
import { ResourceManager } from './resourcemanager.js';
import { UIManager } from './uimanager.js';
import { AIController } from '../jsai/aicontroller.js';

export class GameManager {
    constructor(canvas, ctx) {
        this.isInitialized = false;
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameOver = false;
        /**@type {Character[]} */
        this.characters = [];
        /**@type {AIController} */
        this.aiController = null;
        /**@type {Resources} */
        this.resources = null;

        // Ticks system
        this.tickInterval = 16; // 16ms = ~60 ticks per second
        this.lastTickTime = 0;
        this.currentTick = 0;

        // Initialize game state
        this.gameState = new GameState();

        // Initialize managers
        this.inputManager = new InputManager();
        this.obstacleManager = new ObstacleManager();
        this.resourceManager = new ResourceManager();
        this.uiManager = new UIManager(ctx, canvas);
        // Set up manager references
        this.inputManager.setGameManager(this);

        // Set up debug checkbox
        /**@type {HTMLInputElement} */
        this.debugCheckbox = /** @type {HTMLInputElement} */ (document.getElementById('debugCheckbox'));
        this.setupDebugControls();
    }

    async initialize() {
        try {
            // Show loading screen
            this.uiManager.drawLoadingScreen();

            // Load all resources
            await this.resourceManager.loadAllResources();

            this.resources = this.resourceManager.getResources();

            // Create characters
            await this.loadCharacters();

            // Load animations
            await this.loadAnimations();

            // Set character reference for input manager (player is first character)
            this.inputManager.setCharacter(this.characters[0]);

            //Set  character reference for ai controller
            this.aiController = new AIController(this.characters[1], this.characters[0]);

            // Initialize evenet manager
            Eventhandler.initialize(this.obstacleManager)

            this.isInitialized = true;
            console.log('Game initialized successfully');

        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    async loadCharacters() {
        const characterHeight = 60;

        // Player character
        const player = new Character(
            50,
            this.canvas.height - characterHeight / 2,
            40, // width
            characterHeight, // height
            this.resources
        );

        // Opponent character
        const opponent = new Character(
            this.canvas.width - 100,
            this.canvas.height - characterHeight / 2,
            40, // width
            characterHeight, // height
            this.resources,
            true
        );

        this.characters = [player, opponent];
    }

    async loadAnimations() {
        try {
            // Load animations for all characters
            for (const character of this.characters) {
                await character.loadAnimation('idle', './Assets/character_idle_animation.csv');
                await character.loadAnimation('swing', './Assets/character_swing_animation.csv');
                await character.loadAnimation('dodge', './Assets/character_dodge_animation.csv');
            }
            console.log('Animations loaded successfully');
        } catch (error) {
            console.error('Failed to load animations:', error);
        }
    }

    start() {
        if (!this.isInitialized) {
            console.warn('Game not initialized yet');
            return;
        }
        this.update();
    }

    update() {
        // Handle game over state - check both local and GameState
        if (this.gameOver || this.gameState.isGameOver) {
            this.uiManager.drawGameOver();
            requestAnimationFrame(() => this.update());
            return;
        }

        requestAnimationFrame(() => this.update());

        // Ticks system
        const now = Date.now();
        if (now - this.lastTickTime >= this.tickInterval) {
            this.currentTick++;
            this.lastTickTime = now;
            
            // Run tick-based updates
            this.tickUpdate();
        }

        // Clear screen
        this.uiManager.clearScreen();

        // Handle input and movement (only for player - first character)
        this.inputManager.handleMovement(this.characters[0]);

        // Update all characters (every frame)
        for (const character of this.characters) {
            character.update(this.canvas);
        }

        // Update event manager for delayed events
        gameEventManager.update();

        // Check obstacle manager
        this.obstacleManager.update();

        // Check collisions 
        this.obstacleManager.handleCharacterCollisions(this.characters);

        // Draw everything
        this.draw();
    }

    /**
     * Updates that should run at fixed tick intervals
     */
    tickUpdate() {
        // AI updates at fixed intervals
        this.aiController.update(this.currentTick);
    }

    draw() {
        // Draw all characters
        for (const character of this.characters) {
            character.draw(this.ctx, this.resources, this.debugCheckbox.checked);
            if (!character.isOpponent) {
                // Use GameState scores for player
                this.uiManager.drawScoreBar(character, 10, this.gameState.characterScore);
                this.uiManager.drawDebugInfo(character, this.gameState, this.debugCheckbox.checked);
            } else {
                // Use GameState scores for opponent
                this.uiManager.drawScoreBar(character, this.canvas.width - 210, this.gameState.opponentScore);
            }
        }

        // Draw obstacles
        this.obstacleManager.draw(this.ctx, this.debugCheckbox.checked);

    }

    resetGame() {
        // Reset player character state (first character)
        const characterHeight = 60;
        const player = this.characters[0];
        player.y = this.canvas.height - characterHeight;
        if (player.rigidbody) {
            player.rigidbody.velocityY = 0;
        }
        player.grounded = true;

        // Reset game state using GameState
        this.gameOver = false;
        this.gameState.reset();

        // Clear obstacles
        this.obstacleManager.clearObstacles();

        // Restart with idle animation for all characters
        for (const character of this.characters) {
            character.playIdleAnimation();
        }

        console.log('Game reset');
    }

    setupDebugControls() {
        this.debugCheckbox.addEventListener('change', () => {
            this.canvas.focus();
        });

        // Make canvas focusable
        this.canvas.setAttribute('tabindex', '0');
    }

    // Getter methods for external access
    isGameOver() { return this.gameOver || this.gameState.isGameOver; }
    getPlayer() { return this.characters[0]; }
    getCharacters() { return this.characters; }
    getGameState() { return this.gameState; }

    // Methods to interact with game state
    damagePlayer(amount) {
        this.gameState.updateCharacterScore(-amount);
        if (this.gameState.isGameOver) {
            this.gameOver = true;
        }
    }

    damageOpponent(amount) {
        this.gameState.updateOpponentScore(-amount);
        if (this.gameState.isGameOver) {
            this.gameOver = true;
        }
    }

    getPlayerScore() {
        return this.gameState.characterScore;
    }

    getOpponentScore() {
        return this.gameState.opponentScore;
    }
}
