import { gameEventManager } from "../jsmanagers/eventmanager.js";
import * as EventHandlers from '../jsutils/eventhandlers.js'


export class GameState {
  constructor() {
    this.winner = null;
    this.difficulty = 0;
    this.isGameOver=false;
  }

  /**
   *
   * @param {Number} amount
   * @param {String} labelPlayer
   * @param {String} labelPC
   */
  updatePlayerScore(amount, labelPlayer, labelPC) {
    if (this.isGameOver) return;
    if (amount <= 0) {
      this.endGame(labelPC);
    }

    if (amount >= 100) {
      this.endGame(labelPlayer);
    }
  }

  /**
   * 
   * @param {Number} value 
   */
  setDifficulty(value){
    this.difficulty = value;
  }

  /**
   *
   * @param {Number} amount
   * @param {String} labelPlayer
   * @param {String} labelPC
   */
  updateOpponentScore(amount, labelPlayer, labelPC) {
    if (this.isGameOver) return;
    if (amount <= 0) {
      this.endGame(labelPlayer);
    }

    if (amount >= 100) {
      this.endGame(labelPC);
    }
  }

  /**
   *
   * @param {String} winner
   */
  endGame(winner) {
    this.winner = winner;
    console.log(`Game Over! Winner: ${winner}`);
    gameEventManager.emit(EventHandlers.playNamedClipEvent, "clapping", 0.5);
  }

  reset() {
    this.winner = null;
    this.isGameOver = false;
  }

  getWinner() {
    return this.winner;
  }
}