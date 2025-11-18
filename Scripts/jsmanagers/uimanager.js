// UIManager.js
// Handles UI rendering and states

import { GameState } from "../jscomponents/gamestate.js";
import { Character } from "../jsgameobjects/character.js";
import { gameEventManager } from "./eventmanager.js";
import { InputManager } from "./inputmanager.js";
import { COLORS, getHealthColor } from "../jsutils/colors.js";
import { ResourceManager } from "./resourcemanager.js";
import { GameManager } from "./gamemanager.js";
import { Button } from "../jscomponents/uielements/button.js";
import { Indicator } from "../jscomponents/uielements/indicator.js";
import { SnappedSlider } from "../jscomponents/uielements/snappedslider.js";

export class UIManager {
  /**
   *
   * @param {*} ctx
   * @param {HTMLCanvasElement} canvas
   * @param {InputManager} inputmanager
   * @param {ResourceManager} resourceManager   
   */
  constructor(ctx, canvas, inputmanager, resourceManager) {
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    this.canvas = canvas;
    this.snappedSlider = new SnappedSlider(
      ["Level0", "Level1", "Level2"],
      resourceManager,
      ctx,
      inputmanager,
      canvas.width / 2,
      canvas.height / 2 + 100,
      300,
      10
    );
    /** @type {Map<Character, Indicator>} */
    this.indicators = new Map();
  }

  /**
   *
   * @param {Character} character
   * @param {String} scoreLabel
   * @param {*} x
   * @param {*} y
   * @param {*} score
   * @returns
   */
  drawScoreBar(character, scoreLabel, x = 10, y = 50, score = null) {
    if (!character) return;

    const barWidth = 200;
    const barHeight = 20;
    const margin = 2;

    // Use provided score or fall back to character's score
    const currentScore = score !== null ? score : character.currentScore;
    const maxScore = character.maxScore || 100; // Default max score
    const scorePercentage = currentScore / maxScore;

    // Background (dark)
    this.ctx.fillStyle = COLORS.border;
    this.ctx.fillRect(x, y, barWidth + margin, barHeight + margin);

    // Health bar (color based on health percentage)
    const healthWidth = barWidth * scorePercentage;
    this.ctx.fillStyle = getHealthColor(scorePercentage);

    this.ctx.fillRect(x, y, healthWidth, barHeight);

    // Health text
    this.ctx.font = "14px Arial";
    this.ctx.fillStyle = COLORS.primary;
    this.ctx.fillText(`${scoreLabel}: ${currentScore}/${maxScore}`, x, y - 5);
  }

  drawScoreChanges() {
    /**@type {Character} */
    const scoreChanger = gameEventManager.scoreChanger;
    const scoreChanges = gameEventManager.scoreChanges;

    if (!scoreChanger || scoreChanges == 0) {
      return;
    }

    let drawLocX = scoreChanger.isOpponent ? this.canvas.width - 250 : 250;
    let sign = scoreChanges > 0 ? "+" : "";
    this.ctx.save();
    const drawLocY = 60;
    this.ctx.textAlign = "center";
    this.ctx.font = "15px Arial";
    this.ctx.fillStyle = scoreChanges > 0 ? COLORS.success : COLORS.danger;
    this.ctx.fillText(sign + String(scoreChanges), drawLocX, drawLocY);
    this.ctx.restore();
  }

  /**
   *
   * @param {Character} character
   */
  drawIndicator(character) {
    if (!character) return;

    // Get or create indicator for this character
    if (!this.indicators.has(character)) {
      this.indicators.set(character, new Indicator(character));
    }

    const indicator = this.indicators.get(character);
    indicator.draw(this.ctx);
  }

  /**
   *
   * @param {String} gameOverLabel
   */
  drawGameoverSign(gameOverLabel) {
    this.ctx.save();
    // Draw gameover sign
    this.ctx.textAlign = "center";
    this.ctx.font = "40px Arial";
    this.ctx.fillStyle = COLORS.primary;
    this.ctx.fillText(
      gameOverLabel,
      this.canvas.width / 2,
      this.canvas.height / 3
    );
    this.ctx.restore();
  }

  /**
   *
   * @param {String} winnerLabel
   * @param {String} winsLabel
   */
  drawGameResult(winnerLabel, winsLabel) {
    // Draw game result
    this.ctx.save();
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = COLORS.secondary;
    this.ctx.font = "20px Arial";
    this.ctx.fillText(
      `${winnerLabel} ${winsLabel}`,
      this.canvas.width / 2,
      this.canvas.height / 3 + 40
    );
    this.ctx.restore();
  }

  /**
   * @returns {boolean}
   * @param {InputManager} inputmanager
   * @param {String} reStartButtonLabel
   */
  drawRestartButton(inputmanager, reStartButtonLabel) {
    return this.drawButtonCenter(
      reStartButtonLabel,
      this.canvas.width / 2,
      this.canvas.height / 3 + 80,
      100,
      30,
      inputmanager
    );
  }

  /**
   * @returns {boolean}
   * @param {String} winnerLabel
   * @param {String} winsLabel
   * @param {String} restartButtonLabel
   * @param {String} gameoverLabel
   * @param {InputManager} inputManager
   */
  drawGameOver(
    gameoverLabel,
    restartButtonLabel,
    winnerLabel,
    winsLabel,
    inputManager
  ) {
    this.drawGameoverSign(gameoverLabel);
    this.drawGameResult(winnerLabel, winsLabel);
    return this.drawRestartButton(inputManager, restartButtonLabel);
  }

  /**
   * @returns {boolean}
   */
  drawGotoMenuButton(inputmanager, menuButtonLabel) {
    return this.drawButtonCenter(
      menuButtonLabel,
      this.canvas.width / 2,
      (this.canvas.height * 2) / 3,
      100,
      30,
      inputmanager
    );
  }

  /**
   * @returns {boolean}
   * @param {InputManager} inputmanager
   * @param {String} startButtonLabel
   */
  drawStartButton(inputmanager, startButtonLabel) {
    return this.drawButtonCenter(
      startButtonLabel,
      this.canvas.width / 2,
      this.canvas.height / 3 + 80,
      100,
      30,
      inputmanager
    );
  }


  /**
   * 
   * @param {GameState} gameState 
   */
  drawSnappedSlider(gameState) {
    this.snappedSlider.draw();
    // Update gamestate 
    gameState.difficulty = this.snappedSlider.currentIndex;
  }

  /**
   *
   * @param {String} title
   */
  drawMenuSign(title) {
    this.ctx.save();
    this.ctx.textAlign = "center";
    this.ctx.font = "40px Arial";
    this.ctx.fillStyle = COLORS.primary;
    this.ctx.fillText(title, this.canvas.width / 2, this.canvas.height / 3);
    this.ctx.restore();
  }

  /**
   * @param {GameState} gameState
   * @param {InputManager} inputManager
   * @param {String} title
   * @param {String} startButtonLabel
   * @returns {boolean} 
   */
  drawMenu(gameState, inputManager, title, startButtonLabel) {
    this.drawMenuSign(title);
    this.drawSnappedSlider(gameState);
    return this.drawStartButton(inputManager, startButtonLabel);
  }

  /**
   * @param {String} letter
   * @param {Character} character
   */
  drawDodged(letter, character) {
    // @ts-ignore
    if (!character.getDodging()) return;
    const offsetY = -100; // Distance above character
    this.ctx.fillStyle = COLORS.secondary;
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(letter, character.x, character.y + offsetY);
    this.ctx.textAlign = "start";
  }

  drawLoadingScreen() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = COLORS.primary;
    this.ctx.fillText(
      "Loading Resources...",
      this.canvas.width / 2 - 100,
      this.canvas.height / 2
    );
  }

  /**
   *
   * @param {Character} character
   * @param {GameState} gamestate
   * @param {InputManager} inputmanager
   * @param {boolean} showDebug
   * @returns
   */
  drawDebugInfo(character, gamestate, inputmanager, showDebug = false) {
    if (!showDebug || !character) return;

    this.ctx.font = "12px Arial";
    this.ctx.fillStyle = COLORS.secondary;

    // Draw character debug info
    const debugHeight = 15;
    const debugY = this.canvas.height - debugHeight * 8;
    this.ctx.fillText(
      `Position: (${Math.round(character.x)}, ${Math.round(character.y)})`,
      10,
      debugY
    );
    this.ctx.fillText(
      `Swinging: ${character.combatState.swinging}`,
      10,
      debugY + debugHeight * 3
    );
    this.ctx.fillText(
      `Gamestate: Game Over: ${gamestate.isGameOver()}\nPlayer score: ${character.currentScore}`,
      10,
      debugY + debugHeight * 4
    );
    this.ctx.fillText(
      `MouseX: ${inputmanager.mouse.x}, MouseY: ${inputmanager.mouse.y}, MouseDown: ${inputmanager.mouse.isDown}`,
      10,
      debugY + debugHeight * 5
    );
  }

  clearScreen() {
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * @param {InputManager} inputManager
   * @returns {boolean}
   */
  drawButtonCenter(text, x, y, width, height, inputManager, offsetY = 0) {
    const button = Button.createCentered(text, x, y, width, height, offsetY);
    return button.draw(this.ctx, inputManager);
  }

  /**
   * @param {InputManager} inputManager
   * @returns {boolean}
   * @param {string} text
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  drawButton(text, x, y, width, height, inputManager) {
    const button = new Button(text, x, y, width, height);
    return button.draw(this.ctx, inputManager);
  }
}
