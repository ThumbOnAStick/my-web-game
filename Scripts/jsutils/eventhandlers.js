import { Character } from "../jsgameobjects/character.js";
import { AudioManager } from "../jsmanagers/audiomanager.js";
import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { ObstacleManager } from "../jsmanagers/obstaclemanager.js";
import { VFXManager } from "../jsmanagers/vfxmanager.js";
import * as CombatHandler from '../jsutils/combathandler.js';
import { GameState } from "../jscomponents/gamestate.js";
import { GlobalUIManager } from "../jsmanagers/globaluimanager.js";
import { changeSubtitle, changeSubtitleEvent, initialize_ui, startGame, startGameEvent } from "./evenhandlerui.js";
import { IScene } from "../jsscenes/scene.js";
import { GameManager } from "../jsmanagers/gamemanager.js";

export const characterSwingEvent = 'character_swing';
export const characterLightSwingEvent = 'character_light_swing';
export const characterSpinSwingEvent = 'spin_swing';
export const characterThrustSwingEvent = 'thrust_swing';
export const characterSwitchSwingTypeEvent = 'switch_swingtype';
export const characterMoveEvent = 'character_move';
export const characterJumpEvent = 'character_jump';
export const characterDodgeEvent = 'character_dodge';
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
 * @param {GameState} gameState
 */
export function createEventHandlers(obstacleManager, vfxManager, audiomanager, gameState) 
{
    
    function handleHeavySwingEvent(data) 
    {
        /**@type {Character} */
        const character = data.character;
        // @ts-ignore
        character.setSwinging(true);
        // @ts-ignore
        character.setIsCharging(true);
        gameEventManager.emit(postCharacterSwingEvent, character, 1); // Calculate damage
        gameEventManager.emit(settleCharacterSwingEvent, character, 2); // Reset character
    }

    function handleLightSwingEvent(data) 
    {
        /**@type {Character} */
        const character = data.character;
        // @ts-ignore
        character.setSwinging(true);
        // @ts-ignore
        character.setIsCharging(true);
        gameEventManager.emit(postCharacterSwingEvent, character, 0.7);  
        gameEventManager.emit(settleCharacterSwingEvent, character, 1.5);
    }

    function handleSpinSwingEvent(data) {
      /**@type {Character} */
      const character = data.character;
      // @ts-ignore
      character.setSwinging(true);
      // @ts-ignore
      character.setIsCharging(true);
      // @ts-ignore
      character.turnOnSmear(); // Start smearing
      gameEventManager.emit(characterSwitchSwingTypeEvent, character, 1);
      gameEventManager.emit(postCharacterSwingEvent, character, 1.3);
      gameEventManager.emit(settleCharacterSwingEvent, character, 2);
    }

    function handleThrustSwingEvent(data) {
      /**@type {Character} */
      const character = data.character;
      // @ts-ignore
      character.setSwinging(true);
      // @ts-ignore
      character.setIsCharging(true);
      // @ts-ignore
      character.turnOnSmear(); // Start smearing
      gameEventManager.emit(characterSwitchSwingTypeEvent, character, 1);
      gameEventManager.emit(postCharacterSwingEvent, character, 1.3);
      gameEventManager.emit(settleCharacterSwingEvent, character, 2);
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
        // @ts-ignore
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
        // @ts-ignore
        character.turnOffSmear(); // End smearing
        // @ts-ignore
        character.setIsCharging(false); // Reset character charging
        // @ts-ignore
        character.setSwinging(false); // Reset character swing
        // @ts-ignore
        character.setIsCombo(false); // Reset combo state
        // @ts-ignore
        character.playIdleAnimation(true);
    }


    function resetCharacterDodging(data)
    {
        const character = /**@type {Character} */ (data);
        if (!character) return;
        character.rig.setAlpha(1);
        // @ts-ignore
        character.setDodging(false);
        character.shrinkController.turnOff();
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
        
        // Update subtitle for player score changes
        if (!character.isOpponent && gameState.difficulty > 0) {
            if (value > 0) {
                gameEventManager.emit(changeSubtitleEvent, { key: 'ScoreGain', args: [value] });
            } else if (value < 0) {
                gameEventManager.emit(changeSubtitleEvent, { key: 'ScoreLoss', args: [-value] });
            }
        }
    }

    // @ts-ignore
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

    // @ts-ignore
    function handleCharacterShrinkEvent(data) 
    {

    }

    function handleCharacterMoveEvent(data) {
        // Optional: Add logic if needed, or just use for tutorial listening
    }

    function handleCharacterJumpEvent(data) {
        // Optional: Add logic if needed
    }

    function handleCharacterDodgeEvent(data) {
        const character = /**@type {Character} */ (data.character);
        // @ts-ignore
        character.setDodging(true);
        character.rig.setAlpha(0.5);
        character.shrinkController.turnOn();
        gameEventManager.emit(resetCharacterDodgingEvent, character, 0.5);
    }

    // @ts-ignore
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
        handleCharacterShrinkEvent,
        handleCharacterMoveEvent,
        handleCharacterJumpEvent,
        handleCharacterDodgeEvent
    };

}

// Initialize event listeners with obstacleManager
/**
 * 
 * @param {ObstacleManager} obstacleManager 
 * @param {VFXManager} vfxManager 
 * @param {AudioManager} audioManager
 * @param {GameState} gameState
 * @param {GlobalUIManager} uiManager
 * @param {IScene} rootScene
 */
export function initialize(obstacleManager, vfxManager, audioManager, uiManager, gameState, rootScene) 
{
    initialize_ui(uiManager, rootScene);

    const handlers = createEventHandlers(obstacleManager, vfxManager, audioManager, gameState);
    gameEventManager.on(characterSwingEvent, handlers.handleHeavySwingEvent);
    gameEventManager.on(characterLightSwingEvent, handlers.handleLightSwingEvent);
    gameEventManager.on(characterSpinSwingEvent, handlers.handleSpinSwingEvent);
    gameEventManager.on(characterThrustSwingEvent, handlers.handleThrustSwingEvent);
    gameEventManager.on(characterSwitchSwingTypeEvent, handlers.handleSwitchSwingTypeEvent);
    gameEventManager.on(characterMoveEvent, handlers.handleCharacterMoveEvent);
    gameEventManager.on(characterJumpEvent, handlers.handleCharacterJumpEvent);
    gameEventManager.on(characterDodgeEvent, handlers.handleCharacterDodgeEvent);
    gameEventManager.on(postCharacterSwingEvent, handlers.handlePostSwingEvent);
    gameEventManager.on(resetCharacterDodgingEvent, handlers.resetCharacterDodging);
    gameEventManager.on(resetCharacterParriedEvent, handlers.resetCharacterParried);
    gameEventManager.on(settleCharacterSwingEvent, handlers.settleCharacterSwing);
    gameEventManager.on(setScoreChangesEvent, handlers.setScoreChanges);
    gameEventManager.on(clearScoreChangesEvent, handlers.resetScorechanges);
    gameEventManager.on(spawnParryFlashEvent, handlers.spawnParryFlash);
    gameEventManager.on(playNamedClipEvent, handlers.playSoundClip);

    /** UI */
    gameEventManager.on(changeSubtitleEvent, changeSubtitle);
    gameEventManager.on(startGameEvent, startGame);



}