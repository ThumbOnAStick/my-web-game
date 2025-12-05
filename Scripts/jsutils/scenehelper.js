// oxlint-disable no-unused-vars
import { GameManager } from "../jsmanagers/gamemanager.js";
import { CanvasScene } from "../jsscenes/canvasscene.js";
import { GameScene } from "../jsscenes/gamescene.js";
import { MenuScene } from "../jsscenes/menuscene.js";
import { SCENENAMES } from "./scenenames.js";

/**
 * 

 * @param {GameManager} gameManager
 * @returns 
 */
export function buildDefaultRootScene(gameManager){
    const ctx = gameManager.ctx;
    let rootScene = new CanvasScene(ctx);
    rootScene.addSubScene(SCENENAMES.menu, new MenuScene(ctx));
    rootScene.addSubScene(SCENENAMES.game, new GameScene(ctx, 
        gameManager.characterManager,
        gameManager.inputManager,
        gameManager.tickManager,
        gameManager.tutorialManager,
        gameManager.obstacleManager,
        gameManager.gameState,
        gameManager.vfxManager,
        gameManager.gameLoopManager
    ))
    rootScene.disableSubScene(SCENENAMES.game)
    return rootScene
}