import { ServiceContainer } from "../../jscore/index.js";
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";
import { IScene } from "../../jsscenes/scene.js";
import { enterGameOverScene } from "./scenehelper.js";

export const gameOverEvent = "game_over";

let rootScene;

export function initSceneEvents(_rootScene){
    rootScene = _rootScene;
}

export function onGameOver(){
    if(rootScene == null){
        debugManager.popMessage("Root scene not found in sceneeventhandler!", DebugLevel.Error);
        return;
    }
    enterGameOverScene(rootScene);
}