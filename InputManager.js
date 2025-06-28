// InputManager.js
// Handles all input and controls for the game

export class InputManager {
    constructor() {
        this.keys = {
            a: false,
            d: false
        };
        this.character = null;
        this.gameManager = null;
        this.setupEventListeners();
    }

    setCharacter(character) {
        this.character = character;
    }

    setGameManager(gameManager) {
        this.gameManager = gameManager;
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (!this.character) return; // Type guard
        
        switch (e.code) {
            case 'Space':
                this.character.jump();
                break;
            case 'KeyR':
                if (this.gameManager && this.gameManager.gameOver) {
                    this.gameManager.resetGame();
                }
                break;
            case 'KeyA':
                this.keys.a = true;
                break;
            case 'KeyD':
                this.keys.d = true;
                break;
            case 'KeyJ':
                this.character.attack();
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

    handleMovement(character, canvas) {
        if (!character) return;
        
        if (this.keys.a) {
            character.move(-1, canvas); // Move left
        }
        if (this.keys.d) {
            character.move(1, canvas); // Move right
        }
    }
}
