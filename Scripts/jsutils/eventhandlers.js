import { Character } from "../jsgameobjects/character.js";
import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { ObstacleManager } from "../jsmanagers/obstaclemanager.js";
import * as CombatHandler from '../jsutils/combathandler.js';

export const characterSwingEvent = 'character_swing';
export const characterLightSwingEvent = 'character_light_swing';
export const postCharacterSwingEvent = 'create_obstacle';
export const settleCharacterSwingEvent = 'settle_swing';
export const resetCharacterDodgingEvent = 'reset_transparency';
export const resetCharacterParriedEvent = 'reset_Parried';



// Create event handlers that capture obstacleManager
/**@param {ObstacleManager} obstacleManager */
export function createEventHandlers(obstacleManager) 
{
    
    function handleSwingEvent(data) 
    {
        /**@type {Character} */
        const character = data;
        character.setSwinging(true);
        character.setIsCharging(true);
        gameEventManager.emit(postCharacterSwingEvent, data, 1); // Calculate damage
        gameEventManager.emit(settleCharacterSwingEvent, data, 1.5); // Reset character
    }

    function handleLightSwingEvent(data) 
    {
        /**@type {Character} */
        const character = data;
        character.setSwinging(true);
        gameEventManager.emit(postCharacterSwingEvent, data, 0.7);  
        gameEventManager.emit(settleCharacterSwingEvent, data, 1);

    }


    function handlePostSwingEvent(data) 
    {
        /**@type {Character} */
        const character = data;
        if(!character)
        {
            return;
        }
        character.setIsCharging(false); // Reset character charging
        CombatHandler.swingAndMoveForward(character, obstacleManager); // Swing and move forward using rigidbody
    
    }

    function settleCharacterSwing(data)
    {
        /**@type {Character} */
        const character = data;
        if(!character)
        {
            return;
        }
        character.setIsCharging(false); // Reset character charging
        character.setSwinging(false); // Reset character swing
    }


    function resetCharacterDodging(data)
    {
        const character = /**@type {Character} */ (data);
        if (!character) return;
        character.rig.setAlpha(1);
        character.setDodging(false);
    }

    function resetCharacterParried(data)
    {
        const character = /**@type {Character} */ (data);
        if (!character) return;
        character.combatState.setParried(false);
    }

    // Return the handlers
    return {
        handleSwingEvent,
        handleLightSwingEvent,
        handlePostSwingEvent,
        resetCharacterDodging,
        resetCharacterParried,
        settleCharacterSwing
    };

}

// Initialize event listeners with obstacleManager
export function initialize(obstacleManager) {
    const handlers = createEventHandlers(obstacleManager);
    
    gameEventManager.on(characterSwingEvent, handlers.handleSwingEvent);
    gameEventManager.on(characterLightSwingEvent, handlers.handleLightSwingEvent);
    gameEventManager.on(postCharacterSwingEvent, handlers.handlePostSwingEvent);
    gameEventManager.on(resetCharacterDodgingEvent, handlers.resetCharacterDodging);
    gameEventManager.on(resetCharacterParriedEvent, handlers.resetCharacterParried);
    gameEventManager.on(settleCharacterSwingEvent, handlers.settleCharacterSwing);

}