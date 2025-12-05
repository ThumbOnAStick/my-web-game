// oxlint-disable no-unused-vars
// oxlint-disable no-unused-expressions
import { ResourceManager } from "../jsmanagers/resourcemanager.js";
import { InputManager } from "../jsmanagers/inputmanager.js";
import { COLORS } from "../jsutils/colors.js";
import { GlobalFonts } from "../jsutils/globalfont.js";
import { UIElementCanvas, UIElementConfigurations } from "./uielement.js";

export class SnappedSlider extends UIElementCanvas {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {string[]} labels
   * @param {UIElementConfigurations} config
   * @param {Function} onValueChanged - Callback function when index changes
   */
  constructor(
    labels,
    ctx,
    config,
    onValueChanged = null
  ) {
    super(config);
    this.labels = labels;
    this.size = labels.length;
    this.currentIndex = 0;
    this.ctx = ctx;
    this.config.x = this.config.x - length / 2;
    this.increment =
      labels.length > 1 ? this.config.width / (labels.length - 1) : this.config.width;
    this.interactionArea = {
      x: this.config.x - this.config.height,
      y: this.config.y - this.config.height,
      width: this.config.width + this.config.height * 2,
      height: this.config.height * 3,
    };
    this.dragged = false;
    this.mouseX = -1;
    this.onValueChanged = onValueChanged;
  }

  drawBar() {
    this.ctx.fillStyle = COLORS.primary;
    this.ctx.fillRect(this.config.x,
      this.config.y,
      this.config.width,
      this.config.height);
  }

  isMouseDownInArea(index = 0) {
    const width = this.interactionArea.width / 3;
    return this.config.inputManager.isMouseDownWithin(
      this.interactionArea.x + index * width,
      this.interactionArea.y,
      width,
      this.interactionArea.height
    );
  }

  /**
   * 
   * @returns {boolean}
   */
  checkDragging() {
    const formerIndex = this.currentIndex;
    for (let index = 0; index < this.labels.length; index++) {
      if (!this.isMouseDownInArea(index)) {
        continue;
      }
      this.currentIndex = index;

      // Call onValueChanged if index changed
      if (formerIndex !== this.currentIndex && this.onValueChanged) {
        this.onValueChanged();
      }

      return true;
    }
    return false;
  }

  updateHandle() {
    if (!this.checkDragging()) {
      this.mouseX = -1
      return;
    }
    this.mouseX = this.config.inputManager.mouse.x;
  }


  drawIndicators() {
    for (let index = 0; index < this.labels.length; index++) {
      const label = this.labels[index];
      const labelX = this.config.x + index * this.increment;
      let defaultColor = COLORS.primary;

      // Draw handle
      if (this.currentIndex == index) {
        const handleX = this.mouseX > -1 ? this.mouseX : labelX;
        defaultColor = COLORS.secondary;
        this.ctx.fillStyle = defaultColor;
        this.ctx.fillRect(handleX, this.config.y, this.config.height, this.config.height * 2);
      }

      // Draw text
      this.ctx.font = GlobalFonts.small;
      this.ctx.fillStyle = defaultColor;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        this.config.resourceManager.getTranslation(label),
        labelX,
        this.config.y - this.config.height
      );
    }
  }

  getDescriptionKey() {
    let key = this.labels[this.currentIndex]
    return `${key}Description`
  }

  draw() {
    this.ctx.save();
    this.drawBar();
    this.drawIndicators();
    this.ctx.restore();
    this.updateHandle();
  }
}
