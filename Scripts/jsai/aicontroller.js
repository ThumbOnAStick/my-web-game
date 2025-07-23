import { Character } from '../jsgameobjects/character.js';
import { GameObject } from '../jsgameobjects/gameobject.js';

export class AIController
{
    /**
     * @param {Character} aiCharacter - The AI-controlled character
     * @param {number} attackRange - Distance at which AI can attack the player
     */
    constructor(aiCharacter, movementSpeed = 10, attackRange = 200) 
    {
        this.aiCharacter = aiCharacter;
        this.movementSpeed = movementSpeed;
        this.attackRange = attackRange;
        
        // Initialize other  variables
        this.movementX = 0;
        this.decisionCooldown = 0;
        this.decisionInterval = 30; 
    }


    //#region Movements
    /**
     * 
     * @param {GameObject} gameobject 
     */
    moveTowards(gameobject)
    {
        this.movementX = gameobject.x - this.aiCharacter.x;
    }

    /**
     * 
     * @param {GameObject} gameobject 
     */
    moveAwayFrom(gameobject)
    {
        this.movementX = gameobject.x + this.aiCharacter.x;
    }

    halt()
    {
        this.movementX = 0;
    }

    //#endregion

    update() 
    {
        this.aiCharacter.rigidbody.move(this.movementX);
    }
}