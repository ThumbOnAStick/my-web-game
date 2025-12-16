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
    this._isHovered = false;
    this._onClick = onClick;
    this._translationKey = translationKey;
    this._label = "";
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mousedown", this.handleMouseDown);
  }

  /**
   * @returns {String}
   */
  getTranslation(){
    return this.config.resourceManager.getTranslation(this._translationKey);
  }

  onTranslationsChanged(){
    super.onTranslationsChanged();
    this._label = this.getTranslation();
    debugManager.popMessage(`Try to change translations, new language: 
      ${this.config.resourceManager.getCurrentLanguage()}`);
  }

  init(){
    super.init();
    this._label = this.getTranslation();
  }

  draw() {
    this.ctx.save();
    // Draw frame
    this.ctx.strokeStyle = this._isHovered ? COLORS.secondary : COLORS.primary;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.config.x, this.config.y, this.config.width, this.config.height);

    // Draw text
    this.ctx.font = GlobalFonts.small;
    this.ctx.fillStyle = this._isHovered ? COLORS.secondary : COLORS.primary;
    this.ctx.textAlign = "center";
    this.ctx.fillText(this._label, this.config.x + this.config.width / 2, this.config.y + this.config.height / 2, this.config.width);
    this.ctx.restore();
  }

  handleMouseMove() {
    if (typeof this.config.isMouseWithin !== "function") return;
    const hovered = this.config.isMouseWithin();
    if (hovered === this._isHovered) return;
    this._isHovered = hovered;
  }

  handleMouseDown(){
    if(this.config.isMouseWithin()){
      this._onClick();
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
    this._translationKey = translationKey;
  }
}
