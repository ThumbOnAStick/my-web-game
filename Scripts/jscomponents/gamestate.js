import { gameEventManager } from "../jsmanagers/eventmanager.js";
import * as EventHandlers from '../jsutils/eventhandlers.js'


export class GameState {
  constructor() {
    this.scene = "menu"; // 'menu', 'gameover' or 'running'
    this.winner = null;
    this.difficulty = 0;
  }

  /**
   *
   * @param {Number} amount
   * @param {String} labelPlayer
   * @param {String} labelPC
   */
  updatePlayerScore(amount, labelPlayer, labelPC) {
    if (this.isGameOver()) return;
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
    if (this.isGameOver()) return;
    if (amount <= 0) {
      this.endGame(labelPlayer);
    }

    if (amount >= 100) {
      this.endGame(labelPC);
    }
  }

  startGame() {
    this.scene = "running";
  }

  isInMenu() {
    return this.scene == "menu";
  }

  isGameRunning() {
    return this.scene == "running";
  }

  isGameOver() {
    return this.scene == "gameover";
  }

  /**
   *
   * @param {String} winner
   */
  endGame(winner) {
    this.scene = "gameover";
    this.winner = winner;
    console.log(`Game Over! Winner: ${winner}`);
    gameEventManager.emit(EventHandlers.playNamedClipEvent, "clapping", 0.5);
  }

  gotoMenu() {
    this.scene = "menu";
  }

  reset() {
    this.scene = "running";
    this.winner = null;
  }

  getWinner() {
    return this.winner;
  }

  getScene() {
    return this.scene;
  }
}