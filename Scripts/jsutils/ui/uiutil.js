// oxlint-disable no-unused-vars
import { InputManager } from "../../jsmanagers/inputmanager.js";
import { ResourceManager } from "../../jsmanagers/resourcemanager.js";
import { ButtonText } from "../../jsuielements/ctx/button.js";
import { SnappedSlider } from "../../jsuielements/ctx/snappedslider.js";
import { UIElementConfigurations } from "../../jsuielements/ctx/uielement.js";
import { startButtonYOffset, startSnappedSliderYOffset } from "./uioffsets.js";
import { UISize } from "./uisize.js";

/**@type {InputManager} */
let inputManagerCache = null;
/**@type {ResourceManager} */
let resourceManagerCache = null;
let initialized = false;

/**
 * !Must Be Called!
 * @param {InputManager} inputmanager
 * @param {ResourceManager} resourceManager
 */
export function setupUIUtil(inputmanager, resourceManager){
    inputManagerCache = inputmanager;
    resourceManagerCache = resourceManager;
    initialized = true;
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
export function makeCenteredUIConfig(centerX, centerY, width, height, inputManager, resourceManager){
    const realX = centerX - width/2;
    const realY = centerY - height/2;
    let config = new UIElementConfigurations(realX, realY, width, height, inputManager, resourceManager);
    return config
}

/**
 * @returns {ButtonText}
 * @param {number} centerX
 * @param {number} centerY
 * @param {UISize} uiSize
 * @param {string} translationKey
 * @param {CanvasRenderingContext2D} ctx
 * @param {function} onClick
 */
export function createTextButtonCentered(centerX, centerY, uiSize, translationKey, ctx, onClick){
    if(!initialized){
        throw new Error("UIUtil not initialized; call initialize() first.")
    }
    const config = makeCenteredUIConfig(centerX, 
        centerY + startButtonYOffset, 
        uiSize.width, 
        uiSize.height,
        inputManagerCache, 
        resourceManagerCache);
    const result = new ButtonText(translationKey, onClick, config, ctx);
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
export function createSliderCentered(centerX, centerY, uiSize, labels, ctx, onValueChanged){
        if(!initialized){
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

export function getInputManager(){
    return inputManagerCache;
}

export function getResourceManager(){
    return resourceManagerCache;
}