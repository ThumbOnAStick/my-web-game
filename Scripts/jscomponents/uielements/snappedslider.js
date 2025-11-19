import { InputManager, ResourceManager } from "../../library.js";
import { COLORS } from "../../jsutils/colors.js";
import { GlobalFonts } from "../../jsutils/globalfont.js";

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
   * @param {Function} onValueChanged - Callback function when index changes
   */
  constructor(
    labels,
    resourceManager,
    ctx,
    inputManager,
    x,
    y,
    length,
    height,
    onValueChanged = null
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
    this.interactionArea = {
      x: this.x - this.height,
      y: this.y - this.height,
      width: this.length + this.height * 2,
      height: this.height * 3,
    };
    this.dragged = false;
    this.mouseX = -1;
    this.onValueChanged = onValueChanged;
  }

  drawBar() {
    this.ctx.fillStyle = COLORS.primary;
    this.ctx.fillRect(this.x, this.y, this.length, this.height);
  }

  isMouseDownInArea(index = 0) {
    const width = this.interactionArea.width/3;
    return this.inputManager.isMouseDownWithin(
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
    if(!this.checkDragging()) {
      this.mouseX = -1
      return;
    }
    this.mouseX = this.inputManager.mouse.x;
  }


  drawIndicators() {
    for (let index = 0; index < this.labels.length; index++) {
      const label = this.labels[index];
      const labelX = this.x + index * this.increment;
      let defaultColor = COLORS.primary;

      // Draw handle
      if (this.currentIndex == index) {
        const handleX = this.mouseX > -1 ? this.mouseX : labelX;
        defaultColor = COLORS.secondary;
        this.ctx.fillStyle = defaultColor;
        this.ctx.fillRect(handleX, this.y, this.height, this.height * 2);
      }

      // Draw text
      this.ctx.font = GlobalFonts.small;
      this.ctx.fillStyle = defaultColor;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        this.resourceManager.getTranslation(label),
        labelX,
        this.y - this.height
      );
    }
  }

  getDescriptionKey() {
    let key =  this.labels[this.currentIndex]
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
