// oxlint-disable no-unused-vars
import { GameState } from "../jscomponents/gamestate.js";
import { CharacterManager } from "../jsmanagers/charactermanager.js";
import { GameLoopManager } from "../jsmanagers/gameloopmanager.js";
import { InputManager } from "../jsmanagers/inputmanager.js";
import { ObstacleManager } from "../jsmanagers/obstaclemanager.js";
import { TickManager } from "../jsmanagers/tickmanager.js";
import { TutorialManager } from "../jsmanagers/tutorialmanager.js";
import { VFXManager } from "../jsmanagers/vfxmanager.js";
import { CanvasScene } from "./canvasscene.js";
const labelPlayer = "Player";
const labelPC = "PC";
export class GameScene extends CanvasScene {
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {InputManager} inputManager
     * @param {TickManager} tickManager
     * @param {TutorialManager} tutorialManager
     * @param {ObstacleManager} obStacleManager
     * @param {CharacterManager} characterManager
     * @param {VFXManager} vfxManager
     * @param {GameLoopManager} gameLoopManager
     * @param {GameState} gameState The gamescene handles gamestate runtime.
     */
    constructor(ctx, characterManager, inputManager, tickManager, tutorialManager, obStacleManager, gameState, vfxManager, gameLoopManager) {
        super(ctx)
        this.inputManager = inputManager;
        this.tickManager = tickManager;
        this.characterManager = characterManager;
        this.obstacleManager = obStacleManager;
        this.gameState = gameState;
        this.tutorialManager = tutorialManager;
        this.vfxManager = vfxManager;
        this.gameLoopManager = gameLoopManager;
    }

    /**
     * 
     * @param {Number} deltaTime 
     */
    update(deltaTime) {
        super.update(deltaTime);

        this.inputManager.update();

        // Ticks update
        this.tickManager.update();

        // Check obstacle manager
        this.obstacleManager.update(this.characterManager.getCharacters());

        // Manage VFX
        this.vfxManager.update();

        // Update tutorial manager
        this.tutorialManager.update();

        // Update score, check game state
        this.gameState.updatePlayerScore(
            this.characterManager.getPlayerScore(),
            labelPlayer,
            labelPC
        );
        this.gameState.updateOpponentScore(
            this.characterManager.getOpponentScore(),
            labelPlayer,
            labelPC
        );
    }

    onEnabled(){
        console.log(`Game state difficulty: ${this.gameState.difficulty}`)
        if(this.gameState.difficulty < 1){
            this.tutorialManager.start();
        }
    }

    
}