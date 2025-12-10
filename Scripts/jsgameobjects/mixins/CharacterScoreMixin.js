// CharacterScoreMixin.js
// Contains all score-related methods for Character
import { gameEventManager } from "../../jsmanagers/eventmanager.js";
import * as EventHandler from "../../jsutils/events/eventhandlers.js";

export const CharacterScoreMixin = {
  /**
   * Lose score
   * @param {number} amount
   */
  loseScore(amount) {
    if (this.defeated) return;

    this.currentScore = Math.max(0, this.currentScore - amount);

    gameEventManager.emit(EventHandler.setScoreChangesEvent, {
      value: -amount,
      character: this,
    });

    if (this.currentScore <= 0) {
      this.defeated = true;
      // To be implemented - defeat animation
    } else {
      // Dodged
    }
  },

  /**
   * Reset score to default
   */
  resetScore() {
    this.currentScore = 50;
    this.defeated = false;
  },

  /**
   * Add score
   * @param {number} amount
   */
  score(amount) {
    if (this.defeated) return;
    this.currentScore = Math.min(this.maxScore, this.currentScore + amount);
    gameEventManager.emit(EventHandler.setScoreChangesEvent, {
      value: amount,
      character: this,
    });
  },

  /**
   * Get score as percentage
   * @returns {number}
   */
  getScorePercentage() {
    return this.currentScore / this.maxScore;
  },
};
