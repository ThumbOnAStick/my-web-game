// oxlint-disable no-unused-vars
/**
 * Event handler UI handles events emitted by UI elements.
 * Depends on scene helper for scene operations
 */
import { GameState } from "../../jscomponents/gamestate.js";
import { GlobalUIManager } from "../../jsmanagers/globaluimanager.js";
import { GameScene } from "../../jsscenes/gamescene.js";
import { IScene } from "../../jsscenes/scene.js";
import { SCENENAMES } from "../scene/scenenames.js";
export const changeSubtitleEvent = "change_subtitle";
export const startGameEvent = "start_game";
export const gameOverEvent = "game_over";
export const changeDifficultyEvent = "change_difficulty";

/**
 * @type {GlobalUIManager}
 */
 let uiManager = null;
/**
 * @type {IScene}
 */
let rootScene = null;
/**
 * @type {GameState}
 */
let gameState = null;

/**
 * @param {String} data
 */
export function changeSubtitle(data) {
    if(uiManager){
        uiManager.changeSubtitle(data);
    }
}

export function startGame(){
    rootScene.removeSubScene(SCENENAMES.menu);
    rootScene.enableSubScene(SCENENAMES.game); 
    console.log("Enable Game Scene");
}

export function gameOver(data){
    
}

export function changeDifficulty(data){
    gameState.setDifficulty(data);
    console.log("Current difficulty: " + data)
}

/**
 * @param {GlobalUIManager} _uiManager
 * @param {IScene} _rootScene
 * @param {GameState} _gamestate
 */
export function initialize_ui(_uiManager, _rootScene, _gamestate){
    uiManager = _uiManager;
    rootScene = _rootScene;
    gameState = _gamestate;
}
