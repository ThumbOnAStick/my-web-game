import { Character } from "./character.js";
import { gameEventManager } from "./eventmanager.js";
import { ObstacleManager } from "./obstaclemanager.js";

export const characterSwingEvent = 'character_swing';
export const obstacleCreationEvent = 'create_obstacle';

// Create event handlers that capture obstacleManager
/**@param {ObstacleManager} obstacleManager */
export function createEventHandlers(obstacleManager) {
    
    function handleSwingEvent(data) {
        
        /**@type {Character} */
        const character = data;
        gameEventManager.emit(obstacleCreationEvent, {
            character_id: character.id, 
            coordinate: character.getPosition(), 
            dir: character.dir
        }, 1);
        console.log(`Created hitbox in ${character.dir} direction`);

    }

    function createHitbox(data) {
        const { character_id, coordinate, dir } = data;
        const sizeX = 100;
        const sizeY = 100;
        const offset = dir < 0 ? sizeX/2 : 0;
        // spawn obstacle on character location
        obstacleManager.spawnObstacle(
            coordinate.x + dir * (sizeX + offset),
            coordinate.y,
            100,
            100,
            0.5,
            true
        );
    }

    // Return the handlers
    return {
        handleSwingEvent,
        createHitbox
    };
}

// Initialize event listeners with obstacleManager
export function initialize(obstacleManager) {
    const handlers = createEventHandlers(obstacleManager);
    
    gameEventManager.on(characterSwingEvent, handlers.handleSwingEvent);
    gameEventManager.on(obstacleCreationEvent, handlers.createHitbox);
}