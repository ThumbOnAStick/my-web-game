import { Controller } from "../jscomponents/controller.js";
import { Tutorial } from "../jscomponents/tutorial.js";
import { gameEventManager } from "./eventmanager.js";
import { changeSubtitleEvent } from "../jsutils/ui/uieventhandler.js";
import * as DecisionTreeHelperTutor from '../jsutils/ai/decisiontreehelpertutor.js';

export class TutorialManager extends Controller {
    /**
     * @param {import("../jscomponents/gamestate.js").GameState} gameState 
     * @param {import("./resourcemanager.js").ResourceManager} resourceManager
     * @param {import("./eventmanager.js").EventManager} [eventManager] - Optional event manager (defaults to singleton)
     */
    constructor(gameState, resourceManager, eventManager = null) {
        super();
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        /** @type {Tutorial[]} */
        this.tutorials = [];
        this.currentTutorialIndex = 0;
        this.aiController = null;
        /** @type {import("./eventmanager.js").EventManager} */
        this._eventManager = eventManager || gameEventManager;
    }

    /**
     * Get the event manager
     * @returns {import("./eventmanager.js").EventManager}
     */
    get eventManager() {
        return this._eventManager;
    }

    setAIController(aiController) {
        this.aiController = aiController;
    }

    /**
     * @param {Tutorial} tutorial 
     */
    append(tutorial) {
        // Inject the same event manager into the tutorial
        tutorial.setEventManager(this._eventManager);
        this.tutorials.push(tutorial);
    }

    setupCurrentTutorial() {
        if (this.currentTutorialIndex < this.tutorials.length) {
            const currentTutorial = this.tutorials[this.currentTutorialIndex];
            currentTutorial.onComplete = () => this.advanceTutorial();
            currentTutorial.start();
            console.log(`Starting tutorial: ${currentTutorial.constructor.name}`);
            
            if (currentTutorial.subtitle) {
                this.eventManager.emit(changeSubtitleEvent, currentTutorial.subtitle);
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
            this.eventManager.emit(changeSubtitleEvent, "");
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
        console.log("Try to start tutorial");
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
