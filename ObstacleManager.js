// ObstacleManager.js
// Manages obstacle spawning, updating, and collision detection

import { Obstacle } from './obstacle.js';

export class ObstacleManager {
    constructor() {
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1500; // milliseconds
        this.lastSpawnTime = 0;
    }

    spawnObstacle(canvasWidth, canvasHeight) {
        const height = 40 + Math.random() * 40;
        const y = canvasHeight - height;
        this.obstacles.push(new Obstacle(canvasWidth, y, 30, height));
    }

    update(canvasWidth, canvasHeight, gameOver = false) {
        // Spawn obstacles at intervals (only if game is not over)
        const currentTime = Date.now();
        if (!gameOver && currentTime - this.lastSpawnTime > this.spawnInterval) {
            // Uncomment to enable obstacle spawning
            // this.spawnObstacle(canvasWidth, canvasHeight);
            this.lastSpawnTime = currentTime;
        }

        // Update all obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update();
            
            // Remove off-screen obstacles
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
                return 1; // Return score increment
            }
        }
        return 0; // No score increment
    }

    checkCollisions(character) {
        for (const obstacle of this.obstacles) {
            if (character.collidesWith(obstacle)) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }

    draw(ctx) {
        for (const obstacle of this.obstacles) {
            obstacle.draw(ctx);
        }
    }

    clearObstacles() {
        this.obstacles.length = 0;
    }

    getObstacleCount() {
        return this.obstacles.length;
    }
}
