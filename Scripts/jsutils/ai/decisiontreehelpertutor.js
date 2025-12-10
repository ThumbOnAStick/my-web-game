import { AIMetaData } from "../../jsai/aimetadata.js";
import { DecisionNode, DecisionNodeChance } from "../../jsai/decisionnode.js";
import { TerminalNode } from "../../jsai/terminalnode.js";

//#region Callbacks

/**
 * @returns {boolean}
 * @param {AIMetaData} data
 */
function alwaysTrue(data)
{
    return true;
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

//#endregion

//#region Nodes

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
export function lightswingNode()
{
    return new TerminalNode(lightSwing)
}

//#endregion

//#region Trees

/**
 * @returns {DecisionNode}
 */
export function buildHeavySwingTree()
{
    let root = new DecisionNodeChance(alwaysTrue);
    root.appendTNode(heavyswingNode());
    return root;
}

/**
 * @returns {DecisionNode}
 */
export function buildLightSwingTree()
{
    let root = new DecisionNodeChance(alwaysTrue);
    root.appendTNode(lightswingNode());     
    return root;
}

/**
 * @returns {DecisionNode}
 */
export function buildDoNothingTree()
{
    return new DecisionNode();
}

//#endregion
