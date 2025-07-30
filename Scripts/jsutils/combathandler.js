import { CharacterCombatState } from "../jscomponents/charactercombatstate.js";
import { Character } from "../jsgameobjects/character.js";
import { GameObject } from "../jsgameobjects/gameobject.js";
import { gameEventManager } from "../jsmanagers/eventmanager.js";
import { ObstacleManager } from "../jsmanagers/obstaclemanager.js";
import * as EventHandlers from './eventhandlers.js'


const characterDodgeAlpha = 0.5;
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
        character.setDodging(true);
        if(obstacle != null)
        {
            character.loseScore(obstacle.damage);
            character.adjustHitFacing(obstacle);
            // character.rigidbody.applyForceTo(characterDodgeForce, character, obstacle, true, false, true);
        }
        character.rig.setAlpha(characterDodgeAlpha);
        gameEventManager.emit(EventHandlers.resetCharacterDodgingEvent, character, 1);

        gameEventManager.freezeFor(5);
}

/**
 * 
 * @param {Character} character 
 */
function breakFromSwing(character, time)
{
    character.setSwinging(false); // Force exit swing
    character.setParried(true);  
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
function characterParry(defender, offender = null, offenderSource = null) {
    gameEventManager.freezeFor(characterParryFreezeFrame);
    if (offender)
    {
        defender.rigidbody.applyForceTo(characterParryFallback, offender, defender, true, false, true);
        if(offender.source && offender.source instanceof Character)
        {
            breakFromSwing(offender.source, 2);
        }
        breakFromSwing(defender, 1);
        gameEventManager.emit(EventHandlers.spawnParryFlashEvent, defender);

        defender.score(5);
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
 * @param {Character} character 
 * @param {ObstacleManager} obstacleManager
 */
export function swingAndMoveForward(character, obstacleManager) {
    if (!character.dodging && !character.combatState.parried) // if character is dodging or is parried, following acts cannot be conducted
    {
        const coordinate = character.selfCoordinate()
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
                character.getSwingHitboxLifetime(),
                true,
                character.id,
                character,
                character.getSwingDamage()
            );
        // Push character forward
        character.rigidbody.applyForce(15, character.facing);
    }
}