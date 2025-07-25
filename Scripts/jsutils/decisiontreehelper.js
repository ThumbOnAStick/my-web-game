import { AIMetaData } from "../jsai/aimetadata.js";
import { DecisionNode, DecisionNodeChance } from "../jsai/decisionnode.js";
import { TerminalNode } from "../jsai/terminalnode.js";

//#region Calbacks
/**
 * @returns {boolean}
 * @param {AIMetaData} data
 */
function distanceCheck(data)
{
    return Math.abs(data.vectorToOpponent.x) < data.detectRange;
}

/**
 * @returns {boolean}
 * @param {AIMetaData} data
 */
function dangerCheck(data)
{
    return data.opponentCharacter.swinging;
}

/**
 * @param {AIMetaData} data
 */
function swing(data)
{
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    data.selfCharacter.performHeavyattack();
}

//#endregion

//#region Nodes
/**
 * @returns {DecisionNodeChance}
 */
export function distanceCheckNode()
{
    return new DecisionNodeChance(distanceCheck);
}  

/**
 * @returns {TerminalNode}
 */
export function swingNode()
{
    return new TerminalNode(swing)
}

/**
 * This function builds a default decision tree for opponent AI
 * @returns {DecisionNode}
 */
export function buildDefaultAITree()
{
    try
    {
        /**@type {DecisionNodeChance} */
        let root =  this.distanceCheckNode();
        let swingNode = this.swingNode();
        root.appendTNode(swingNode);
        return root;
    }
    catch(exception)
    {
        console.error(`Failed to generate default decision tree: ${exception}`);
    }
}

//#endregion