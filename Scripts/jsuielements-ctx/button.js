// oxlint-disable no-unused-vars
// Button.js
// Handles button rendering and interaction

import { InputManager } from "../jsmanagers/inputmanager.js";
import { COLORS } from "../jsutils/colors.js";
import { GlobalFonts } from "../jsutils/globalfont.js";
import { UIElementCanvas, UIElementConfigurations } from "./uielement.js";

export class ButtonText extends UIElementCanvas {

  /**
   * 
   * @param {String} translationKey 
   * @param {function} onClick
   * @param {UIElementConfigurations} config 
   */
  constructor(translationKey, onClick, config) {
    super(config);
    this.isHovered = false;
    this.onClick = onClick;
    this.translationKey = translationKey;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mousedown", this.handleMouseDown);
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

  handleMouseMove() {
    if (typeof this.config.isMouseWithin !== "function") return;
    const hovered = this.config.isMouseWithin();
    if (hovered === this.isHovered) return;
    this.isHovered = hovered;
  }

  handleMouseDown(){
    if(this.config.isMouseWithin()){
      this.onClick();
    }
  }

  dispose() {
    super.dispose();
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mousedown", this.handleMouseDown);
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
