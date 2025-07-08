// UIManager.js
// Handles UI rendering and states

import { Character } from "./character.js";

export class UIManager {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    /** @param {Character} character */
    drawScoreBar(character, x = 10, y = 50) {
        if (!character) return;
        
        const barWidth = 200;
        const barHeight = 20;
        const healthPercentage = character.getScorePercentage();
        
        // Background (dark red)
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(x, y, barWidth, barHeight);
        
        // Health bar (green to red gradient based on health)
        const healthWidth = barWidth * healthPercentage;
        if (healthPercentage > 0.6) {
            this.ctx.fillStyle = '#00FF00'; // Green
        } else if (healthPercentage > 0.3) {
            this.ctx.fillStyle = '#FFFF00'; // Yellow
        } else {
            this.ctx.fillStyle = '#FF0000'; // Red
        }
        this.ctx.fillRect(x, y, healthWidth, barHeight);
        
        // Border
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, barWidth, barHeight);
        
        // Health text
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Score: ${character.currentScore}/${character.maxScore}`, x, y - 5);
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

    drawDebugInfo(character, showDebug = false) {
        if (!showDebug || !character) return;
        
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = 'blue';
         
        // Draw character debug info
        const debugY = this.canvas.height - 60;
        this.ctx.fillText(`Position: (${Math.round(character.x)}, ${Math.round(character.y)})`, 10, debugY);
        this.ctx.fillText(`Velocity Y: ${Math.round(character.velocityY)}`, 10, debugY + 15);
        this.ctx.fillText(`Grounded: ${character.grounded}`, 10, debugY + 30);
        this.ctx.fillText(`Swinging: ${character.swinging}`, 10, debugY + 45);
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
