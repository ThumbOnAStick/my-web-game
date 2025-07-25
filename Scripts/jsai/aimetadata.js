import { Character } from "../jsgameobjects/character.js";

export class AIMetaData
{
    /**
     * 
     * @param {Character} selfCharacter 
     * @param {Character} opponentCharacter 
     */
    constructor(selfCharacter, opponentCharacter, detectRange = 100)
    {
        this.selfCharacter = selfCharacter;
        this.opponentCharacter = opponentCharacter;
        this.vectorToOpponent = { x: 0, y: 0 }; 
        this.detectRange = detectRange;
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