import * as Nodes from "../library/ainodes.js";

export function buildNoviceAITree() {
    try {
        // Root: Danger Check (is opponent charging?)
        let root = Nodes.createDangerCheckNode();

        // Branch 1 (True): Danger Check 2 (is it light attack?)
        let dangerCheck2 = Nodes.createDangerCheckNode2();
        root.appendDNode(dangerCheck2);

            // Danger Check 2 True: Parry (Heavy Swing)
            dangerCheck2.appendTNode(Nodes.createHeavySwingNode());
            // Danger Check 2 False: Jump
            dangerCheck2.appendTNode(Nodes.createJumpNode());

        // Branch 2 (False): Distance Check 1 (Heavy Range)
        let distanceCheck1 = Nodes.createHeavyDistanceCheckNode();
        root.appendDNode(distanceCheck1);

            // Distance Check 1 True: Heavy Swing
            // Note: Original logic had emptyNode as dNode[0] and heavyswingNode as tNode[0]
            // DecisionNodeChance executes dNodes[0] then tNodes[0] on True.
            distanceCheck1.appendDNode(Nodes.createEmptyNode());
            distanceCheck1.appendTNode(Nodes.createHeavySwingNode());
            
            // Distance Check 1 False: Distance Check 2
            distanceCheck1.appendDNode(buildDistanceCheckNode2());
            
        return root;
    } catch (e) {
        console.error(e);
    }
}

function buildDistanceCheckNode2() {
    let node = Nodes.createLightDistanceCheckNode();
    // True: Light Swing
    node.appendTNode(Nodes.createLightSwingNode());
    // False: Move To Opponent
    node.appendTNode(Nodes.createMoveToOpponentNode());
    return node;
}
