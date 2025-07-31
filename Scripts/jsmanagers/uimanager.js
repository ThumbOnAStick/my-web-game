// UIManager.js
// Handles UI rendering and states

import { GameState } from "../jscomponents/gamestate.js";
import { Character } from "../jsgameobjects/character.js";
import { gameEventManager } from "./eventmanager.js";
import { InputManager } from "./inputmanager.js";

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

    
    drawGameoverSign()
    {
        this.ctx.save();
        // Draw gameover sign
        this.ctx.textAlign = 'center';
        this.ctx.font = '40px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 3);
        this.ctx.restore();

    }

    /**
     * 
     * @param {String} winner 
     */
    drawGameResult(winner)
    {
        // Draw game result
        this.ctx.save();
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`${winner} wins.`, this.canvas.width / 2, this.canvas.height / 3 + 40);
        this.ctx.restore();
    }

    /**
     * @returns {boolean}
     * @param {InputManager} inputmanager 
     */
    drawRestartButton(inputmanager)
    {
        return  this.drawButtonCenter('Restart', this.canvas.width/2, this.canvas.height/3 + 80, 100, 30, inputmanager);
    }

    /**
     * @returns {boolean}
     * @param {String} winner 
     * @param {InputManager} inputManager
     */
    drawGameOver(winner, inputManager) 
    {
        this.drawGameoverSign();
        this.drawGameResult(winner);
        return this.drawRestartButton(inputManager);
      
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

    /**
     * 
     * @param {Character} character 
     * @param {GameState} gamestate 
     * @param {InputManager} inputmanager 
     * @param {boolean} showDebug 
     * @returns 
     */
    drawDebugInfo(character, gamestate, inputmanager, showDebug = false)
    {
        if (!showDebug || !character) return;
        
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = 'blue';
         
        // Draw character debug info
        const debugHeight = 15;
        const debugY = this.canvas.height - debugHeight * 8;
        this.ctx.fillText(`Position: (${Math.round(character.x)}, ${Math.round(character.y)})`, 10, debugY);
        this.ctx.fillText(`Swinging: ${character.swinging}`, 10, debugY + debugHeight * 3);
        this.ctx.fillText(`Gamestate: Game Over: ${gamestate.isGameOver}\nPlayer score: ${character.currentScore}`, 10, debugY + debugHeight * 4);
        this.ctx.fillText(`MouseX: ${inputmanager.mouse.x}, MouseY: ${inputmanager.mouse.y}, MouseDown: ${inputmanager.mouse.isDown}`, 10, debugY + debugHeight * 5);

    }

    clearScreen() 
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * @param {InputManager} inputManager
     * @returns {boolean}
     */
    drawButtonCenter(text, x, y, width, height, inputManager)
    {
        let newAnchorX = x - width/2; 
        let newAnchorY = y - height/2; 
        return this.drawButton(text, newAnchorX, newAnchorY, width, height, inputManager);
    }

    /**
     * @param {InputManager} inputManager
     * @returns {boolean}
     */
    drawButton(text, x, y, width, height, inputManager)
    {
        this.ctx.save();
        // Handles actual drawing
        this.ctx.fillStyle = inputManager.isMouseWithin(x, y, width, height)? '#aaaaaa' : 'white'; // Draw mouse hover
        this.ctx.fillRect(x, y, width, height);

        // Draw frame
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Draw text
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x + width/2, y + height/2, width);

        this.ctx.restore();
        return inputManager.isMouseDownWithin(x, y, width, height);
    }
}
