// InputManager.js
// Handles all input and controls for the game

import { Character } from "../jsgameobjects/character.js";
import { GameManager } from "./gamemanager.js";


export class InputManager 
{
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) 
    {
        this.keys = {
            a: false,
            d: false
        };
        // Add mouse tracking properties
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false
        };
        /**@type {Character} */
        this.character = null;
        this.canvas = canvas;  
        this.gameManager = null;
        this.setupEventListeners();
    }

    setCharacter(character) {
        this.character = character;
    }

    /**
     * 
     * @param {GameManager} gameManager 
     */
    setGameManager(gameManager) 
    {
        this.gameManager = gameManager;
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Add mouse event listeners
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMovement(e));
    }

    handleKeyDown(e)
    {
        if (!this.character) return; // Type guard
        if (this.character.swinging) return; // Action blocked when character is swinging 
        if (this.gameManager.isGameOver()) return; // Action blocked when game is over
        switch (e.code) 
        {
            case 'Space':
                this.character.jump();
                break;
            // Press R for reset
            case 'KeyR':
                if (this.gameManager && this.gameManager.isGameOver()) 
                {
                    console.log('Try to reset game')
                    this.gameManager.resetGame();
                }
                break;
            case 'KeyA':
                this.keys.a = true;
                break;
            case 'KeyD':
                this.keys.d = true;
                break;
            // 'J' for light attack
            case 'KeyJ':
                this.character.performLightAttack();
                break;
            // 'K' for heavy attack
            case 'KeyK':
                this.character.performHeavyattack();
                break;

        }
    }

    handleKeyUp(e) 
    {
        switch (e.code) {
            case 'KeyA':
                this.keys.a = false;
                break;
            case 'KeyD':
                this.keys.d = false;
                break;
        }
    }

    handleMouseMovement(e)
    {
        if (this.canvas) 
        {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        }
    }

    handleMouseDown(e) 
    {
        console.log('Mouse down!!!');
        this.mouse.isDown = true;
        this.handleMouseMovement(e);
    }

    handleMouseUp(e) 
    {
        console.log('Mouse up!!!');
        this.mouse.isDown = false;
    }

    isKeyPressed(key) 
    {
        return this.keys[key] || false;
    }

    /**
     * 
     * @returns {boolean}
     */
    isMouseDownWithin(x, y, width, height) 
    {
        return this.mouse.isDown && this.isMouseWithin(x, y, width, height);
    }

    // Get current mouse position
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }

    // Check if mouse is within bounds (without requiring click)
    isMouseWithin(x, y, width, height) 
    {
        return this.mouse.x >= x && 
               this.mouse.x <= x + width &&
               this.mouse.y >= y && 
               this.mouse.y <= y + height;
    }

    /**@param {Character} character*/
    handleMovement(character) {
        if (!character) return;
        
        if (this.keys.a) {
            character.move(-1); // Move left
        }
        if (this.keys.d) {
            character.move(1); // Move right
        }
    }


}
