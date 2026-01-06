// oxlint-disable no-unused-vars
// Indicator.js
// Handles indicator rendering for characters

import { Character } from "../../jsgameobjects/character.js";
import { COLORS } from "../../jsutils/ui/uicolors.js";
import { SwingType } from "../../jscomponents/charactercombatstate.js";
import { UIElementCanvas, UIElementConfigurations } from "./uielement.js";
import { DebugLevel, debugManager } from "../../jsmanagers/debugmanager.js";


export class Indicator extends UIElementCanvas {
  /**@type  {Character} */
  #character;

  /**
   * @param {UIElementConfigurations} config 
   * @param {number} offsetY - Distance above character
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(config, ctx, offsetY = 50) {
    super(config, ctx);
    this.triangleSize = config.height;
    this.offsetY = offsetY;
  }

  /**
   * 
   * @param {Character} character 
   */
  setupIndicator(character) {
    this.#character = character;
  }

  /**
    * @param {CanvasRenderingContext2D} ctx
     * @param {any} color
     * @param {number} centerX
     * @param {number} topY
     */
  drawTriangle(ctx, color, centerX, topY) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, topY + this.triangleSize); // Bottom point (pointing down)
    ctx.lineTo(centerX - this.triangleSize / 2, topY); // Top left
    ctx.lineTo(centerX + this.triangleSize / 2, topY); // Top right
    ctx.closePath();
    ctx.fill();

  }

  /**
   * Draw a filled circle
   * @param {CanvasRenderingContext2D} ctx
   * @param {any} color
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} radius
   */
  drawCircle(ctx, color, centerX, centerY, radius = 8) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw a filled horizontal line
   * @param {CanvasRenderingContext2D} ctx
   * @param {any} color
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} length
   * @param {number} thickness
   */
  drawLine(ctx, color, centerX, centerY, length = 16, thickness = 4) {
    ctx.fillStyle = color;
    ctx.fillRect(centerX - length / 2, centerY - thickness / 2, length, thickness);
  }

  /**
   * 
   * @param {String} swingType 
   * @param {CanvasRenderingContext2D} ctx
   * @param {any} color
   * @param {number} centerX
   * @param {number} topY
   */
  evaluateSwingIcon(swingType, ctx, color, centerX, topY){
    if (swingType == SwingType.HEAVY){
      this.drawCircle(ctx, color, centerX, topY + this.triangleSize / 2);
      return;
    }

    if (swingType == SwingType.LIGHT) {
      this.drawLine(ctx, color, centerX, topY + this.triangleSize / 2);
      return;
    }
  }

  /**
    * @param {CanvasRenderingContext2D} ctx
     * @param {any} color
     * @param {number} centerX
     * @param {number} topY
     */
  evaluateIcon(ctx, color, centerX, topY) {
    // Draw swing type icon
    if(this.#character.combatState.isCharging || this.#character.combatState.swinging){
        this.evaluateSwingIcon(this.#character.combatState.swingType, ctx, color, centerX, topY);
        return;
    }   

    // Draw idle icon
    this.drawTriangle(ctx, color, centerX, topY);
  }

  /**
   * Draw the indicator above the character
   */
  draw() {
    if (!this.#character){
      return;
    } 

    let color = COLORS.player;
    if (this.#character.isOpponent) {
      color = COLORS.opponent;
    }

    // Position above character center
    const centerX = this.#character.x;
    const topY = this.#character.y - this.#character.height / 2 - this.offsetY;

    // Evaluate and draw appropriate icon
    this.evaluateIcon(this.ctx, color, centerX, topY);

    // Optional: Add a border for better visibility
    this.ctx.strokeStyle = COLORS.background;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  /**
   * Update the character this indicator points to
   * @param {Character} character - The new character
   */
  setCharacter(character) {
    this.#character = character;
  }
}
