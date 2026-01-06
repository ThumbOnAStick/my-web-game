// oxlint-disable no-unused-vars
/**
 * Event handler UI handles events emitted by UI elements.
 * 
 * This module uses a service container for dependency injection,
 * making it more testable and reusable.
 */
import { AIController } from "../../jsai/aicontroller.js";
import { GameState } from "../../jscomponents/gamestate.js";
import { ServiceContainer, ServiceKeys } from "../../jscore/servicecontainer.js";
import { CharacterManager } from "../../jsmanagers/charactermanager.js";
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";
import { TickManager } from "../../jsmanagers/tickmanager.js";
import { IScene } from "../../jsscenes/scene.js";
import { SCENENAMES } from "../scene/scenenames.js";

// Event name constants
export const changeSubtitleEvent = "change_subtitle";
export const startGameEvent = "start_game";
export const restartGameEvent = "restart_game";
export const changeDifficultyEvent = "change_difficulty";
export const translationChanged = "translation_changed";
export const endGame = "end_game";

/**
 * @type {ServiceContainer|null}
 */
let services = null;

/**
 * @type {IScene|null}
 */
let rootScene = null;

/**
 * Get the UI manager from service container
 * @returns {import('../../jsmanagers/globaluimanager.js').GlobalUIManager|null}
 */
function getUIManager() {
    return services?.tryGet(ServiceKeys.RENDER)?.uiManager ?? null;
}

/**
 * Get the game state from service container
 * @returns {import('../../jscomponents/gamestate.js').GameState|null}
 */
function getGameState() {
    return services?.tryGet(ServiceKeys.GAME_STATE) ?? null;
}

/**
 * @param {String} data
 */
export function changeSubtitle(data) {
    const uiManager = getUIManager();
    if(uiManager){
        uiManager.changeSubtitle(data);
    }
}

export function startGame(){
    if (rootScene) {
        rootScene.removeSubScene(SCENENAMES.menu);
        rootScene.enableSubScene(SCENENAMES.game); 
        const tickManager = getTickManager();
        if(tickManager == null){
            return;
        }
        tickManager.unpause();
         
    }
}

/**
 * @returns {TickManager}
 */
function getTickManager(){
    return services.get(ServiceKeys.TIME);
}


/**
 * 
 * @returns {CharacterManager}
 */
function getCharacterManager(){
    return services.get(ServiceKeys.ENTITIES)
}

/**
 * 
 * @returns {AIController}
 */
function getAIController(){
    return services.get(ServiceKeys.AI);
}


export function restartGame(){
    rootScene.disableSubScene(SCENENAMES.gameOver);
    var characterManager = getCharacterManager();
    if(characterManager == null){
        debugManager.popMessage("No character manager found", DebugLevel.Error);     
        return;
    }
    characterManager.resetCharacters();
    var aicontroller = getAIController();
    if(aicontroller == null){
        debugManager.popMessage("No AI controller found", DebugLevel.Error);     
        return;
    }
    aicontroller.turnOn();
}
 

export function changeDifficulty(data){
    const gameState = getGameState();
    if (gameState) {
        gameState.setDifficulty(data);
        console.log("Current difficulty: " + data);
    }
}


/**
 * Initialize UI event handler with service container
 * @param {ServiceContainer} _services - Service container with registered services
 * @param {IScene} _rootScene - Root scene for scene management
 */
export function initialize_ui(_services, _rootScene){
    services = _services;
    rootScene = _rootScene;
}

/**
 * Legacy initialization - deprecated, use initialize_ui with ServiceContainer
 * @deprecated Use initialize_ui(services, rootScene) instead
 * @param {import('../../jsmanagers/globaluimanager.js').GlobalUIManager} _uiManager
 * @param {IScene} _rootScene
 * @param {import('../../jscomponents/gamestate.js').GameState} _gamestate
 */
export function initialize_ui_legacy(_uiManager, _rootScene, _gamestate){
    // Create a minimal service container for legacy support
    const legacyServices = new ServiceContainer();
    legacyServices.register(ServiceKeys.GAME_STATE, _gamestate);
    // Store uiManager in a wrapper since RENDER expects RenderManager
    legacyServices.register(ServiceKeys.RENDER, { uiManager: _uiManager });
    
    services = legacyServices;
    rootScene = _rootScene;
}
