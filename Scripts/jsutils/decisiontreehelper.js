import { AIMetaData } from "../jsai/aimetadata.js";
import { DecisionNode, DecisionNodeChance } from "../jsai/decisionnode.js";
import { TerminalNode } from "../jsai/terminalnode.js";
import { SwingType } from "../jscomponents/charactercombatstate.js";

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
 * @returns {boolean}
 * @param {AIMetaData} data
 */
function dangerCheck2(data)
{
    let result = data.opponentCharacter.combatState.swingType == SwingType.LIGHT;
    console.log(`Danger Check2:${result}`);
    return result;
}

/**
 * @param {AIMetaData} data
 */
function swing(data)
{
    // Check if character can actually attack before performing
    if (!data.selfCharacter.combatState.canAttack()) {
        return;
    }
    // @ts-ignore
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    // @ts-ignore
    data.selfCharacter.performHeavyattack();
}

/**
 * @param {AIMetaData} data
 */
function jump(data)
{
    // @ts-ignore
    data.selfCharacter.jump();
    data.aiController.moveAwayFrom(data.opponentCharacter);
}
/**
 * @param {AIMetaData} data
 */
function lightSwing(data)
{
    // Check if character can actually attack before performing
    if (!data.selfCharacter.combatState.canAttack()) {
        return;
    }
    data.aiController.halt();
    // @ts-ignore
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    // @ts-ignore
    data.selfCharacter.performLightAttack();
}

/**
 * @param {AIMetaData} data
 */
function spinAttack(data)
{
    // Check if character can actually attack before performing
    if (!data.selfCharacter.combatState.canAttack()) {
        return;
    }
    data.aiController.halt();
    // @ts-ignore
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    // @ts-ignore
    data.selfCharacter.performSpinAttack();
}

/**
 * @param {AIMetaData} data
 */
function thrustAttack(data)
{
    // Check if character can actually attack before performing
    if (!data.selfCharacter.combatState.canAttack()) {
        return;
    }
    data.aiController.halt();
    // @ts-ignore
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    // @ts-ignore
    data.selfCharacter.performThrustAttack();
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
function doNothing(data) {}

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
 * @returns {TerminalNode}
 */
export function emptyTerminalNode()
{
    return new TerminalNode(doNothing);
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
export function veteranDistanceCheckNode1()
{
    let result = new DecisionNodeChance(heavyDistanceCheck);
    result.appendDNode(veteranHeavyAttackChoiceNode()); // d1 (True)
    result.appendDNode(veteranDistanceCheckNode2()); // d2 (False)
    return result;
}

/**
 * @returns {DecisionNodeChance}
 */
export function veteranHeavyAttackChoiceNode()
{
    // 50% chance to do a combo (spin attack) instead of normal heavy
    let result = new DecisionNodeChance(() => Math.random() > 0.5);
    result.appendTNode(spinAttackNode()); // t1 (True)
    result.appendTNode(heavyswingNode()); // t2 (False)
    return result;
}

/**
 * @returns {DecisionNodeChance}
 */
export function veteranDistanceCheckNode2()
{
    let result = new DecisionNodeChance(lightDistanceCheck)
    result.appendDNode(veteranLightAttackChoiceNode()); // d1 (True)
    
    result.appendTNode(emptyTerminalNode()); // t1 (True - dummy)
    result.appendTNode(moveToOpponentNode()); // t2 (False)
    return result;
}

/**
 * @returns {DecisionNodeChance}
 */
export function veteranLightAttackChoiceNode()
{
    // 50% chance to do a combo (thrust attack) instead of normal light
    let result = new DecisionNodeChance(() => Math.random() > 0.5);
    result.appendTNode(thrustAttackNode()); // t1 (True)
    result.appendTNode(lightswingNode()); // t2 (False)
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
export function dangerCheckNode2()
{
    let result = new DecisionNodeChance(dangerCheck2);
    result.appendTNode(parryLightAttackNode()); // t1
    result.appendTNode(jumpNode()); // t2
    return result;
}  

/**
 * @returns {DecisionNodeChance}
 */
export function distanceCheckNode2()
{
    let result = new DecisionNodeChance(lightDistanceCheck)
    result.appendTNode(lightswingNode()); // t1
    result.appendTNode(moveToOpponentNode()); // t2
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
export function spinAttackNode()
{
    return new TerminalNode(spinAttack)
}

/**
 * @returns {TerminalNode}
 */
export function thrustAttackNode()
{
    return new TerminalNode(thrustAttack)
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
export function moveToOpponentNode()
{
    return new TerminalNode(moveToOpponent);
}

/**
 * @returns {TerminalNode}
 */
export function parryLightAttackNode()
{
    console.log("Try to parry")
    return new TerminalNode(swing);
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
        root.appendDNode(dangerCheckNode2()) // d1
        root.appendDNode(distanceCheckNode1()); // d2
        return root;
    }
    catch(exception)
    {
        console.error(`Failed to generate default decision tree: ${exception}`);
    }
}

/**
 * This function builds a veteran decision tree for opponent AI
 * @returns {DecisionNode}
 */
export function buildVeteranAITree()
{
    try
    {
        /**@type {DecisionNodeChance} */
        let root =  dangerCheckNode();
        root.appendDNode(dangerCheckNode2()) // d1
        root.appendDNode(veteranDistanceCheckNode1()); // d2
        return root;
    }
    catch(exception)
    {
        console.error(`Failed to generate veteran decision tree: ${exception}`);
    }
}

//#endregion