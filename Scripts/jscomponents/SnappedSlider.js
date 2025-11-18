import { InputManager, ResourceManager } from "../library.js";
import { COLORS } from "../jsutils/colors.js";

export class SnappedSlider {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {ResourceManager} resourceManager
   * @param {string[]} labels
   * @param {InputManager} inputManager
   * @param {Number} x
   * @param {Number} y
   * @param {Number} length
   * @param {Number} height
   */
  constructor(
    labels,
    resourceManager,
    ctx,
    inputManager,
    x,
    y,
    length,
    height
  ) {
    this.labels = labels;
    this.resourceManager = resourceManager;
    this.size = labels.length;
    this.currentIndex = 0;
    this.ctx = ctx;
    (this.inputManager = inputManager), (this.x = x - length / 2);
    this.y = y;
    this.length = length;
    this.height = height;
    this.increment =
      labels.length > 1 ? this.length / (labels.length - 1) : this.length;
  }

  drawBar() {
    this.ctx.fillStyle = COLORS.primary;
    this.ctx.fillRect(this.x, this.y, this.length, this.height);
  }

  /**
   * @param {import("../library.js").GameManager} gamemanager
   */
  drawIndicators(gamemanager) {
    for (let index = 0; index < this.labels.length; index++) {
      const label = this.labels[index];
      const labelX = this.x + index * this.increment;
      let defaultColor = COLORS.primary;

      // Draw Bar
      if (this.currentIndex == index) {
        defaultColor = COLORS.secondary;
        this.ctx.fillStyle = defaultColor;
        this.ctx.fillRect(labelX, this.y, this.height, this.height * 2);
      }

      // Draw text
      this.ctx.font = "10px Arial";
      this.ctx.fillStyle = defaultColor;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        this.resourceManager.getTranslation(gamemanager, label),
        labelX,
        this.y - this.height
      );

    
    }
  }

  /**
   * @param {import("../library.js").GameManager} [gamemanager]
   */
  draw(gamemanager) {
    this.ctx.save();
    this.drawBar();
    this.drawIndicators(gamemanager);
    this.ctx.restore();
  }
}
