// UIManager.js
// Handles UI rendering and states

export class UIManager {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    drawScore(score) {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('Score: ' + score, 10, 30);
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
        this.ctx.fillText('Loading Images...', this.canvas.width / 2 - 100, this.canvas.height / 2);
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
