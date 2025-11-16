import { Character } from '../jsgameobjects/character.js';
import { GameObject } from '../jsgameobjects/gameobject.js';
import { AIMetaData } from './aimetadata.js';
import * as DecisionTreeHelper from '../jsutils/decisiontreehelper.js'
 
const aiControllerPeriodicUpdateInterval = 16 * 2; // Update action tree once every 32 ticks (2s)

export class AIController
{
    /**
     * @param {Character} aiCharacter - The AI-controlled character
     * @param {Character} playerCharacter - Player-controlled character
     * @param {number} attackRange - Distance at which AI can attack the player
     */
    constructor(aiCharacter, playerCharacter, movementSpeed = 10, attackRange = 200) 
    {
        this.aiCharacter = aiCharacter;
        this.playerCharacter = playerCharacter;
        this.movementSpeed = movementSpeed;
        this.attackRange = attackRange;
        
        // Initialize other variables
        this.movementX = 0;
        this.decisionCooldown = 0;
        this.decisionInterval = 30; 
        this.metaData = new AIMetaData(aiCharacter, playerCharacter, this);
        this.rootNode = DecisionTreeHelper.buildDefaultAITree();
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
        this.movementX =  this.aiCharacter.x - gameobject.x;
    }

    parryLightAttack() 
    {
        this.aiCharacter.performHeavyattack();
    }

    evaluateMovement()
    {
        // When ai willing to move
        if(Math.abs(this.movementX) > 0.1 )
        {
            let dir = this.movementX > 0 ? 1 : -1;
            this.aiCharacter.move(dir);
        }
    }

    halt()
    {
        this.movementX = 0;
    }

    //#endregion

    /**
     * This is executed in main loop.
     * @param {number} ticks - The current tick count.
     */
    update(ticks) 
    {
        // Execute immediate movement (reflexes/continuous actions)
        this.evaluateMovement();

        // Handle strategic decision-making at intervals
        this.periodicUpdate(ticks);
    }

    /**
     * Called periodically to update AI metadata.
     * @param {number} ticks - The current tick count.
     */
    periodicUpdate(ticks)
    {
        if (ticks % aiControllerPeriodicUpdateInterval < 0.1)
        {
            // Update meta data before tree update
            this.metaData.periodicUpdate();
            
            // Update decision tree
            this.rootNode.evaluate(this.metaData);
        }
    }
}