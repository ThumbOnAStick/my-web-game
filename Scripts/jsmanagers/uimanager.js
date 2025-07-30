// UIManager.js
// Handles UI rendering and states

import { GameState } from "../jscomponents/gamestate.js";
import { Character } from "../jsgameobjects/character.js";
import { gameEventManager } from "./eventmanager.js";

export class UIManager {
    constructor(ctx, canvas) 
    {
        /** @type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.canvas = canvas;
    }

    /** @param {Character} character */
    drawScoreBar(character, x = 10, y = 50, score = null) 
    {
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

    drawScoreChanges()
    {
        /**@type {Character} */
        const scoreChanger = gameEventManager.scoreChanger;
        const scoreChanges = gameEventManager.scoreChanges;

        if(!scoreChanger || scoreChanges == 0)
        {
            return;
        }
        
        let drawLocX = scoreChanger.isOpponent? this.canvas.width - 250 : 250; 
        let sign = scoreChanges > 0? '+' : '';
        this.ctx.save();
        const drawLocY = 60;
        this.ctx.textAlign = 'center';
        this.ctx.font = '15px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(sign + String(scoreChanges), drawLocX, drawLocY);
        this.ctx.restore();
    }

    /**
     * 
     * @param {Character} character 
     */
    drawIndicator(character)
    {
        let color = 'black';
        if(character.isOpponent)
        {
            // Red indicator
            color = 'red';
        }
        
        // Triangle dimensions
        const triangleSize = 15;
        const offsetY = 50; // Distance above character
        
        // Position above character center
        const centerX = character.x;
        const topY = character.y - character.height / 2 - offsetY;
        
        // Draw triangle pointing down at character
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, topY + triangleSize); // Bottom point (pointing down)
        this.ctx.lineTo(centerX - triangleSize / 2, topY); // Top left
        this.ctx.lineTo(centerX + triangleSize / 2, topY); // Top right
        this.ctx.closePath();
        this.ctx.fill();
        
        // Optional: Add a border for better visibility
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
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

    /**
     * 
     * @param {Character} character 
     */
    drawDodged(character) 
    {
        if(!character.dodging)
            return;
        const offsetY = -100; // Distance above character
        this.ctx.fillStyle = '#444444';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Dodged', character.x, character.y + offsetY);
        this.ctx.textAlign = 'start';  
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
