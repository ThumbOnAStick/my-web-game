// oxlint-disable no-unused-vars
import { InputManager } from "../jsmanagers/inputmanager.js";
import { ResourceManager } from "../jsmanagers/resourcemanager.js";
import { ButtonText } from "../jsuielements-ctx/button.js";
import { makeCenteredUIConfig } from "./uiconfigurationhelper.js";
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
 * @returns {ButtonText}
 * @param {number} centerX
 * @param {number} centerY
 * @param {UISize} uiSize
 * @param {string} translationKey
 * @param {function} onClick
 */
export function createTextButtonCentered(centerX, centerY, uiSize, translationKey, onClick){
    if(!initialized){
        throw new Error("ButtonUtil not initialized; call initialize() first.")
    }
    const config = makeCenteredUIConfig(centerX, centerY, uiSize.width, uiSize.height, inputManagerCache, resourceManagerCache);
    const result = new ButtonText(translationKey, onClick, config);
    return result;
}