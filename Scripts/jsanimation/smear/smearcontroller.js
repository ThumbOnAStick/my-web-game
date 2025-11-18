import { Controller } from "../../jscomponents/controller.js";
import { ControllerStatus } from "../../jscomponents/controllerstatus.js";
import { SpritePart } from "../spritepart.js";
import { SmearPart } from "./smearpart.js";



export class SmearController extends Controller {
  /**
   *
   * @param {SpritePart} spritePart
   * @param {*} options
   */
  constructor(spritePart, options) {
    super();
    this.spritePart = spritePart;
    this.updateDuration = options.updateDuration;
    this.currentFrame = 0;
    /**
     * @type {SmearPart[]}
     */
    this.storedSmearParts = [];
  }

  update(options) {
    this.currentFrame += 1;
    if (this.currentFrame % this.updateDuration > 0.1) {
      return;
    }

    // Update logic
    this.capture(options);

    // Check expired parts
    this.storedSmearParts = this.storedSmearParts.filter(
      (smearPart) => !smearPart.shouldDrop(this.currentFrame)
    );
  }

  /**
   * Captures the spritepart of a frame
   */
  capture(options) {
    if (this.status != ControllerStatus.RUNNING) {
      return;
    }
    let smearPart = new SmearPart(options, this.currentFrame);
    this.storedSmearParts.push(smearPart);
  }

  /**
   *
   */
  draw() {
      if (this.status != ControllerStatus.RUNNING) {
      return;
    }
    for (let index = 0; index < this.storedSmearParts.length; index++) {
      const element = this.storedSmearParts[index];
      element.draw(this.spritePart);
    }
  }

  turnOff(){
    super.turnOff()
    this.storedSmearParts = []
  }
}
