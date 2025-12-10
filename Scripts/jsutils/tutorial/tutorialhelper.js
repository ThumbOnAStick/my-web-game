import { TutorialManager } from "../../jsmanagers/tutorialmanager.js";
import { MovementTutorial } from "../../jscomponents/tutorials/movementtutorial.js";
import { JumpTutorial } from "../../jscomponents/tutorials/jumptutorial.js";
import { LightAttackTutorial } from "../../jscomponents/tutorials/lightattacktutorial.js";
import { HeavyAttackTutorial } from "../../jscomponents/tutorials/heavyattacktutorial.js";
import { ParryTutorial } from "../../jscomponents/tutorials/parrytutorial.js";
import { ParryHeavyTutorial } from "../../jscomponents/tutorials/parryheavytutorial.js";
import { ComboTutorial } from "../../jscomponents/tutorials/combotutorial.js";

/**
 * @param {TutorialManager} tutorialManager 
 */
export function setupTutorials(tutorialManager) {
    tutorialManager.append(new MovementTutorial());
    tutorialManager.append(new JumpTutorial());
    tutorialManager.append(new LightAttackTutorial());
    tutorialManager.append(new HeavyAttackTutorial());
    tutorialManager.append(new ParryTutorial());
    tutorialManager.append(new ParryHeavyTutorial());
    tutorialManager.append(new ComboTutorial());
}
