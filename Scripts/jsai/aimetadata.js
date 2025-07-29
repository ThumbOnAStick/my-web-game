import { Character } from "../jsgameobjects/character.js";
import { AIController } from "./aicontroller.js";

export class AIMetaData
{
    /**
     * 
     * @param {Character} selfCharacter 
     * @param {Character} opponentCharacter 
     * @param {AIController} aiController
     */
    constructor(selfCharacter, opponentCharacter, aiController, heavyDetectRange = 100, lightDetectRange = 150)
    {
        this.selfCharacter = selfCharacter;
        this.opponentCharacter = opponentCharacter;
        this.vectorToOpponent = { x: 0, y: 0 }; 
        this.heavyDetectRange = heavyDetectRange;
        this.lightDtectRange = lightDetectRange;
        this.aiController = aiController;
    }

    periodicUpdate()
    {
        // Implement periodic AI metadata updates here.
        this.updateVector();
    }

    updateVector()
    {
        // Calculate vector from AI character to opponent
        this.vectorToOpponent.x = this.opponentCharacter.x - this.selfCharacter.x;
        this.vectorToOpponent.y = this.opponentCharacter.y - this.selfCharacter.y;
    }
}