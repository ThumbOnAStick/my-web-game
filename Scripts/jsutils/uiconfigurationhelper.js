import { UIElementConfigurations } from "../jsuielements-ctx/uielement.js";

/**
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} width
 * @param {number} height
 * @returns {UIElementConfigurations}
 * @param {import("../jsmanagers/inputmanager").InputManager} inputManager
 * @param {import("../jsmanagers/resourcemanager").ResourceManager} resourceManager
 */
export function makeCenteredUIConfig(centerX, centerY, width, height, inputManager, resourceManager){
    const realX = centerX - width/2;
    const realY = centerY - height/2;
    let config = new UIElementConfigurations(realX, realY, width, height, inputManager, resourceManager);
    return config
}