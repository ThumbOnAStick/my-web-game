// Button.js
// Handles button rendering and interaction

import { InputManager } from "../../jsmanagers/inputmanager.js";
import { COLORS } from "../../jsutils/colors.js";

export class Button {
  /**
   * @param {string} text - The text to display on the button
   * @param {number} x - The x position of the button (top-left corner)
   * @param {number} y - The y position of the button (top-left corner)
   * @param {number} width - The width of the button
   * @param {number} height - The height of the button
   */
  constructor(text, x, y, width, height) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Draw the button and return whether it was clicked
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   * @param {InputManager} inputManager - The input manager
   * @returns {boolean} - Whether the button was clicked
   */
  draw(ctx, inputManager) {
    ctx.save();
    const isHovered = inputManager.isMouseWithin(this.x, this.y, this.width, this.height);

    // // Draw button background
    // ctx.fillStyle =  COLORS.surface;
    // ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw frame
    ctx.strokeStyle = isHovered ? COLORS.secondary : COLORS.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Draw text
    ctx.font = "10px Arial";
    ctx.fillStyle = isHovered ? COLORS.secondary : COLORS.primary;
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2, this.width);

    ctx.restore();
    return inputManager.isMouseDownWithin(this.x, this.y, this.width, this.height);
  }

  /**
   * Update button position
   * @param {number} x - New x position
   * @param {number} y - New y position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Update button text
   * @param {string} text - New text
   */
  setText(text) {
    this.text = text;
  }

  /**
   * Create a button centered at the given position
   * @param {string} text - The text to display on the button
   * @param {number} centerX - The center x position
   * @param {number} centerY - The center y position
   * @param {number} width - The width of the button
   * @param {number} height - The height of the button
   * @param {number} offsetY - Optional vertical offset
   * @returns {Button} - A new button instance
   */
  static createCentered(text, centerX, centerY, width, height, offsetY = 0) {
    const x = centerX - width / 2;
    const y = centerY - height / 2 + offsetY;
    return new Button(text, x, y, width, height);
  }
}
