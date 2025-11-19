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
        // Adjust facing towards opponent if possible
        // We need to find the opponent first. Since we don't have direct access to CharacterManager here,
        // we can try to find the opponent from the obstacleManager's context or pass it in.
        // However, a simpler way is to check if the character has a reference to its opponent or if we can infer it.
        // Assuming 2 player game for now, we can't easily get the other player without passing it.
        // BUT, the user request is "Adjust character facing the moment charging ended."
        // This function is called when charging ends (via animation event or similar trigger).
        
        // Let's try to find the opponent from the gameEventManager or similar if possible, 
        // but since we don't have easy access, we might need to rely on the character's existing knowledge or pass it.
        // The character class has 'adjustHitFacing(other)'.
        
        // A hacky but effective way if we assume 1v1 and we are in a context where we can access the other character.
        // Since we can't easily change the signature without affecting callers, let's see if we can get the opponent.
        // Actually, let's look at where this is called. It's called from AnimationController or similar.
        
        // Wait, the user just wants the character to face the opponent when the swing starts (which is when charging ends).
        // We can iterate through all characters in the obstacleManager if it had them, but it doesn't.
        
        // Let's look at 'character.js'. It doesn't store a reference to the opponent.
        // However, 'AIController' does. But this is for both player and AI.
        
        // Let's use a global lookup or similar if available, or just skip if we can't find it.
        // Actually, we can use 'gameEventManager' to request the opponent? No, that's async/complex.
        
        // Let's look at 'CharacterManager'. It has 'getCharacters()'.
        // We can't import 'CharacterManager' instance here easily.
        
        // ALTERNATIVE: The 'character' object might be able to find its opponent if we modify 'Character' to know about the game/opponent,
        // OR we modify 'swingAndMoveForward' to take the opponent as an argument.
        
        // Let's modify 'swingAndMoveForward' to accept 'opponent' as an optional argument, 
        // and update the caller to pass it.
        // But wait, the caller is likely an event handler or animation callback.
        
        // Let's look at 'Scripts/jscomponents/characteranimation.js' or wherever this is called.
        // It is likely called via an event.
        
        // Actually, let's look at 'Scripts/jsutils/eventhandlers.js'.
        
        // If we can't easily pass the opponent, maybe we can just use the character's current facing?
        // The user specifically asked to "Adjust character facing".
        
        // Let's try to find the opponent by checking the global game state if possible, or...
        // Wait, 'gameEventManager' is imported. Maybe we can use it?
        
        // Let's try to import 'GameManager' instance? No, circular dependency risk.
        
        // Let's look at 'Scripts/jsmanagers/gamemanager.js'. It has 'characterManager'.
        // If we can access the singleton 'gameManager' (if it exists), we are good.
        // But 'GameManager' is a class, not a singleton export.
        
        // Let's look at 'Scripts/library.js' or 'Scripts/main.js'.
        
        // OK, let's look at how 'swingAndMoveForward' is called.
        // It's likely called in 'Scripts/jsutils/eventhandlers.js'.
        
        // Let's assume we can't easily get the opponent here without refactoring.
        // BUT, we can try to find the opponent by checking the 'characters' array if we had access.
        
        // Let's try to use 'gameEventManager' to find the opponent.
        // We can emit an event to get the opponent? No, events are for actions.
        
        // Let's look at 'Scripts/jsmanagers/eventmanager.js'.
        
        // Let's try a different approach. 
        // We can add a property to 'Character' called 'opponent'.
        // And set it in 'CharacterManager'.
        
        // Let's do that. It's the cleanest way.
        // 1. Modify 'Character' to have 'opponent'.
        // 2. Modify 'CharacterManager' to set 'opponent' for each character.
        // 3. Use 'character.opponent' here.
        
        if (character.opponent) {
             // @ts-ignore
            character.adjustHitFacing(character.opponent);
        }

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