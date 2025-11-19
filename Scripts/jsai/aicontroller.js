import { Character } from '../jsgameobjects/character.js';
import { GameObject } from '../jsgameobjects/gameobject.js';
import { AIMetaData } from './aimetadata.js';
import * as DecisionTreeHelperTutor from '../jsutils/decisiontreehelpertutor.js'
import { buildNoviceAITree } from './trees/novicetree.js';
import { buildVeteranAITree } from './trees/veterantree.js';
import { DecisionNode } from './decisionnode.js';
 
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
        /** @type {DecisionNode} */
        this.rootNode = buildNoviceAITree();
        this.difficulty = 1;
    }

    /**
     * Set the difficulty level and update the decision tree
     * @param {number} difficulty 
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        if (difficulty === 0) {
            this.rootNode = DecisionTreeHelperTutor.buildDoNothingTree();
        } else if (difficulty === 2) {
            this.rootNode = buildVeteranAITree();
        } else {
            this.rootNode = buildNoviceAITree();
        }
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
        // @ts-ignore
        this.aiCharacter.performHeavyattack();
    }

    evaluateMovement()
    {
        // When ai willing to move
        if(Math.abs(this.movementX) > 0.1 )
        {
            let dir = this.movementX > 0 ? 1 : -1;
            // @ts-ignore
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
        let interval = aiControllerPeriodicUpdateInterval;
        if (this.difficulty === 2) {
            interval = 16;
        } else if (this.difficulty === 1) {
            interval = 64;
        }

        if (ticks % interval < 0.1)
        {
            // Update meta data before tree update
            this.metaData.periodicUpdate();
            
            // Update decision tree
            this.rootNode.evaluate(this.metaData);
        }
    }
}