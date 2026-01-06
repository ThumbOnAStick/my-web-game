// oxlint-disable no-unused-vars
import { GameManager } from "../../jsmanagers/gamemanager.js";
import { CanvasScene } from "../../jsscenes/canvasscene.js";
import { GameScene } from "../../jsscenes/gamescene.js";
import { MenuScene } from "../../jsscenes/menuscene.js";
import { IScene } from "../../jsscenes/scene.js";
import { ServiceContainer } from "../../jscore/servicecontainer.js";
import { SCENENAMES } from "./scenenames.js";
import { GameOverScene } from "../../jsscenes/gamoveruiscene.js";
import { initSceneEvents } from "./sceneeventhandler.js";
import { debugManager } from "../../jsmanagers/debugmanager.js";

/**
 * Build the default root scene hierarchy
 * @param {GameManager} gameManager
 * @returns {CanvasScene}
 */
export function buildDefaultRootScene(gameManager) {
    const ctx = gameManager.ctx;
    let rootScene = new CanvasScene(ctx);
    addMenu(rootScene, ctx);
    addGame(rootScene, gameManager.services, ctx);
    addGameOverScene(rootScene, gameManager.services, ctx);
    // initSceneEvents is now called in EventHandlers.initialize
    return rootScene;
}

/**
 * Add menu scene to root
 * @param {IScene} rootScene 
 * @param {CanvasRenderingContext2D} ctx 
 */
export function addMenu(rootScene, ctx) {
    var menusub = new MenuScene(ctx);
    rootScene.addSubScene(SCENENAMES.menu, menusub);
}

/**
 * Add game scene to root using service container
 * @param {IScene} rootScene 
 * @param {ServiceContainer} services - Service container with all game services
 * @param {CanvasRenderingContext2D} ctx
 */
export function addGame(rootScene, services, ctx) {
    rootScene.addSubScene(SCENENAMES.game, new GameScene(ctx, services));
    rootScene.disableSubScene(SCENENAMES.game);
}

/**
 * Enter game over scene
 * @param {IScene} rootScene 
 * @param {ServiceContainer} services - Service container with all game services
 * @param {CanvasRenderingContext2D} ctx
 */
export function addGameOverScene(rootScene, services, ctx){
    rootScene.addSubScene(SCENENAMES.gameOver, new GameOverScene(ctx, services));
    rootScene.disableSubScene(SCENENAMES.gameOver);
}


/**
 * Enter game over scene
 * @param {IScene} rootScene 
 */
export function enterGameOverScene(rootScene){
    rootScene.enableSubScene(SCENENAMES.gameOver);
}

/**
 * 
 * @param {IScene} rootScene 
 */
export function leaveGameOverScene(rootScene){
    rootScene.removeSubScene(SCENENAMES.gameOver);
}


