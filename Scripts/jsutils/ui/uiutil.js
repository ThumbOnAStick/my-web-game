// oxlint-disable no-unused-vars
import { Character } from "../../jsgameobjects/character.js";
import { debugManager } from "../../jsmanagers/debugmanager.js";
import { InputManager } from "../../jsmanagers/inputmanager.js";
import { ResourceManager } from "../../jsmanagers/resourcemanager.js";
import { ButtonText } from "../../jsuielements/ctx/button.js";
import { Indicator } from "../../jsuielements/ctx/indicator.js";
import { ScoreBar } from "../../jsuielements/ctx/scorebar.js";
import { SnappedSlider } from "../../jsuielements/ctx/snappedslider.js";
import { UIElementConfigurations } from "../../jsuielements/ctx/uielement.js";
import { startButtonYOffset, startSnappedSliderYOffset } from "./uioffsets.js";
import { UISize } from "./uisize.js";

const SCOREBAROFFSETX = 50;
const SCOREBAROFFSETY = 50;

/**@type {InputManager} */
let inputManagerCache = null;
/**@type {ResourceManager} */
let resourceManagerCache = null;
let initialized = false;
/**@type {CanvasRenderingContext2D} */
let ctxCache = null;

/**
 * !Must Be Called!
 * @param {InputManager} inputmanager
 * @param {ResourceManager} resourceManager
 * @param {CanvasRenderingContext2D} ctx
 */
export function setupUIUtil(inputmanager, resourceManager, ctx) {
    inputManagerCache = inputmanager;
    resourceManagerCache = resourceManager;
    initialized = true;
    ctxCache = ctx;
}

/**
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} width
 * @param {number} height
 * @returns {UIElementConfigurations}
 * @param {InputManager} inputManager
 * @param {ResourceManager} resourceManager
 */
export function makeCenteredUIConfig(centerX, centerY, width, height, inputManager, resourceManager) {
    const realX = centerX - width / 2;
    const realY = centerY - height / 2;
    let config = new UIElementConfigurations(realX, realY, width, height, inputManager, resourceManager);
    return config
}

/**
 * @returns {ButtonText}
 * @param {number} centerX
 * @param {number} centerY
 * @param {UISize} uiSize
 * @param {string} translationKey
 * @param {function} onClick
 */
export function createTextButtonCentered(centerX, centerY, uiSize, translationKey, onClick) {
    if (!initialized) {
        const message = "UIUtil not initialized; call initialize() first.";
        debugManager.popMessage(message);
        throw new Error(message)
    }
    const config = makeCenteredUIConfig(centerX,
        centerY + startButtonYOffset,
        uiSize.width,
        uiSize.height,
        inputManagerCache,
        resourceManagerCache);
    const result = new ButtonText(translationKey, onClick, config, ctxCache);
    return result;
}

/**
 * @returns {SnappedSlider}
 * @param {number} centerX
 * @param {number} centerY
 * @param {UISize} uiSize
 * @param {string[]} labels
 * @param {CanvasRenderingContext2D} ctx
 * @param {function} onValueChanged
 */
export function createSliderCentered(centerX, centerY, uiSize, labels, ctx, onValueChanged) {
    if (!initialized) {
        throw new Error("UIUtil not initialized; call initialize() first.")
    }
    const config = makeCenteredUIConfig(centerX,
        centerY + startSnappedSliderYOffset,
        uiSize.width,
        uiSize.height,
        inputManagerCache,
        resourceManagerCache)

    return new SnappedSlider(labels, ctx, config, onValueChanged);
}

/**
 * 
 * @returns {ScoreBar}
 */
export function createTopLeftScoreBar() {
    const position = getTopLeft();
    const config = new UIElementConfigurations(position.x,
        position.y,
        UISize.ScoreBar.width,
        UISize.ScoreBar.height,
        inputManagerCache,
        resourceManagerCache);
    return new ScoreBar(config, ctxCache);
}
/**
 * @returns {ScoreBar}
 */
export function createTopRightScoreBar() {
    const position = getTopRight(UISize.ScoreBar.width);
    const config = new UIElementConfigurations(position.x,
        position.y,
        UISize.ScoreBar.width,
        UISize.ScoreBar.height,
        inputManagerCache,
        resourceManagerCache);
    return new ScoreBar(config, ctxCache);
}

export function createIndicator(offsetY = 50) {
    const config = UISize.Indicator.to(0, 0);
    return new Indicator(config, ctxCache, offsetY);
}

export function getInputManager() {
    return inputManagerCache;
}

export function getResourceManager() {
    return resourceManagerCache;
}

function getTopLeft() {
    return { x: SCOREBAROFFSETX, y: SCOREBAROFFSETY }
}

/**
 * 
 * @param {Number} height 
 * @returns 
 */
function getBottomLeft(height) {
    return { x: SCOREBAROFFSETX, y: ctxCache.canvas.height - height - SCOREBAROFFSETY}
}

/**
 * 
 * @param {Number} width 
 * @returns 
 */
function getTopRight(width) {
    return { x: ctxCache.canvas.width - width - SCOREBAROFFSETX, y: SCOREBAROFFSETY }
}

/**
 * 
 * @param {Number} width 
 * @param {Number} height 
 * @returns 
 */
function getBottomRight(width, height) {
    return { x: ctxCache.canvas.width - width - SCOREBAROFFSETX, y: ctxCache.canvas.height - height - SCOREBAROFFSETY }
}