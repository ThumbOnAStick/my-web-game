// RenderManager.js
// Manages all drawing and rendering operations
import { Character } from '../jsgameobjects/character.js';
import { GameManager } from './gamemanager.js';
import { GameState } from '../jscomponents/gamestate.js';
import { InputManager } from './inputmanager.js';
import { ResourceManager } from './resourcemanager.js';
import { UIManager } from './uimanager.js';

export class RenderManager {
    constructor(ctx, canvas, uiManager, vfxManager) {
        this.ctx = ctx;
        this.canvas = canvas;
        /**@type {UIManager} */
        this.uiManager = uiManager;
        this.vfxManager = vfxManager;
    }

    /**
     * Clear the screen before drawing
     */
    clearScreen() {
        this.uiManager.clearScreen();
    }

    /**
     * Draw all characters with their UI elements
     * @param {Character[]} characters - Array of characters to draw
     * @param {*} resources - Game resources for drawing
     * @param {boolean} isGameRunning - Whether the game is currently running
     * @param {boolean} debugMode - Whether debug mode is enabled
     * @param {*} gameState - Current game state
     * @param {*} inputManager - Input manager reference
     * @param {*} gameManager - Game manager reference for translations
     * @param {ResourceManager} resourceManager - Resource manager for translations
     */
    drawCharacters(characters, resources, isGameRunning, debugMode, gameState, inputManager, gameManager, resourceManager) {
        const scorebarHeight = 60;
        const playerLabel = resourceManager.getTranslation('Player');
        const pcLabel = resourceManager.getTranslation('PC');
        for (const character of characters) {
            // Draw the character sprite
            character.draw(this.ctx, resources, debugMode);
            
            // Only draw character UI when game is running
            if (!isGameRunning) {
                continue;
            }
            
            if (!character.isOpponent) {
                // Player UI
                this.uiManager.drawScoreBar(character, playerLabel, 10, scorebarHeight, character.currentScore);
                this.uiManager.drawDebugInfo(character, gameState, inputManager, debugMode);
            } else {
                // Opponent UI
                this.uiManager.drawScoreBar(character, pcLabel, this.canvas.width - 210, scorebarHeight, character.currentScore);
            }
            
            // Draw common UI elements
            this.uiManager.drawIndicator(character);
            this.uiManager.drawDodged(resourceManager.getTranslation('Dodge'), character);
        }

        // Draw score changes
        this.uiManager.drawScoreChanges();
    }

    /**
     * Draw the main menu
     * @param {GameState} gameState
     * @param {boolean} isInMenu - Whether we're currently in menu state
     * @param {*} inputManager - Input manager reference
     * @param {ResourceManager} resourceManager - Resource manager for translations
     * @returns {boolean} - Whether the start button was clicked
     */
    drawMenu(gameState, isInMenu, inputManager, resourceManager) {
        if (isInMenu) {
            return this.uiManager.drawMenu(
                gameState,
                inputManager,
                resourceManager.getTranslation('Title'),
                resourceManager.getTranslation('Start'),
            );
        }
        return false;
    }

    /**
     * Draw the game over screen
     * @param {boolean} isGameOver - Whether the game is over
     * @param {string} winner - The winner of the game
     * @param {InputManager} inputManager - Input manager reference
     * @param {ResourceManager} resourceManager - Resource manager for translations
     * @param {import("../jscomponents/gamestate.js").GameState} gameState
     * @returns {string|null} - Action to take ('restart', 'next', or null)
     */
    drawGameOver(isGameOver, winner, inputManager, resourceManager, gameState) {
        if (isGameOver) {
            const isTutorial = gameState.difficulty === 0;
            const playerWon = winner === 'Player';
            
            const gameoverLabel = (isTutorial && playerWon) 
                ? resourceManager.getTranslation('TutorialOver') 
                : resourceManager.getTranslation('Gameover');
                
            const showNextLevel = isTutorial && playerWon;

            return this.uiManager.drawGameOver(
                gameoverLabel,
                resourceManager.getTranslation('Restart'),
                resourceManager.getTranslation(winner),
                resourceManager.getTranslation('Wins'),
                inputManager,
                showNextLevel,
                resourceManager.getTranslation('NextLevel')
            );

        }
        return null;
    }

    /**
     * 
     * @param {*} isGameOver 
     * @param {*} inputManager 
     * @param {GameManager} gameManager 
     * @param {*} resourceManager 
     * @returns 
     */
    drawGotoMenuButton(isGameOver, inputManager, gameManager, resourceManager) {
        if(!isGameOver || gameManager.gameState.difficulty < 1){
            return false;
        }
        return this.uiManager.drawGotoMenuButton(inputManager, resourceManager.getTranslation('ToMenu'),)
    }

    /**
     * Draw visual effects
     */
    drawVFX() {
        this.vfxManager.draw(this.ctx);
    }

    /**
     * Draw the loading screen
     */
    drawLoadingScreen() {
        this.uiManager.drawLoadingScreen();
    }

    /**
     * Draw the exit button during gameplay
     * @param {boolean} isGameRunning
     * @param {InputManager} inputManager
     * @param {ResourceManager} resourceManager
     * @returns {boolean}
     */
    drawExitButton(isGameRunning, inputManager, resourceManager) {
        if (isGameRunning) {
            return this.uiManager.drawExitButton(
                inputManager,
                resourceManager.getTranslation('ToMenu')
            );
        }
        return false;
    }
}
