import { Controller } from "../jscomponents/controller.js";
import { Tutorial } from "../jscomponents/tutorial.js";
import { gameEventManager } from "./eventmanager.js";
import { changeSubtitleEvent } from "../jsutils/evenhandlerui.js";
import * as DecisionTreeHelperTutor from '../jsutils/decisiontreehelpertutor.js';

export class TutorialManager extends Controller {
    /**
     * @param {import("../jscomponents/gamestate.js").GameState} gameState 
     * @param {import("./resourcemanager.js").ResourceManager} resourceManager
     */
    constructor(gameState, resourceManager) {
        super();
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        /** @type {Tutorial[]} */
        this.tutorials = [];
        this.currentTutorialIndex = 0;
        this.aiController = null;
    }

    setAIController(aiController) {
        this.aiController = aiController;
    }

    /**
     * @param {Tutorial} tutorial 
     */
    append(tutorial) {
        this.tutorials.push(tutorial);
    }

    setupCurrentTutorial() {
        if (this.currentTutorialIndex < this.tutorials.length) {
            const currentTutorial = this.tutorials[this.currentTutorialIndex];
            currentTutorial.onComplete = () => this.advanceTutorial();
            currentTutorial.start();
            console.log(`Starting tutorial: ${currentTutorial.constructor.name}`);
            
            if (currentTutorial.subtitle) {
                gameEventManager.emit(changeSubtitleEvent, currentTutorial.subtitle);
            }

            if (this.aiController) {
                if (currentTutorial.constructor.name === 'ParryTutorial') {
                    this.aiController.rootNode = DecisionTreeHelperTutor.buildLightSwingTree();
                } else if (currentTutorial.constructor.name === 'ParryHeavyTutorial') {
                    this.aiController.rootNode = DecisionTreeHelperTutor.buildHeavySwingTree();
                } else {
                    this.aiController.rootNode = DecisionTreeHelperTutor.buildDoNothingTree();
                }
            }
        } else {
            console.log("All tutorials completed!");
            gameEventManager.emit(changeSubtitleEvent, "");
            const playerLabel = "Player";
            this.gameState.endGame(playerLabel);
        }
    }

    advanceTutorial() {
        console.log(`Completed tutorial: ${this.tutorials[this.currentTutorialIndex].constructor.name}`);
        this.currentTutorialIndex++;
        this.setupCurrentTutorial();
    }

    start() {
        this.turnOn();
        this.currentTutorialIndex = 0;
        this.setupCurrentTutorial();
    }

    stop() {
        this.turnOff();
        if (this.currentTutorialIndex < this.tutorials.length) {
            this.tutorials[this.currentTutorialIndex].unbindEvents();
        }
    }

    update() {
        if (this.gameState.difficulty !== 0) {
            return;
        }
        
        if (this.status !== "RUNNING") {
            return;
        }

    }
}
