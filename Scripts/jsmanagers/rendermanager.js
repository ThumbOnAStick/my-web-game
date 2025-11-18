// RenderManager.js
// Manages all drawing and rendering operations
import { Character } from '../jsgameobjects/character.js';
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
     * @param {*} resourceManager - Resource manager for translations
     */
    drawCharacters(characters, resources, isGameRunning, debugMode, gameState, inputManager, gameManager, resourceManager) {
        const scorebarHeight = 60;
        const scoreLabel = resourceManager.getTranslation(gameManager, 'Score');
        
        for (const character of characters) {
            // Draw the character sprite
            character.draw(this.ctx, resources, debugMode);
            
            // Only draw character UI when game is running
            if (!isGameRunning) {
                continue;
            }
            
            if (!character.isOpponent) {
                // Player UI
                this.uiManager.drawScoreBar(character, scoreLabel, 10, scorebarHeight, character.currentScore);
                this.uiManager.drawDebugInfo(character, gameState, inputManager, debugMode);
            } else {
                // Opponent UI
                this.uiManager.drawScoreBar(character, scoreLabel, this.canvas.width - 210, scorebarHeight, character.currentScore);
            }
            
            // Draw common UI elements
            this.uiManager.drawIndicator(character);
            this.uiManager.drawDodged(resourceManager.getTranslation(gameManager, 'Dodge'), character);
        }

        // Draw score changes
        this.uiManager.drawScoreChanges();
    }

    /**
     * Draw the main menu
     * @param {boolean} isInMenu - Whether we're currently in menu state
     * @param {*} inputManager - Input manager reference
     * @param {*} gameManager - Game manager reference for translations
     * @param {*} resourceManager - Resource manager for translations
     * @returns {boolean} - Whether the start button was clicked
     */
    drawMenu(isInMenu, inputManager, gameManager, resourceManager) {
        if (isInMenu) {
            return this.uiManager.drawMenu(
                inputManager,
                resourceManager.getTranslation(gameManager, 'Title'),
                resourceManager.getTranslation(gameManager, 'Start'),
                gameManager 
            );
        }
        return false;
    }

    /**
     * Draw the game over screen
     * @param {boolean} isGameOver - Whether the game is over
     * @param {string} winner - The winner of the game
     * @param {*} inputManager - Input manager reference
     * @param {*} gameManager - Game manager reference for translations
     * @param {*} resourceManager - Resource manager for translations
     * @returns {boolean} - Whether the restart button was clicked
     */
    drawGameOver(isGameOver, winner, inputManager, gameManager, resourceManager) {
        if (isGameOver) {
            return this.uiManager.drawGameOver(
                resourceManager.getTranslation(gameManager, 'Gameover'),
                resourceManager.getTranslation(gameManager, 'Restart'),
                winner,
                resourceManager.getTranslation(gameManager, 'Wins'),
                inputManager
            );

        }
        return false;
    }

    drawGotoMenuButton(isGameOver, inputManager, gameManager, resourceManager) {
        if(!isGameOver){
            return false;
        }
        return this.uiManager.drawGotoMenuButton(inputManager, resourceManager.getTranslation(gameManager, 'ToMenu'),)
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
}
