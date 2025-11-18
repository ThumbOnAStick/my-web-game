import { CharacterCombatState } from "../jscomponents/charactercombatstate.js";
import { Character } from "../jsgameobjects/character.js";
import { GameObject } from "../jsgameobjects/gameobject.js";
import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { ObstacleManager } from "../jsmanagers/obstaclemanager.js";
import * as EventHandlers from './eventhandlers.js'


const characterDodgeAlpha = 0.5;
// @ts-ignore
const characterDodgeForce = 30;
const characterParryFallback = 15;
const characterParryFreezeFrame = 10;


/**
 * @param {Character} defender
 * @param {CharacterCombatState} combatStateOther
 * @returns {String}
 */
function damageResult(defender, combatStateOther = null)
{
    if(defender.combatState.canParry())
    {
        if(combatStateOther && combatStateOther.cannotBeParried(defender.combatState.swingType))
        {
            return 'hit';
        }
        return 'parry';
    }
    return 'hit';
}

/**
 * 
 * @param {Character} character 
 */
function characterDodge(character, obstacle = null)
{
        // @ts-ignore
        character.setDodging(true);
        character.shrinkController.turnOn();
        if(obstacle != null)
        {
            // @ts-ignore
            character.loseScore(obstacle.damage);
            // @ts-ignore
            character.adjustHitFacing(obstacle);
            // character.rigidbody.applyForceTo(characterDodgeForce, character, obstacle, true, false, true);
        }
        character.rig.setAlpha(characterDodgeAlpha);
        gameEventManager.emit(EventHandlers.resetCharacterDodgingEvent, character, 1);
        // gameEventManager.emit(EventHandlers.playNamedClipEvent, 'dodge', 0.2);
        gameEventManager.freezeFor(5);
}

/**
 * 
 * @param {Character} character 
 */
function breakFromSwing(character, time)
{
    // @ts-ignore
    character.setSwinging(false); // Force exit swing
    // @ts-ignore
    character.setParried(true);  
    // @ts-ignore
    character.playStaggerAnimation(false);
    gameEventManager.emit(EventHandlers.resetCharacterDodgingEvent, character, time)
    gameEventManager.emit(EventHandlers.resetCharacterParriedEvent, character, time);
}

/**
 * 
 * @param {Character} defender 
 * @param {GameObject} offender
 * @param {Character} offenderSource
 */
// @ts-ignore
function characterParry(defender, offender = null, offenderSource = null) {
    gameEventManager.freezeFor(characterParryFreezeFrame);
    if (offender)
    {
        defender.rigidbody.applyForceTo(characterParryFallback, offender, defender, true, false, true);
        if(offender.source && offender.source instanceof Character)
        {
            breakFromSwing(offender.source, 1.2);
        }
        breakFromSwing(defender, 0.2);
        gameEventManager.emit(EventHandlers.spawnParryFlashEvent, defender);
        gameEventManager.emit(EventHandlers.playNamedClipEvent, 'parry');

        // @ts-ignore
        defender.score(10);
    }
}

/**
 * 
 * @param {Character} defender 
 * @param {GameObject} offender 
 */
export function handleCharacterDamageResult(defender, offender = null)
{
    // Get offender's combat state if offender is a Character
    let offenderCombatState = null;
    if (offender && offender.source && offender.source instanceof Character) {
        offenderCombatState = offender.source.combatState;
    }

    const result = damageResult(defender, offenderCombatState);
    switch(result)
    {
        case 'hit':
            characterDodge(defender, offender);
            break;

        case 'parry':
            characterParry(defender, offender);
            break;

        default:
            break;
    }
}

/**
 * Move the character forward and create a hitbox
 * @param {Character} character 
 * @param {ObstacleManager} obstacleManager
 */
export function swingAndMoveForward(character, obstacleManager) {
    if (!character.combatState.isCharging && !character.combatState.dodging && !character.combatState.parried) // if character is dodging or is parried, following acts cannot be conducted
    {
        const coordinate = character.selfCoordinate()
        // @ts-ignore
        const sizeX = character.getSwingRange();
        const sizeY = 100;
        const offsetX = sizeX / 2;
        const offsetY = (character.height) / 2;
        // Spawn obstacle on character location
        obstacleManager.spawnObstacle
            (
                coordinate.x + character.facing * offsetX,
                coordinate.y - offsetY,
                sizeX,
                sizeY,
                // @ts-ignore
                character.getSwingHitboxLifetime(), // Lifetime
                true,
                character.id,
                character,
                // @ts-ignore
                character.getSwingDamage()
            );
        // Push character forward
        character.rigidbody.applyForce(15, character.facing);
    }
}