// ObstacleManager.js
// Manages obstacle spawning, updating, and collision detection

import { Character } from './character.js';
import { Obstacle } from './obstacle.js';

export class ObstacleManager {
    constructor() 
    {
        /**@type {Obstacle[]} */
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1500; // milliseconds
        this.lastSpawnTime = 0;
    }

    spawnObstacle(x, y, width, height, duration = 0, destroyedOnTouch = false) 
    {
        this.obstacles.push(new Obstacle(x, y, width, height, Date.now(), destroyedOnTouch, 0, duration));
    }

    update(canvasWidth, canvasHeight, gameOver = false) 
    {
        // Spawn obstacles at intervals (only if game is not over)
        const currentTime = Date.now();

        // Update all obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) 
        {
            // Destroy expired obstacle            
            if (this.obstacles[i].shouldDestroy(currentTime)) 
            {
                this.obstacles.splice(i, 1);
            }
        }
        return 0; // No score increment
    }

    /** @param {Character} character  */
    collideWithCharacter(character) 
    {
        for (let i = this.obstacles.length - 1; i >= 0; i--) 
        {
            const obstacle = this.obstacles[i];
            if (obstacle.collideWithCharacter(character.selfCoordinate(), character.id)) 
            {
                if(obstacle.destroyedOnTouch)
                {
                    this.obstacles.splice(i, 1);
                }
                return true;   
            }
        }
        return false;  
    }

    draw(ctx, showDebug = false) 
    {
        for (const obstacle of this.obstacles) {
            obstacle.draw(ctx, showDebug);
        }
    }

    clearObstacles() {
        this.obstacles.length = 0;
    }

    getObstacleCount() {
        return this.obstacles.length;
    }
}

 