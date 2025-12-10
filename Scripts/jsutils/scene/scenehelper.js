// oxlint-disable no-unused-vars
import { GameManager } from "../../jsmanagers/gamemanager.js";
import { CanvasScene } from "../../jsscenes/canvasscene.js";
import { GameScene } from "../../jsscenes/gamescene.js";
import { MenuScene } from "../../jsscenes/menuscene.js";
import { IScene } from "../../jsscenes/scene.js";
import { SCENENAMES } from "./scenenames.js";

/**
 * 

 * @param {GameManager} gameManager
 * @returns 
 */
export function buildDefaultRootScene(gameManager) {
    const ctx = gameManager.ctx;
    let rootScene = new CanvasScene(ctx);
    addMenu(rootScene, ctx);
    addGame(rootScene, gameManager, ctx)
    return rootScene
}

/**
 * 
 * @param {IScene} rootScene 
 * @param {CanvasRenderingContext2D} ctx 
 */
export function addMenu(rootScene, ctx) {
    rootScene.addSubScene(SCENENAMES.menu, new MenuScene(ctx));
}

/**
 * 
 * @param {IScene} rootScene 
 * @param {GameManager} gameManager 
//  * @param {CanvasRenderingContext2D} ctx
 */
export function addGame(rootScene, gameManager, ctx) {
    rootScene.addSubScene(SCENENAMES.game, new GameScene(ctx,
        gameManager.characterManager,
        gameManager.inputManager,
        gameManager.tickManager,
        gameManager.tutorialManager,
        gameManager.obstacleManager,
        gameManager.gameState,
        gameManager.vfxManager,
        gameManager.gameLoopManager,
        gameManager.aiController
    ))
    rootScene.disableSubScene(SCENENAMES.game)
}


