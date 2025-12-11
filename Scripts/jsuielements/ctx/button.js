// oxlint-disable no-unused-vars
// Button.js
// Handles button rendering and interaction

import { debugManager } from "../../jsmanagers/debugmanager.js";
import { InputManager } from "../../jsmanagers/inputmanager.js";
import { COLORS } from "../../jsutils/ui/uicolors.js";
import { GlobalFonts } from "../../jsutils/ui/uiglobalfont.js";
import { UIElementCanvas, UIElementConfigurations } from "./uielement.js";

export class ButtonText extends UIElementCanvas {

  /**
   * 
   * @param {String} translationKey 
   * @param {function} onClick
   * @param {UIElementConfigurations} config 
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(translationKey, onClick, config, ctx) {
    super(config, ctx);
    this.isHovered = false;
    this.onClick = onClick;
    this.translationKey = translationKey;
    this.label = "";
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mousedown", this.handleMouseDown);
  }

  /**
   * @returns {String}
   */
  getTranslation(){
    return this.config.resourceManager.getTranslation(this.translationKey);
  }

  changeTranslations(){
    super.changeTranslations();
    this.label = this.getTranslation();
  }

  init(){
    super.init();
    debugManager.popMessage("Button init");
    this.label = this.getTranslation();
  }

  draw() {
    this.ctx.save();
    // Draw frame
    this.ctx.strokeStyle = this.isHovered ? COLORS.secondary : COLORS.primary;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height);

    // Draw text
    this.ctx.font = GlobalFonts.small;
    this.ctx.fillStyle = this.isHovered ? COLORS.secondary : COLORS.primary;
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.label, this.config.x + this.config.width / 2, this.config.y + this.config.height / 2, this.config.width);
    this.ctx.restore();
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

  /**
   * Update button text
   * @param {string} translationKey - New text
   */
  setTranslationKey(translationKey) {
    this.translationKey = translationKey;
  }
}
