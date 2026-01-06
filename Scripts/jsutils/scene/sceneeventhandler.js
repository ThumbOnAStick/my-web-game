import { AIController } from "../../jsai/aicontroller.js";
import { ServiceContainer } from "../../jscore/index.js";
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";
import { CanvasScene } from "../../jsscenes/canvasscene.js";
import { IScene } from "../../jsscenes/scene.js";
import { enterGameOverScene } from "./scenehelper.js";

export const gameOverEvent = "game_over";
/**@type {IScene} */
let rootScene;
/**@type {AIController} */
let aiController;

/**
 * @param {IScene} _rootScene
 * @param {AIController} [_aiController]
 */
export function initSceneEvents(_rootScene, _aiController){
    rootScene = _rootScene;
    aiController = _aiController;
    if(aiController == null){
        debugManager.popMessage("AI controller is null!!!", DebugLevel.Error)
    }
}

function _pauseAIController(){
    aiController.turnOff();
    aiController.halt();
}

function _enterGameOverScene(){
    if(rootScene == null){
        return;
    }
    enterGameOverScene(rootScene);
}

export function onGameOver(){
    debugManager.popMessage(`AI controller status: ${aiController.status}`);
    _enterGameOverScene();
    _pauseAIController();
}
