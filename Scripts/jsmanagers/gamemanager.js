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
import { TickManager } from './tickmanager.js';
import { VFXManager } from './vfxmanager.js';
import { AudioManager } from './audiomanager.js';

export class GameManager 
{
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {*} ctx 
     */
    constructor(canvas, ctx) {
        this.isInitialized = false;
        this.canvas = canvas;
        this.ctx = ctx;
        /**@type {Character[]} */
        this.characters = [];
        /**@type {AIController} */
        this.aiController = null;
        /**@type {Resources} */
        this.resources = null;
        /**@type {VFXManager} */
        this.vfxManager = null; // Can't load vfxManager before resources are loadded

        // Freeze system
        this.freezeFrames = 0;

        // Initialize game state
        this.gameState = new GameState();

        // Initialize managers
        this.inputManager = new InputManager(canvas);
        this.obstacleManager = new ObstacleManager();
        this.resourceManager = new ResourceManager();
        this.audioManager = new AudioManager(this.resourceManager);
        this.uiManager = new UIManager(ctx, canvas);
        this.tickManager = new TickManager(Date.now());
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
            await this.resourceManager.trytoLoadAllResources();

            this.resources = this.resourceManager.getResources();

            this.vfxManager = new VFXManager(this.resourceManager); // Initialize vfxManager after resource loading

            // Create characters
            await this.loadCharacters();

            // Load animations
            await this.loadAnimations();

            // Set character reference for input manager (player is first character)
            this.inputManager.setCharacter(this.characters[0]);

            //Set  character reference for ai controller
            this.aiController = new AIController(this.characters[1], this.characters[0]);

            // Setup tick manager
            this.tickManager.append((/** @type {number} */ currentTick) => this.aiControllerUpdate(currentTick));

            // Initialize evenet manager
            Eventhandler.initialize(this.obstacleManager, this.vfxManager, this.audioManager)

            this.isInitialized = true;
            console.log('Game initialized successfully');

        }
        catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    async loadCharacters() 
    {
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
                await character.loadAnimation('lightswing', './Assets/character_lightswing_animation.csv');
                await character.loadAnimation('dodge', './Assets/character_dodge_animation.csv');
                await character.loadAnimation('stagger', './Assets/character_stagger_animation.csv')
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

    checkGameOver() 
    {
        if (this.gameState.isGameOver) 
        {
            return true;
        }
        return false;
    }

    update() 
    {
        requestAnimationFrame(() => this.update());
        
        // Handle game over state - check both local and GameState
        
        if(gameEventManager.updateFreeze()) return;
        
        // Handle input even during game over (for reset functionality)
        this.inputManager.handleMovement(this.characters[0]);

        // Update event manager for delayed events
        gameEventManager.update();

        // Update all characters (every frame)
        this.characterUpdate();

        // Only update when game is not over
        if (!this.checkGameOver())
        {
            // Ticks update 
            this.tickManager.update();
            
            // Check obstacle manager
            this.obstacleManager.update();
    
            // Check collisions 
            this.obstacleManager.handleCharacterCollisions(this.characters);
    
            // Manage VFX
            this.vfxManager.update();
    
            // Update score, check game state
            this.gameState.updatePlayerScore(this.getPlayerScore());
            this.gameState.updateOpponentScore(this.getOpponentScore());
        }
        

        // Clear screen before drawing
        this.uiManager.clearScreen();

        // Draw everything
        this.draw();
    }

    characterUpdate()
    {
        for (const character of this.characters) 
        {
            character.update(this.canvas);
        }
    }

    /**
     * 
     * @param {Number} currentTick 
     */
    aiControllerUpdate(currentTick) 
    {
        // AI updates at fixed intervals
        this.aiController.update(currentTick);
    }

    drawCharacters()
    {
        const scorebarHeight = 60;

        for (const character of this.characters) 
        {
            character.draw(this.ctx, this.resources, this.debugCheckbox.checked);
            if(this.isGameOver())
            {
                continue;
            }
            if (!character.isOpponent) 
            {
                // Use GameState scores for player
                this.uiManager.drawScoreBar(character, 10, scorebarHeight, this.getPlayerScore());
                this.uiManager.drawDebugInfo(character, this.gameState, this.inputManager, this.debugCheckbox.checked);
            } 
            else 
            {
                // Use GameState scores for opponent
                this.uiManager.drawScoreBar(character, this.canvas.width - 210, scorebarHeight, this.getOpponentScore());
            }
            this.uiManager.drawIndicator(character);
            this.uiManager.drawDodged(character);
        }

        this.uiManager.drawScoreChanges();
    }

    drawGameover()
    {
        if(this.isGameOver())
        {
            if(this.uiManager.drawGameOver(this.gameState.winner, this.inputManager)) // Checks if restart button is clicked
            {
                this.resetGame();
            }
        }
    }

    drawVFX()
    {
        this.vfxManager.draw(this.ctx);
    }

    draw() 
    {
        // Gameover drawing
        this.drawGameover();

        // Character drawing
        this.drawCharacters();
      
        // Vfx drawing
        this.drawVFX();
       
    }



    resetGame() 
    {
        // Reset player character state (first character)
        const characterHeight = 60;
        const player = this.characters[0];
        player.y = this.canvas.height - characterHeight;
        if (player.rigidbody) 
        {
            player.rigidbody.velocityY = 0;
        }
        player.grounded = true;

        // Clear obstacles
        this.obstacleManager.clearObstacles();

        // Restart with idle animation for all characters
        for (const character of this.characters) 
        {
            character.resetScore();
            character.playIdleAnimation();
        }

        this.characters[0].x = 50;
        this.characters[1].x = this.canvas.width - 100;

        // Reset game state using GameState
        this.gameState.reset();
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
    isGameOver() { return this.gameState.isGameOver; }
    getPlayer() { return this.characters[0]; }
    getOpponent() {return this.characters[1];}
    getCharacters() { return this.characters; }
    getGameState() { return this.gameState; }

    getPlayerScore() 
    {
        return this.getPlayer().currentScore;
    }

    getOpponentScore() 
    {
        return this.getOpponent().currentScore;
    }
}
