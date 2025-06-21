import { Resources } from './resources.js';

export class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.velocityY = 0;
        this.gravity = 1.5;
        this.jumpStrength = -20;
        this.grounded = true;
    }

    update() {
        this.y += this.velocityY;
        if (!this.grounded) {
            this.velocityY += this.gravity;
        }
        // Ground collision
        if (this.y + this.height >= 400) { // Assuming canvas height is 400
            this.y = 400 - this.height;
            this.velocityY = 0;
            this.grounded = true;
        }
    }

    jump() {
        if (this.grounded) {
            this.velocityY = this.jumpStrength;
            this.grounded = false;
        }
    }

    draw(ctx, resources) {
        // Center the head horizontally on the character
        const headWidth = 40;
        const headHeight = 40;
        resources.drawImage(ctx, 'head', this.x + (this.width - headWidth) / 2, this.y - headHeight, headWidth, headHeight);
    }

    collidesWith(obstacle) {
        return (
            this.x < obstacle.x + obstacle.width &&
            this.x + this.width > obstacle.x &&
            this.y < obstacle.y + obstacle.height &&
            this.y + this.height > obstacle.y
        );
    }
}
