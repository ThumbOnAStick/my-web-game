// oxlint-disable no-unused-vars
import { GameManager } from "../../jsmanagers/gamemanager.js";
import { CanvasScene } from "../../jsscenes/canvasscene.js";
import { GameScene } from "../../jsscenes/gamescene.js";
import { MenuScene } from "../../jsscenes/menuscene.js";
import { IScene } from "../../jsscenes/scene.js";
import { ServiceContainer } from "../../jscore/servicecontainer.js";
import { SCENENAMES } from "./scenenames.js";

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
    return rootScene;
}

/**
 * Add menu scene to root
 * @param {IScene} rootScene 
 * @param {CanvasRenderingContext2D} ctx 
 */
export function addMenu(rootScene, ctx) {
    rootScene.addSubScene(SCENENAMES.menu, new MenuScene(ctx));
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


