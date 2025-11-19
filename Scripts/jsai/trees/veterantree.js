import * as Nodes from "../library/ainodes.js";

export function buildVeteranAITree() {
    try {
        // Root: Danger Check
        let root = Nodes.createDangerCheckNode();

        // Branch 1 (True): Danger Check 2
        let dangerCheck2 = Nodes.createDangerCheckNode2();
        root.appendDNode(dangerCheck2);
            dangerCheck2.appendTNode(Nodes.createHeavySwingNode()); // Parry
            dangerCheck2.appendTNode(Nodes.createJumpNode()); // Jump

        // Branch 2 (False): Veteran Distance Check 1
        let distCheck1 = Nodes.createHeavyDistanceCheckNode();
        root.appendDNode(distCheck1);
        
        // True: Heavy Attack Choice
        distCheck1.appendDNode(buildVeteranHeavyAttackChoice());
        
        // False: Veteran Distance Check 2
        distCheck1.appendDNode(buildVeteranDistanceCheck2());

        return root;
    } catch (e) {
        console.error(e);
    }
}

function buildVeteranHeavyAttackChoice() {
    let choice1 = Nodes.createRandomChanceNode(0.33);
    
    // True: Spin Attack
    choice1.appendTNode(Nodes.createSpinAttackNode());
    choice1.appendDNode(Nodes.createEmptyNode()); // Dummy DNode for True branch
    
    // False: Further Decision
    let choice2 = Nodes.createRandomChanceNode(0.5);
    choice1.appendDNode(choice2); // dNodes[1]
    
    // Choice 2: Leap Strike vs Heavy Swing
    choice2.appendTNode(Nodes.createLeapStrikeNode()); // True
    choice2.appendTNode(Nodes.createHeavySwingNode()); // False
    
    return choice1;
}

function buildVeteranDistanceCheck2() {
    let check = Nodes.createLightDistanceCheckNode();
    
    // True: Light Attack Choice
    check.appendDNode(buildVeteranLightAttackChoice());
    check.appendTNode(Nodes.createEmptyTerminalNode()); // Dummy TNode for True branch
    
    // False: Move To Opponent
    check.appendTNode(Nodes.createMoveToOpponentNode());
    
    return check;
}

function buildVeteranLightAttackChoice() {
    let choice = Nodes.createRandomChanceNode(0.5);
    choice.appendTNode(Nodes.createThrustAttackNode()); // True
    choice.appendTNode(Nodes.createLightSwingNode()); // False
    return choice;
}
