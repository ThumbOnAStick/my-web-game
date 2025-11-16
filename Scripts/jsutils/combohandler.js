import { Character } from "../jsgameobjects/character.js";

const COMBOS = {
    LIGHT_ATTACK: new Uint8Array([0]),
    HEAVY_ATTACK: new Uint8Array([1]),
    SPIN_SWING: new Uint8Array([1, 0]),
    THRUST: new Uint8Array([0, 1]),
};

/**
 * @param {Uint8Array} arr1 
 * @param {Uint8Array} arr2 
 * @returns {boolean}
 */
function arraysEqual(arr1, arr2) 
{    
    if (arr1.length !== arr2.length) return false;
    
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}


/**
 * @param {Character} character 
 * @param {Uint8Array} input
 * @returns {void}
 */
export function handleCombos(character, input) 
{
    if (arraysEqual(input, COMBOS.LIGHT_ATTACK)) 
    {
        character.performLightAttack();
        return;
    }

    if(arraysEqual(input, COMBOS.HEAVY_ATTACK))
    {
        character.performHeavyattack();
        return;
    }

    if(arraysEqual(input, COMBOS.SPIN_SWING))
    {
        character.performSpinAttack();
        return;
    }

    if(arraysEqual(input, COMBOS.THRUST))
    {
        console.log("thrust");
        character.performThrustAttack();
        return;
    }
}

