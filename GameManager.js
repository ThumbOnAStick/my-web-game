// GameManager.js
// Main game manager that coordinates all systems

import { Character } from './character.js';
import { InputManager } from './inputmanager.js';
import { ObstacleManager } from './obstaclemanager.js';
import { ResourceManager } from './resourcemanager.js';
import { Resources } from './resources.js';
import { UIManager } from './uimanager.js';

export class GameManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameOver = false;
        /**@type {Character[]} */
        this.characters = [];
        this.isInitialized = false;
        /**@type {Resources} */
        this.resources = null;

        // Initialize managers
        this.inputManager = new InputManager();
        this.obstacleManager = new ObstacleManager();
        this.resourceManager = new ResourceManager();
        this.uiManager = new UIManager(ctx, canvas);
        
        // Set up manager references
        this.inputManager.setGameManager(this);
        
        // Set up debug checkbox
        this.debugCheckbox = document.getElementById('debugCheckbox');
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
            this.canvas.height - characterHeight, 
            characterHeight, 
            this.resources
        );
        
        // Opponent character
        const opponent = new Character(
            this.canvas.width - 100, 
            this.canvas.height - characterHeight, 
            characterHeight, 
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
        // Handle game over state
        if (this.gameOver) {
            this.uiManager.drawGameOver();
            requestAnimationFrame(() => this.update());
            return;
        }

        requestAnimationFrame(() => this.update());
        
        // Clear screen
        this.uiManager.clearScreen();
        
        // Handle input and movement (only for player - first character)
        this.inputManager.handleMovement(this.characters[0], this.canvas);
        
        // Update all characters
        for (const character of this.characters) {
            character.update(this.canvas);
        }
        
        // Check collisions (only for player)
        if (this.obstacleManager.checkCollisions(this.characters[0])) {
            this.gameOver = true;
        }
        
        // Draw everything
        this.draw();
    }

    draw() {
        // Draw all characters
        for (const character of this.characters) {
            character.draw(this.ctx, this.resources, this.debugCheckbox.checked);
            if (!character.isOpponent) 
            {
                this.uiManager.drawScoreBar(character);
                this.uiManager.drawDebugInfo(character, this.debugCheckbox.checked);
            }else
            {
                console.log('Drawing opponent health bar');
                this.uiManager.drawScoreBar(character, this.canvas.width - 210);
            }
        }

        // Draw obstacles
        this.obstacleManager.draw(this.ctx);

    }

    resetGame() {
        // Reset player character state (first character)
        const characterHeight = 60;
        const player = this.characters[0];
        player.y = this.canvas.height - characterHeight;
        player.velocityY = 0;
        player.grounded = true;
        player.wasGrounded = true;
        
        // Reset game state
        this.gameOver = false;
        
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
    isGameOver() { return this.gameOver; }
    getPlayer() { return this.characters[0]; }
    getCharacters() { return this.characters; }
}
