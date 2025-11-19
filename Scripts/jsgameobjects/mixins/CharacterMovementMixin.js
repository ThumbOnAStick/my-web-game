// CharacterMovementMixin.js
// Contains all movement-related methods for Character

import { Character } from "../character.js";
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import * as EventHandler from "../../jsutils/eventhandlers.js";

export const CharacterMovementMixin = {
  /**
   * Make character jump
   */
  jump() {
    if (this.grounded) {
      this.grounded = false;
      console.log("try to jump");
      this.rigidbody.applyForce(12, 0, -1);
      gameEventManager.emit(EventHandler.characterJumpEvent, { character: this });
    }
  },

  /**
   * Check if character cannot move
   * @returns {boolean}
   */
  cannotMove() {
    return !this.combatState.canMove();
  },

  /**
   * Move character in a direction
   * @param {number} dir - Direction to move (1 or -1)
   */
  move(dir) {
    if (this.cannotMove()) {
      return;
    }
    this.facing = dir;
    this.rigidbody.move(dir);
    gameEventManager.emit(EventHandler.characterMoveEvent, { character: this });
  },

  /**
   * Adjust facing direction to face another character
   * @param {Character} other - Other character to face
   */
  adjustHitFacing(other) {
    this.facing = other.x > this.x ? 1 : -1;
  },

  /**
   * Flip facing direction
   */
  flip() {
    this.facing = -this.facing;
  },
};
