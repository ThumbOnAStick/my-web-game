import { Character } from "../jsgameobjects/character.js";
import { Obstacle } from "../jsgameobjects/obstacle.js";
import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { ObstacleManager } from "../jsmanagers/obstaclemanager.js";

export const characterSwingEvent = 'character_swing';
export const characterDodgeEvent = 'character_dodge';
export const obstacleCreationEvent = 'create_obstacle';
export const resetCharacterTransparencyEvent = 'reset_transparency';

const characterDodgeAlpha = 0.5;
const characterDodgeForce = 30;
const heavyHitDamage = 10;

// Create event handlers that capture obstacleManager
/**@param {ObstacleManager} obstacleManager */
export function createEventHandlers(obstacleManager) {
    
    function handleSwingEvent(data) 
    {
        /**@type {Character} */
        const character = data;
        gameEventManager.emit(obstacleCreationEvent, data, 1);
    }

    function createHitbox(data) 
    {
        /**@type {Character} */
        const character = data;
        if(!character)
        {
            return;
        }
        const coordinate = character.selfCoordinate()
        const sizeX = 100;
        const sizeY = 100;
        const offsetX = sizeX/2;
        const offsetY = (character.height) / 2;
        // Spawn obstacle on character location
        obstacleManager.spawnObstacle(
            coordinate.x + character.facing * offsetX,
            coordinate.y - offsetY,
            sizeX,
            sizeY,
            0.5,
            true,
            character.id,
            character
        );
        // Push character forward
        character.rigidbody.applyForce(15, character.facing);
    }

    function characterDodge(data)
    {
        const { character, obstacle } = /**@type {{character: Character, obstacle: Obstacle}}*/ (data);
        character.takeDamage(heavyHitDamage);
        character.adjustHitFacing(obstacle);
        character.rigidbody.applyForceTo(characterDodgeForce, character, obstacle, true, false, true);
        character.rig.setAlpha(characterDodgeAlpha);
        gameEventManager.emit(resetCharacterTransparencyEvent, character, 1);
    }


    function resetCharacterTransparency(data)
    {
        const character = /**@type {Character} */ (data);
        if (!character) return;
        character.rig.setAlpha(1);
    }

    // Return the handlers
    return {
        handleSwingEvent,
        createHitbox,
        characterDodge,
        resetCharacterTransparency
    };

}

// Initialize event listeners with obstacleManager
export function initialize(obstacleManager) {
    const handlers = createEventHandlers(obstacleManager);
    
    gameEventManager.on(characterSwingEvent, handlers.handleSwingEvent);
    gameEventManager.on(characterDodgeEvent, handlers.characterDodge);
    gameEventManager.on(obstacleCreationEvent, handlers.createHitbox);
    gameEventManager.on(resetCharacterTransparencyEvent, handlers.resetCharacterTransparency);

}