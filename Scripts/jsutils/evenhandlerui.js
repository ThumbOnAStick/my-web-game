// oxlint-disable no-unused-vars
/**
 * Event handler UI handles events emitted by UI elements.
 */
import { GlobalUIManager } from "../jsmanagers/globaluimanager.js";
import { IScene } from "../jsscenes/scene.js";
import { SCENENAMES } from "./scenenames.js";
export const changeSubtitleEvent = "change_subtitle";
export const startGameEvent = "start_game";

/**
 * @type {GlobalUIManager}
 */
export let uiManager = null;
/**
 * @type {IScene}
 */
export let rootScene = null;

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
}


/**
 * @param {GlobalUIManager} _uiManager
 * @param {IScene} _rootScene
 */
export function initialize_ui(_uiManager, _rootScene){
    uiManager = _uiManager;
    rootScene = _rootScene;
}
