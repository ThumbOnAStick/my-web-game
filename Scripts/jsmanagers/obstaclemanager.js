// ObstacleManager.js
// Manages obstacle spawning, updating, and collision detection

import { Character } from '../jsgameobjects/character.js';
import { gameEventManager } from './eventmanager.js';
import { Obstacle } from '../jsgameobjects/obstacle.js';
import * as CombatHandler from '../jsutils/combat/combathandler.js';
import { GameObject } from '../jsgameobjects/gameobject.js';

export class ObstacleManager {
    constructor() {
        /**@type {Obstacle[]} */
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 1500; // milliseconds
        this.lastSpawnTime = 0;
    }

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} width 
     * @param {*} height 
     * @param {*} duration 
     * @param {*} destroyedOnTouch 
     * @param {*} id 
     * @param {GameObject} source 
     */
    spawnObstacle(x, y, width, height, duration = 0, destroyedOnTouch = false, id = null, source = null, damage = 0) {
        let realId = id;
        if (source != null) {
            realId = source.id;
        }
        this.obstacles.push(new Obstacle(x, y, width, height, Date.now(), destroyedOnTouch, 0, duration, realId, source, damage));
    }
    
    /**
     * @param {Character[]} characters
     */
    update(characters) {
        // Spawn obstacles at intervals (only if game is not over)
        const currentTime = Date.now();

        // Update all obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            // Destroy expired obstacle            
            if (this.obstacles[i].shouldDestroy(currentTime)) {
                this.obstacles.splice(i, 1);
            }
        }

        // Handle Collisions
        this.handleCharacterCollisions(characters)
    }

    /**
     * @param {Character[]} characters
     */
    handleCharacterCollisions(characters) {
        for (let i = characters.length - 1; i >= 0; i--) {
            if (this.handleCharacterCollision(characters[i])) {
                return true;
            }

        }
        return false;
    }

    /** 
     * @param {Character} character  
     * @returns {boolean}
    */
    handleCharacterCollision(character) {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            if (obstacle.collideWithCharacter(character.selfCoordinate(), character.id)) {
                CombatHandler.handleCharacterDamageResult(character, obstacle);
                if (obstacle.destroyedOnTouch) {
                    this.obstacles.splice(i, 1);
                }
                return true;
            }
        }
        return false;
    }

    draw(ctx, showDebug = false) {
        for (const obstacle of this.obstacles) {
            obstacle.draw(ctx, null, showDebug);
        }
    }

    clearObstacles() {
        this.obstacles.length = 0;
    }

    getObstacleCount() {
        return this.obstacles.length;
    }
}

