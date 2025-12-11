import { AIMetaData } from "../aimetadata.js";
import { DecisionNode, DecisionNodeChance } from "../decisionnode.js";
import { TerminalNode } from "../terminalnode.js";
import { SwingType } from "../../jscomponents/charactercombatstate.js";
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";

//#region Callbacks
export function heavyDistanceCheck(data) {
    return Math.abs(data.vectorToOpponent.x) < data.heavyDetectRange;
}

export function lightDistanceCheck(data) {
    return Math.abs(data.vectorToOpponent.x) < data.lightDtectRange;
}

export function dangerCheck(data) {
    return data.opponentCharacter.combatState.isCharging && !data.selfCharacter.combatState.isCharging;
}

export function dangerCheck2(data) {
    let result = data.opponentCharacter.combatState.swingType == SwingType.LIGHT;
    return result;
}

export function swing(data) {
    if (!data.selfCharacter.combatState.canAttack()) return;
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    data.selfCharacter.performHeavyattack();
}

export function jump(data) {
    data.selfCharacter.jump();
    data.aiController.moveAwayFrom(data.opponentCharacter);
}

export function lightSwing(data) {
    if (!data.selfCharacter.combatState.canAttack()) return;
    // data.aiController.halt();
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    data.selfCharacter.performLightAttack();
}

export function moveToOpponent(data) {
    data.aiController.moveTowards(data.opponentCharacter);
}

export function spinAttack(data) {
    if (!data.selfCharacter.combatState.canAttack()) return;
    // data.aiController.halt();
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    data.selfCharacter.performSpinAttack();
}

export function thrustAttack(data) {
    if (!data.selfCharacter.combatState.canAttack()) return;
    data.aiController.halt();
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    data.selfCharacter.performThrustAttack();
}

export function leapStrike(data) {
    if (!data.selfCharacter.combatState.canAttack()) return;
    data.aiController.moveTowards(data.opponentCharacter);
    data.selfCharacter.adjustHitFacing(data.opponentCharacter);
    data.selfCharacter.performHeavyattack();
    data.selfCharacter.jump();
}

export function doNothing(data) {}
//#endregion

//#region Node Creators
export function createEmptyNode() {
    return new DecisionNode();
}

export function createEmptyTerminalNode() {
    return new TerminalNode(doNothing);
}

export function createHeavyDistanceCheckNode() {
    return new DecisionNodeChance(heavyDistanceCheck);
}

export function createLightDistanceCheckNode() {
    return new DecisionNodeChance(lightDistanceCheck);
}

export function createDangerCheckNode() {
    return new DecisionNodeChance(dangerCheck);
}

export function createDangerCheckNode2() {
    return new DecisionNodeChance(dangerCheck2);
}

export function createHeavySwingNode() {
    return new TerminalNode(swing);
}

export function createJumpNode() {
    return new TerminalNode(jump);
}

export function createLightSwingNode() {
    return new TerminalNode(lightSwing);
}

export function createMoveToOpponentNode() {
    return new TerminalNode(moveToOpponent);
}

export function createSpinAttackNode() {
    return new TerminalNode(spinAttack);
}

export function createThrustAttackNode() {
    return new TerminalNode(thrustAttack);
}

export function createLeapStrikeNode() {
    return new TerminalNode(leapStrike);
}

export function createRandomChanceNode(probability = 0.5) {
    return new DecisionNodeChance(() => Math.random() > probability);
}
//#endregion
