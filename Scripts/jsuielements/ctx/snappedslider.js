// oxlint-disable no-unused-vars
// oxlint-disable no-unused-expressions
import { ResourceManager } from "../../jsmanagers/resourcemanager.js";
import { InputManager } from "../../jsmanagers/inputmanager.js";
import { COLORS } from "../../jsutils/ui/uicolors.js";
import { GlobalFonts } from "../../jsutils/ui/uiglobalfont.js";
import { UIElementCanvas, UIElementConfigurations } from "./uielement.js";
import { debugManager } from "../../jsmanagers/debugmanager.js";

export class SnappedSlider extends UIElementCanvas {
  #interactionArea;
  #interactionAreaInitial;
  #labels;
  #translationKeys;
  #currentIndex;
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {string[]} translationKeys
   * @param {UIElementConfigurations} config
   * @param {Function} onValueChanged - Callback function when index changes
   */
  constructor(
    translationKeys,
    ctx,
    config,
    onValueChanged = null
  ) {
    super(config, ctx);
    this.#translationKeys = translationKeys;
    this.size = translationKeys.length;
    this.#currentIndex = 0;
    this.config.x = this.config.x - length / 2;
    this.increment =
      translationKeys.length > 1 ? this.config.width / (translationKeys.length - 1) : this.config.width;
    this.#interactionArea = {
      x: this.config.x - this.config.height,
      y: this.config.y - this.config.height,
      width: this.config.width + this.config.height * 2,
      height: this.config.height * 3,
    };
    this.#interactionAreaInitial = this.#interactionArea;
    this.#labels = [];
    this.dragged = false;
    this.mouseX = -1;
    this.onValueChanged = onValueChanged;
  }

  init() {
    super.init();
    window.addEventListener('mousedown', (e) => this.tryToExpandInterationArea());
    window.addEventListener('mouseup', (e) => this.resetInteractionArea());
  }

  drawBar() {
    this.ctx.fillStyle = COLORS.primary;
    this.ctx.fillRect(this.config.x,
      this.config.y,
      this.config.width,
      this.config.height);
  }

  isMouseDownInArea(index = 0) {
    const width = this.#interactionArea.width / 3;
    return this.config.inputManager.isMouseDownWithin(
      this.#interactionArea.x + index * width,
      this.#interactionArea.y,
      width,
      this.#interactionArea.height
    );
  }

  resetInteractionArea() {
    this.#interactionArea = { ...this.#interactionAreaInitial };
  }

  expandInteractionArea() {
    this.#interactionArea.height = this.config.width;
    this.#interactionArea.width = this.config.width;

  }

  tryToExpandInterationArea() {
    if (this.config.isMouseWithin()) {
      this.expandInteractionArea();
      debugManager.popMessage("Try to expand interation area");
    }
  }

  setCurrentIndex(index) {
    this.#currentIndex = index;
  }


  /**
   * 
   * @returns {boolean}
   */
  checkDragging() {
    const formerIndex = this.#currentIndex;
    for (let index = 0; index < this.#translationKeys.length; index++) {
      if (!this.isMouseDownInArea(index)) {
        continue;
      }

      // Change current index
      this.setCurrentIndex(index)

      // Change interaction area
      this.expandInteractionArea();

      // Call onValueChanged if index changed
      if (formerIndex !== this.#currentIndex && this.onValueChanged) {
        this.onValueChanged(this.#currentIndex);
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
    for (let index = 0; index < this.#translationKeys.length; index++) {
      const translationKey = this.#translationKeys[index];
      const translationKeyX = this.config.x + index * this.increment;
      let defaultColor = COLORS.primary;

      // Draw handle
      if (this.#currentIndex == index) {
        const handleX = this.mouseX > -1 ? this.mouseX : translationKeyX;
        defaultColor = COLORS.secondary;
        this.ctx.fillStyle = defaultColor;
        this.ctx.fillRect(handleX, this.config.y, this.config.height, this.config.height * 2);
      }

      // Draw text
      this.ctx.font = GlobalFonts.small;
      this.ctx.fillStyle = defaultColor;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        this.#labels[index],
        translationKeyX,
        this.config.y - this.config.height
      );
    }
  }

  onTranslationsChanged() {
    super.onTranslationsChanged();
    this.#labels = this.config.resourceManager.getTranslations(this.#translationKeys);
  }

  getDescriptionKey() {
    let key = this.#translationKeys[this.#currentIndex]
    return `${key}Description`
  }

  draw() {
    super.draw();
    this.ctx.save();
    this.drawBar();
    this.drawIndicators();
    this.ctx.restore();
  }

  update() {
    super.update()
    this.updateHandle();
  }
}
