import { Character } from "../jsgameobjects/character.js";
import { AudioManager } from "../jsmanagers/audiomanager.js";
import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { ObstacleManager } from "../jsmanagers/obstaclemanager.js";
import { VFXManager } from "../jsmanagers/vfxmanager.js";
import * as CombatHandler from '../jsutils/combathandler.js';

export const characterSwingEvent = 'character_swing';
export const characterLightSwingEvent = 'character_light_swing';
export const characterSpinSwingEvent = 'spin_swing';
export const characterThrustSwingEvent = 'thrust_swing';
export const characterSwitchSwingTypeEvent = 'switch_swingtype';
export const postCharacterSwingEvent = 'create_obstacle';
export const settleCharacterSwingEvent = 'settle_swing';
export const resetCharacterDodgingEvent = 'reset_transparency';
export const resetCharacterParriedEvent = 'reset_Parried';
export const setScoreChangesEvent = 'set_score';
export const clearScoreChangesEvent = 'reset_score';
export const spawnParryFlashEvent = 'create_flash';
export const playNamedClipEvent = 'play_sound_clip';
export const handleCharacterShrinkEvent = 'character_shrink';



// Create event handlers that capture obstacleManager
/**
 * @param {ObstacleManager} obstacleManager 
 * @param {VFXManager} vfxManager 
 * @param {AudioManager} audiomanager
*/
export function createEventHandlers(obstacleManager, vfxManager, audiomanager) 
{
    
    function handleHeavySwingEvent(data) 
    {
        /**@type {Character} */
        const character = data;
        character.setSwinging(true);
        character.setIsCharging(true);
        gameEventManager.emit(postCharacterSwingEvent, data, 1); // Calculate damage
        gameEventManager.emit(settleCharacterSwingEvent, data, 2); // Reset character
    }

    function handleLightSwingEvent(data) 
    {
        /**@type {Character} */
        const character = data;
        character.setSwinging(true);
        character.setIsCharging(true);
        gameEventManager.emit(postCharacterSwingEvent, data, 0.7);  
        gameEventManager.emit(settleCharacterSwingEvent, data, 1.5);
    }

    function handleSpinSwingEvent(data) 
    {
        /**@type {Character} */
        const character = data;
        character.setSwinging(true);
        character.setIsCharging(true);
        gameEventManager.emit(characterSwitchSwingTypeEvent, data, 1);  
        gameEventManager.emit(postCharacterSwingEvent, data, 1.3);  
        gameEventManager.emit(settleCharacterSwingEvent, data, 2);
    }

    function handleThrustSwingEvent(data) 
    {
        /**@type {Character} */
        const character = data;
        character.setSwinging(true);
        character.setIsCharging(true);
        gameEventManager.emit(characterSwitchSwingTypeEvent, data, 1);  
        gameEventManager.emit(postCharacterSwingEvent, data, 1.3);  
        gameEventManager.emit(settleCharacterSwingEvent, data, 2);
    }
    function handleSwitchSwingTypeEvent(data)
    {
        /**@type {Character} */
        const character = data;
        character.combatState.switchSwingType();
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

    /**
     * @param {{ value: number, character: Character }} data
     */
    function setScoreChanges(data)
    {
        const { value, character } = data;
        gameEventManager.setScoreChanges(value, character);
        gameEventManager.emit(clearScoreChangesEvent, data, 1);
    }

    function resetScorechanges(data)
    {
        gameEventManager.clearScoreChanges();
    }

    function spawnParryFlash(data)
    {
        const character = /**@type {Character} */ (data);
        let weaponBone = character.weaponBone;
        let weaponWorldPos = weaponBone.getWorldPosition();
        vfxManager.make('flash', weaponBone.angle * character.facing, weaponWorldPos.x, weaponWorldPos.y, 10, 100, 1000);
    }

    function playSoundClip(data)
    {
        const clipName = /**@type {String} */ (data);
        audiomanager.playOnce(clipName);

    }

    function handleCharacterShrinkEvent(data) 
    {

    }

    function handlecharacterResizeEvent(data){
        
    }

    // Return the handlers
    return {
        handleHeavySwingEvent,
        handleLightSwingEvent,
        handleSpinSwingEvent,
        handleThrustSwingEvent,
        handleSwitchSwingTypeEvent,
        handlePostSwingEvent,
        resetCharacterDodging,
        resetCharacterParried,
        settleCharacterSwing,
        setScoreChanges,
        resetScorechanges,
        spawnParryFlash,
        playSoundClip,
        handleCharacterShrinkEvent
    };

}

// Initialize event listeners with obstacleManager
/**
 * 
 * @param {ObstacleManager} obstacleManager 
 * @param {VFXManager} vfxManager 
 * @param {AudioManager} audioManager
 */
export function initialize(obstacleManager, vfxManager, audioManager) 
{
    const handlers = createEventHandlers(obstacleManager, vfxManager, audioManager);
    
    gameEventManager.on(characterSwingEvent, handlers.handleHeavySwingEvent);
    gameEventManager.on(characterLightSwingEvent, handlers.handleLightSwingEvent);
    gameEventManager.on(characterSpinSwingEvent, handlers.handleSpinSwingEvent);
    gameEventManager.on(characterThrustSwingEvent, handlers.handleThrustSwingEvent);
    gameEventManager.on(characterSwitchSwingTypeEvent, handlers.handleSwitchSwingTypeEvent);
    gameEventManager.on(postCharacterSwingEvent, handlers.handlePostSwingEvent);
    gameEventManager.on(resetCharacterDodgingEvent, handlers.resetCharacterDodging);
    gameEventManager.on(resetCharacterParriedEvent, handlers.resetCharacterParried);
    gameEventManager.on(settleCharacterSwingEvent, handlers.settleCharacterSwing);
    gameEventManager.on(setScoreChangesEvent, handlers.setScoreChanges);
    gameEventManager.on(clearScoreChangesEvent, handlers.resetScorechanges);
    gameEventManager.on(spawnParryFlashEvent, handlers.spawnParryFlash);
    gameEventManager.on(playNamedClipEvent, handlers.playSoundClip);



}