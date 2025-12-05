// oxlint-disable no-unused-vars
// Button.js
// Handles button rendering and interaction

import { InputManager } from "../jsmanagers/inputmanager.js";
import { COLORS } from "../jsutils/colors.js";
import { GlobalFonts } from "../jsutils/globalfont.js";
import { UIElement, UIElementConfigurations } from "./uielement.js";

export class ButtonText extends UIElement {

  /**
   * 
   * @param {String} translationKey 
   * @param {UIElementConfigurations} config 
   */
  constructor(translationKey, config) {
    super(config);
    this.isHovered = false;
    this.translationKey = translationKey;
  }

  /**
   * Draw the button 
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  draw(ctx) {
    ctx.save();
    // Draw frame
    ctx.strokeStyle = this.isHovered ? COLORS.secondary : COLORS.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height);

    // Draw text
    ctx.font = GlobalFonts.small;
    ctx.fillStyle = this.isHovered ? COLORS.secondary : COLORS.primary;
    ctx.textAlign = "center";
    ctx.fillText(this.getText(), this.config.x + this.config.width / 2, this.config.y + this.config.height / 2, this.config.width);
    ctx.restore();
  }

  update(){
    
  }


  getText(){
    return this.config.resourceManager.getTranslation(this.translationKey)
  }

  /**
   * Update button text
   * @param {string} translationKey - New text
   */
  setTranslationKey(translationKey) {
    this.translationKey = translationKey;
  }
}
