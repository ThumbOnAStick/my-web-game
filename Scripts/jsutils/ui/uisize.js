import { UIElementConfigurations } from "../../jsuielements/ctx/uielement.js";
import { getInputManager, getResourceManager } from "./uiutil.js";

export class UISize {
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        Object.freeze(this);
    }

    /**
     * Create a new UISize instance when predefined values are insufficient.
     * @param {number} width
     * @param {number} height
     * @returns {UISize}
     */
    static from(width, height) {
        return new UISize(width, height);
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y
     * @returns {UIElementConfigurations} 
     */
    to(x, y){
        return new UIElementConfigurations(x, y, this.width, this.height, getInputManager(), getResourceManager())
    }
}

UISize.ButtonCommon = new UISize(200, 75);
UISize.Slider = new UISize(300, 10);

Object.freeze(UISize);