// GameManager.js
// Main game manager that coordinates all systems
import * as Eventhandler from "../jsutils/eventhandlers.js";
import { ObstacleManager } from "./obstaclemanager.js";
import { GameState } from "../jscomponents/gamestate.js";
import { gameEventManager } from "./eventmanager.js";
import { Character } from "../jsgameobjects/character.js";
import { Resources } from "../jscomponents/resources.js";
import { InputManager } from "./inputmanager.js";
import { ResourceManager } from "./resourcemanager.js";
import { UIManager } from "./uimanager.js";
import { AIController } from "../jsai/aicontroller.js";
import { TickManager } from "./tickmanager.js";
import { VFXManager } from "./vfxmanager.js";
import { AudioManager } from "./audiomanager.js";
import { GameLoopManager } from "./gameloopmanager.js";
import { CharacterManager } from "./charactermanager.js";
import { RenderManager } from "./rendermanager.js";
import { GameInitializer } from "./gameinitializer.js";

export class GameManager {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param {*} ctx
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    /**@type {Resources} */
    this.resources = null;
    /**@type {AIController} */
    this.aiController = null;
    /**@type {VFXManager} */
    this.vfxManager = null; // Can't load vfxManager before resources are loaded

    // Initialize game state
    this.gameState = new GameState();

    // Initialize core managers
    this.inputManager = new InputManager(canvas);
    this.obstacleManager = new ObstacleManager();
    this.resourceManager = new ResourceManager();
    this.audioManager = new AudioManager(this.resourceManager);
    this.uiManager = new UIManager(ctx, canvas, this.inputManager, this.resourceManager);
    this.tickManager = new TickManager(Date.now());

    // Initialize new specialized managers
    this.gameLoopManager = new GameLoopManager();
    this.characterManager = new CharacterManager(canvas, null); // Will be set after resources load
    this.renderManager = new RenderManager(ctx, canvas, this.uiManager, null); // VFX manager set later
    this.gameInitializer = new GameInitializer(this);

    // Set up manager references
    this.inputManager.setGameManager(this);
    this.selectedLanguage = "English";

    // Set up debug checkbox
    /**@type {HTMLInputElement} */
    this.debugCheckbox = /** @type {HTMLInputElement} */ (
      document.getElementById("debugCheckbox")
    );
    this.debugSlider = /** @type {HTMLInputElement} */ (
      document.getElementById("debugSlider")
    );
    this.loseGameButton = /** @type {HTMLInputElement} */ (
      document.getElementById("loseGameButton")
    );
    this.languageSelector = /**@type {HTMLInputElement} */ (
      document.getElementById("languageSelector")
    );
    this.setupDebugControls();

    // Set up game loop callback
    this.gameLoopManager.setUpdateCallback(() => this.update());
  }

  /**
   * Initialize VFX Manager after resources are loaded
   */
  initializeVFXManager() {
    this.vfxManager = new VFXManager(this.resourceManager);
    this.renderManager.vfxManager = this.vfxManager;
  }

  async initialize() {
    await this.gameInitializer.initialize();
    // Update character manager with loaded resources
    this.characterManager.resources = this.resources;
  }

  start() {
    if (!this.gameInitializer.getIsInitialized()) {
      console.warn("Game not initialized yet");
      return;
    }
    this.gameLoopManager.start();
  }

  stop() {
    this.gameLoopManager.stop();
  }

  update() {
    // Update display language
    this.selectedLanguage = this.languageSelector.value;

    // Update event manager for delayed events
    gameEventManager.update();

    // Update all characters (every frame)
    this.characterManager.updateCharacters();

    // Only update when game is not over
    if (this.isGameRunning()) {
      // Handle movement
      this.inputManager.update();

      // Ticks update
      this.tickManager.update();

      // Check obstacle manager
      this.obstacleManager.update();

      // Check collisions
      this.obstacleManager.handleCharacterCollisions(
        this.characterManager.getCharacters()
      );

      // Manage VFX
      this.vfxManager.update();

      // Update score, check game state
      const labelPlayer = this.getTranslation("Player");
      const labelPC = this.getTranslation("PC");
      this.gameState.updatePlayerScore(
        this.characterManager.getPlayerScore(),
        labelPlayer,
        labelPC
      );
      this.gameState.updateOpponentScore(
        this.characterManager.getOpponentScore(),
        labelPlayer,
        labelPC
      );
    }

    // Clear screen before drawing
    this.renderManager.clearScreen();

    // Draw everything
    this.draw();
  }

  draw() {
    // Menu drawing
    if (
      this.renderManager.drawMenu(
        this.isInMenu(),
        this.inputManager,
        this,
        this.resourceManager
      )
    ) {
      this.gameState.startGame();
    }

    // Gameover drawing
    if (
      this.renderManager.drawGameOver(
        this.isGameOver(),
        this.gameState.winner,
        this.inputManager,
        this,
        this.resourceManager
      )
    ) {
      this.resetGame();
    }

    // Go to menu button
    if (
      this.renderManager.drawGotoMenuButton(
        this.isGameOver(),
        this.inputManager,
        this,
        this.resourceManager
      )
    ) {
      this.gotoMenu();
    }

    // Character drawing
    this.renderManager.drawCharacters(
      this.characterManager.getCharacters(),
      this.resources,
      this.isGameRunning(),
      this.debugCheckbox.checked,
      this.gameState,
      this.inputManager,
      this,
      this.resourceManager
    );

    // VFX drawing
    this.renderManager.drawVFX();
  }

  resetGame() {
    // Reset characters
    this.characterManager.resetCharacters();

    // Clear obstacles
    this.obstacleManager.clearObstacles();

    // Reset game state using GameState
    this.gameState.reset();
  }

  gotoMenu() {
    // Reset characters
    this.characterManager.resetCharacters();

    // Clear obstacles
    this.obstacleManager.clearObstacles();
    this.gameState.gotoMenu();
  }

  setupDebugControls() {
    this.debugCheckbox.addEventListener("change", () => {
      this.canvas.focus();
    });

    this.debugSlider.addEventListener("input", () => {
      this.characterManager.setDrawSize(
        parseFloat(this.debugSlider.value) / 50.0
      );
    });

    this.loseGameButton.addEventListener("click", () => {
      if (this.isGameRunning()) {
        const labelPC = this.getTranslation("PC");
        this.gameState.endGame(labelPC);
      }
    });

    // Make canvas focusable
    this.canvas.setAttribute("tabindex", "0");
  }

  /**
   *
   * @param {*} element
   * @returns {String}
   */
  getTranslation(element) {
    return this.resourceManager.getTranslation(this, element);
  }

  // Getter methods for external access
  isGameRunning() {
    return this.gameState.isGameRunning();
  }
  isGameOver() {
    return this.gameState.isGameOver();
  }
  isInMenu() {
    return this.gameState.isInMenu();
  }
  getPlayer() {
    return this.characterManager.getPlayer();
  }
  getOpponent() {
    return this.characterManager.getOpponent();
  }
  getCharacters() {
    return this.characterManager.getCharacters();
  }
  getGameState() {
    return this.gameState;
  }
  getPlayerScore() {
    return this.characterManager.getPlayerScore();
  }
  getOpponentScore() {
    return this.characterManager.getOpponentScore();
  }
}
