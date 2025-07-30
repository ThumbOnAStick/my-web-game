// InputManager.js
// Handles all input and controls for the game

import { Character } from "../jsgameobjects/character.js";
import { GameManager } from "./gamemanager.js";


export class InputManager {
    constructor() {
        this.keys = {
            a: false,
            d: false
        };
        /**@type {Character} */
        this.character = null;
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
    }

    handleKeyDown(e)
    {
        if (!this.character) return; // Type guard
        if (this.character.swinging) return; // Action blocked when character is swinging 
        console.log('Pressed');
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

    handleKeyUp(e) {
        switch (e.code) {
            case 'KeyA':
                this.keys.a = false;
                break;
            case 'KeyD':
                this.keys.d = false;
                break;
        }
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
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
