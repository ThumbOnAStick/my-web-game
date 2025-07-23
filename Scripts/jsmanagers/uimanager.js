// UIManager.js
// Handles UI rendering and states

import { GameState } from "../jscomponents/gamestate.js";
import { Character } from "../jsgameobjects/character.js";

export class UIManager {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    /** @param {Character} character */
    drawScoreBar(character, x = 10, y = 50, score = null) {
        if (!character) return;
        
        const barWidth = 200;
        const barHeight = 20;
        const margin = 2;
        
        // Use provided score or fall back to character's score
        const currentScore = score !== null ? score : character.currentScore;
        const maxScore = character.maxScore || 100; // Default max score
        const scorePercentage = currentScore / maxScore;
        
        // Background (black)
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x, y, barWidth + margin, barHeight + margin);
        
        // Health bar (green to red gradient based on health)
        const healthWidth = barWidth * scorePercentage;
        this.ctx.fillStyle = '#FFFFFF';

        this.ctx.fillRect(x, y, healthWidth, barHeight);
        
       
        // Health text
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Score: ${currentScore}/${maxScore}`, x, y - 5);
    }

    drawGameOver() {
        this.ctx.font = '40px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.fillText('Game Over!', this.canvas.width / 2 - 100, this.canvas.height / 2);
        
        // Draw restart instruction
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('Press R to restart', this.canvas.width / 2 - 80, this.canvas.height / 2 + 40);
    }

    drawLoadingScreen() {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('Loading Resources...', this.canvas.width / 2 - 100, this.canvas.height / 2);
    }

    /**@param {GameState} gamestate*/
    drawDebugInfo(character, gamestate, showDebug = false) {
        if (!showDebug || !character) return;
        
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = 'blue';
         
        // Draw character debug info
        const debugHeight = 15;
        const debugY = this.canvas.height - debugHeight * 8;
        this.ctx.fillText(`Position: (${Math.round(character.x)}, ${Math.round(character.y)})`, 10, debugY);
        this.ctx.fillText(`Velocity Y: ${Math.round(character.velocityY)}`, 10, debugY + 15);
        this.ctx.fillText(`Grounded: ${character.grounded}`, 10, debugY + 30);
        this.ctx.fillText(`Swinging: ${character.swinging}`, 10, debugY + debugHeight * 3);
        this.ctx.fillText(`Gamestate: Game Over: ${gamestate.isGameOver}\nPlayer score: ${gamestate.characterScore}`, 10, debugY + debugHeight * 4);

    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
