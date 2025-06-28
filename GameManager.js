// GameManager.js
// Main game manager that coordinates all systems

import { Character } from './character.js';
import { InputManager } from './InputManager.js';
import { ObstacleManager } from './ObstacleManager.js';
import { ResourceManager } from './ResourceManager.js';
import { UIManager } from './UIManager.js';

export class GameManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.gameOver = false;
        this.character = null;
        this.isInitialized = false;
        
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
            
            // Create character
            await this.loadCharacter();
            
            // Load animations
            await this.loadAnimations();
            
            // Set character reference for input manager
            this.inputManager.setCharacter(this.character);
            
            this.isInitialized = true;
            console.log('Game initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    async loadCharacter() {
        const characterHeight = 60;
        this.character = new Character(
            50, 
            this.canvas.height - characterHeight, 
            characterHeight, 
            this.resourceManager.getResources()
        );
    }

    async loadAnimations() {
        try {
            await this.character.loadAnimation('idle', './Assets/character_idle_animation.csv');
            await this.character.loadAnimation('swing', './Assets/character_swing_animation.csv');
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
        
        // Handle input and movement
        this.inputManager.handleMovement(this.character, this.canvas);
        
        // Update character
        this.character.update(this.canvas);
        
        // Update obstacles and check for score
        const scoreIncrease = this.obstacleManager.update(
            this.canvas.width, 
            this.canvas.height, 
            this.gameOver
        );
        this.score += scoreIncrease;
        
        // Check collisions
        if (this.obstacleManager.checkCollisions(this.character)) {
            this.gameOver = true;
        }
        
        // Draw everything
        this.draw();
    }

    draw() {
        // Draw character
        this.character.draw(this.ctx, this.resourceManager.getResources(), this.debugCheckbox.checked);
        
        // Draw obstacles
        this.obstacleManager.draw(this.ctx);
        
        // Draw UI
        this.uiManager.drawScore(this.score);
        this.uiManager.drawDebugInfo(this.character, this.debugCheckbox.checked);
    }

    resetGame() {
        // Reset character state
        const characterHeight = 60;
        this.character.y = this.canvas.height - characterHeight;
        this.character.velocityY = 0;
        this.character.grounded = true;
        this.character.wasGrounded = true;
        
        // Reset game state
        this.gameOver = false;
        this.score = 0;
        
        // Clear obstacles
        this.obstacleManager.clearObstacles();
        
        // Restart with idle animation
        this.character.playIdleAnimation();
        
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
    getScore() { return this.score; }
    isGameOver() { return this.gameOver; }
    getCharacter() { return this.character; }
}
