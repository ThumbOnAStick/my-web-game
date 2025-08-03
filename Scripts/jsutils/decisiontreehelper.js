import { AIMetaData } from "../jsai/aimetadata.js";
import { DecisionNode, DecisionNodeChance } from "../jsai/decisionnode.js";
import { TerminalNode } from "../jsai/terminalnode.js";

//#region Calbacks
/**
 * @returns {boolean}
 * @param {AIMetaData} data
 */
function heavyDistanceCheck(data)
{
    return Math.abs(data.vectorToOpponent.x) < data.heavyDetectRange;
}

/**
 * @returns {boolean}
 * @param {AIMetaData} data
 */
function lightDistanceCheck(data)
{
    return Math.abs(data.vectorToOpponent.x) < data.lightDtectRange;
}

/**
 * @returns {boolean}
 * @param {AIMetaData} data
 */
function dangerCheck(data)
{
    return data.opponentCharacter.combatState.isCharging && !data.selfCharacter.combatState.isCharging;
}

/**
 * @param {AIMetaData} data
 */
function swing(data)
{
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    data.selfCharacter.performHeavyattack();
}

/**
 * @param {AIMetaData} data
 */
function jump(data)
{
    data.selfCharacter.jump();
    data.aiController.moveAwayFrom(data.opponentCharacter);
}
/**
 * @param {AIMetaData} data
 */
function lightSwing(data)
{
    data.aiController.halt();
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    data.selfCharacter.performLightAttack();
}

/**
 * @param {AIMetaData} data
 */
function moveToOpponent(data)
{
    data.aiController.moveTowards(data.opponentCharacter);
}

/**
 * @param {AIMetaData} data
 */
function moveAwayFromOpponent(data)
{
    data.aiController.moveAwayFrom(data.opponentCharacter);

}


//#endregion

//#region Nodes
/**
 * a node that does nothing
 * @returns {DecisionNode}
 */
export function emptyNode()
{
    return new DecisionNode();
}  

/**
 * @returns {DecisionNodeChance}
 */
export function distanceCheckNode1()
{
    let result = new DecisionNodeChance(heavyDistanceCheck);
    result.appendTNode(heavyswingNode()); // t1
    result.appendDNode(emptyNode()); // d1
    result.appendDNode(distanceCheckNode2()); // d2
    return result;
}  

/**
 * @returns {DecisionNodeChance}
 */
export function dangerCheckNode()
{
    let result = new DecisionNodeChance(dangerCheck);
    return result;
}  

/**
 * @returns {DecisionNodeChance}
 */
export function distanceCheckNode2()
{
    let result = new DecisionNodeChance(lightDistanceCheck)
    result.appendTNode(lightswingNode()); // t1
    result.appendTNode(moveToNode()); // t2
    return result;
}  

/**
 * @returns {TerminalNode}
 */
export function heavyswingNode()
{
    return new TerminalNode(swing)
}

/**
 * @returns {TerminalNode}
 */
export function jumpNode()
{
    return new TerminalNode(jump)
}

/**
 * @returns {TerminalNode}
 */
export function lightswingNode()
{
    return new TerminalNode(lightSwing)
}

/**
 * @returns {TerminalNode}
 */
export function moveToNode()
{
    return new TerminalNode(moveToOpponent);
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
        let root =  dangerCheckNode();
        root.appendTNode(jumpNode()) // t1
        root.appendDNode(emptyNode()); // d1
        root.appendDNode(distanceCheckNode1()); // d2
        return root;
    }
    catch(exception)
    {
        console.error(`Failed to generate default decision tree: ${exception}`);
    }
}

//#endregion